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

  place.getPlaceByNameLike(query.input, (err, res) => {
    //console.log(res);

    if (err) {
      reply({
        predictions : [],
        status: "ERROR " + err
      });

      return;
    }

    var predictions = [];

    if (res) {
      predictions = res.map((e) => {
        let vp = e.geometry.viewport;

        return {
          placeName : e.placeName,
          fullName : e.fullName,
          shortName : placeUtil.getShortName(e.fullName),
          placeType : e.placeType,
          placeId : e.id,
          tinh : e.tinhKhongDau,
          huyen: e.huyenKhongDau,
          xa : e.xaKhongDau,
          viewport : {
            "northeast": {
              "lat": vp.northeast.lat,
              "lon": vp.northeast.lng
            },
            "southwest": {
              "lat": vp.southwest.lat,
              "lon": vp.southwest.lng
            }
          }
        }
      });
    }

    reply({
      predictions : predictions,
      status: "OK"
    });
  });


};



module.exports = internals;