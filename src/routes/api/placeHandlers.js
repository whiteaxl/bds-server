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

var DBCache = require("../../lib/DBCache");

var internals = {};

function _getFromCache(input, reply) {
  let inputKhongDau = placeUtil.chuanHoaAndLocDau(input);

  /*
   let placeCache = DBCache.placeAsArray();

   let ret = [];

   for (var i=0; i < placeCache.length; i++) {
    let e = placeCache[i];
    //console.log(e.nameKhongDau);
    //exceptional for Quan-1, quan-2...
    if ((e.nameKhongDau.indexOf(inputKhongDau) > -1)
      || (!isNaN(e.nameKhongDau) && ('quan-'+e.nameKhongDau).indexOf(inputKhongDau) > -1)) {
        ret.push(e);
        //if (ret.length >= 10) {
        //  break;
        //}
    }
  }
  */

  let ret = DBCache.searchPlace(inputKhongDau);

  ret = ret && ret.slice(0, 10);

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

     /*
     if (a.placeName > b.placeName) {
      return 1;
     }
     */

      return 0;
   });


  if (ret.length == 0) {
    console.log("Not match!!!");
  }

  _returnToClient(ret , reply);
}


function _returnToClient(list, reply) {
  var predictions = [];

  if (list) {
    predictions = list.map((e) => {
      return _convertFromPlaceRaw(e);
    });
  }

  console.log("matched:", predictions);

  reply({
    predictions : predictions,
    status: "OK"
  });
}

function _convertFromPlaceRawList(placeRawList){
  var result = [];

  if (placeRawList) {
    result = placeRawList.map((e) => {
          return _convertFromPlaceRaw(e);
    });
  }

  console.log("matched:", result);
  return result
}

function _convertFromPlaceRaw(placeRaw){
  let vp = placeRaw.geometry.viewport;

  return {
    placeName : placeRaw.placeName,
    fullName : placeRaw.fullName,
    shortName : placeUtil.getShortName(placeRaw.fullName),
    placeType : placeRaw.placeType,
    placeId : placeRaw.id,
    tinh : placeRaw.codeTinh,
    huyen: placeRaw.codeHuyen,
    xa : placeRaw.codeXa,
    duAn : placeRaw.codeDuAn,
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
}

function _getDuAnFromCache(diaChinhQuan) {
  let placeCache = DBCache.placeAsArray();

  if (!placeCache){
    return undefined;
  }

  let ret = [];
  for (var i=0; i < placeCache.length; i++) {
    let e = placeCache[i];
    if ((e.codeTinh==diaChinhQuan.tinh)
         && (e.codeHuyen==diaChinhQuan.huyen)
         && e.placeType=='A') {
      ret.push(e);
    }
  }

  if (ret.length == 0) {
    console.log("Not match!!!");
    return undefined;
  }

  return ret;
}

internals._getDiaChinhFromCache = function(codeDiaChinh) {
  let placeCache = DBCache.placeAsArray();

  if (!placeCache){
    return undefined;
  }
  let placeType = 'T';
  if (codeDiaChinh.huyen && codeDiaChinh.huyen.length>0)
      placeType = 'H'
  if (codeDiaChinh.xa && codeDiaChinh.xa.length>0)
    placeType = 'X'

  let ret = [];
  for (var i=0; i < placeCache.length; i++) {
    let e = placeCache[i];
    if (placeType == 'T' && e.codeTinh == codeDiaChinh.tinh && e.placeType == placeType){
      ret.push(e);
    }

    if (placeType == 'H'
        && e.codeTinh == codeDiaChinh.tinh
        && e.codeHuyen==codeDiaChinh.huyen
        && e.placeType == placeType){
      ret.push(e);
    }

    if (placeType == 'X'
        && e.codeTinh == codeDiaChinh.tinh
        && e.codeHuyen==codeDiaChinh.huyen
        && e.codeXa==codeDiaChinh.xa
        && e.placeType == placeType){
      ret.push(e);
    }

  }

  if (ret.length == 0) {
    console.log("Not match!!!");
    return undefined;
  }

  return ret;
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

/*
{
  tinhKhongDau:
  huyenKhongDau:
  XaKhongDau:
  placeType:
}
 */
internals.getPlaceByDiaChinhKhongDau = function(req,reply){
  var payload = req.payload;
  log.info("getPlaceByDiaChinhKhongDau, payload=", payload);

  if (!payload.tinhKhongDau) {
    reply({
      diaChinh : undefined,
      duAn: undefined,
      status: "ERROR "
    });

    return;
  }
  place.getPlaceByDiaChinhKhongDau(payload,function(err,res){
    if(err){
      console.log("getPlaceByDiaChinhKhongDau error ", err);
      reply({
        diaChinh : undefined,
        duAn: undefined,
        status: "ERROR "
      });
      return;
    }
    if (res && res.length >0){
      var diaChinh = _convertFromPlaceRaw(res[0]);
      var duAn = _getDuAnFromCache(diaChinh);

      duAn = (duAn && duAn.length>0) ? _convertFromPlaceRawList(duAn) : undefined;
      reply({
        diaChinh : diaChinh,
        duAn: duAn,
        status: "OK"
      });
    } else {
      reply({
        diaChinh : undefined,
        duAn: undefined,
        status: "OK"
      });
    }

});
};

internals.getDuAnByDiaChinh = function(req,reply){
  var payload = req.payload;
  log.info("getPlaceByDiaChinhKhongDau, payload=", payload);

  if (!payload.codeTinh) {
    reply({
      duAn: undefined,
      success: false
    });

    return;
  }
  var diaChinh = {
    tinh: req.payload.codeTinh,
    huyen: req.payload.codeHuyen,
  };
  var duAn = _getDuAnFromCache(diaChinh);

  duAn = (duAn && duAn.length>0) ? _convertFromPlaceRawList(duAn) : undefined;
  reply({
    duAn: duAn,
    success: false
  });
};

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