'use strict';


var utils = require('../../lib/utils');
var log = require('../../lib/logUtil');
var constant = require('../../lib/constant');
var placeUtil = require('../../lib/placeUtil');

var cfg = require('../../config');
var request = require("request");
var rp = require("request-promise");

var PlaceModel = require("../../dbservices/Place");
var place = new PlaceModel();

var internals = {};
var placeCache = null;

function _getFromCache(input, reply) {
  let inputKhongDau = placeUtil.chuanHoaAndLocDau(input);

  let ret = [];
  for (var i=0; i < placeCache.length; i++) {
    let e = placeCache[i];

    //console.log(e.nameKhongDau);
    
    //exceptional for Quan-1, quan-2...
    if ((e.nameKhongDau.indexOf(inputKhongDau) > -1)
      || (!isNaN(e.nameKhongDau) && ('quan-'+e.nameKhongDau).indexOf(inputKhongDau) > -1)) {
        ret.push(e);
        if (ret.length >= 10) {
          break;
        }
    }
    
  }
  
  if (ret.length == 0) {
    console.log("Not match!!!");
  }

  //sort
  let map = {
    "T" : 1,
    "H" : 2,
    "X" : 3,
    "A" : 4
  };

  ret.sort((a, b) => {
    if (map[a.placeType] > map[b.placeType]) {
      return 1;
    }

    if (map[a.placeType] < map[b.placeType]) {
      return -1;
    }

    if (a.placeName > b.placeName) {
      return 1;
    }

    return 0;
  });

  _returnToClient(ret, reply);
}


function _returnToClient(list, reply) {
  var predictions = [];

  if (list) {
    predictions = list.map((e) => {
      let vp = e.geometry.viewport;

      return {
        placeName : e.placeName,
        fullName : e.fullName,
        shortName : placeUtil.getShortName(e.fullName),
        placeType : e.placeType,
        placeId : e.id,
        tinh : e.codeTinh,
        huyen: e.codeHuyen,
        xa : e.codeXa,
        duAn : e.codeDuAn,
        viewport : {
          "northeast": {
            "lat": vp.northeast.lat,
            "lon": vp.northeast.lon
          },
          "southwest": {
            "lat": vp.southwest.lat,
            "lon": vp.southwest.lon
          }
        }
      }
    });
  }

  console.log("matched:", predictions);

  reply({
    predictions : predictions,
    status: "OK"
  });
}

internals.getPlaceByID = function(req,reply){
  var payload = req.payload;
  log.info("getPlaceByID, payload=", payload);

  if (!payload.placeId) {
    reply({
      place : undefined,
      status: "OK"
    });

    return;
  }
  place.getPlaceByID(payload.placeId,(err,res) => {
    if(err){
      console.log("getPlaceByID error ", err);
      reply({
        place : undefined,
        status: "ERROR " + err
      });
      return;
    }
    reply({
      place : res[0],
      status: "OK"
    });
  });
}

internals.autocomplete = function(req, reply) {
  var query = req.query;
  log.info("autocomplete, query=", query);

  if (!query.input) {
    reply({
      predictions : [],
      status: "OK"
    });

    return;
  }

  //
  if (!placeCache) {
    place.getAllPlaces((err, res) => {
      if (err) {
        console.log("getAllPlaces error:", err);

        reply({
          predictions : [],
          status: "ERROR " + err
        });
        return;
      }

      placeCache = res;

      return _getFromCache(query.input, reply)
    }) ;

    return;
  }

  return _getFromCache(query.input, reply);

/*
  place.getPlaceByNameLike(query.input, (err, res) => {
    //console.log(res);

    if (err) {
      reply({
        predictions : [],
        status: "ERROR " + err
      });

      return;
    }

    _returnToClient(res, reply);
  });
*/

};



module.exports = internals;