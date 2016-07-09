'use strict';

var request = require("request");
var rp = require("request-promise");
var placeUtil = require("./placeUtil");

var services = {};

services.getPlaceDetail = function(placeId, callback, callbackError) {
    var url = "https://maps.googleapis.com/maps/api/place/details/json?" +
        "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
        "&placeid=" + placeId;

    console.log(url);

    request({url: url,json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body.result);
        } else {
            console.log("Error when getPlaceDetail" + error);
            callbackError(error);
        }
    })
};

services.getGeocoding = function(lat, lon, callback, callbackError) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
      "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
      "&latlng=" + lat + ',' + lon;

    console.log(url);

    request({url: url,json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body.results && body.results[0])
                callback(body.results[0]);
            else
                callback(null);
        } else {
            console.log("Error when getGeocoding" + error);
            callbackError(error);
        }
    })
};

services.getGeocodingAsPromise = function(lat, lon) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
    "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
    "&latlng=" + lat + ',' + lon;

  console.log(url);

  var options = {
    uri: url,
    json: true // Automatically parses the JSON string in the response
  };

  return rp(options)
    .then((res) => {
      return res.results;
    })
};

//return {tinh, huyen, xa} khong dau
services.getDiaChinhKhongDauByGeocode = function(lat, lon) {
  return services.getGeocodingAsPromise(lat, lon)
    .then((places) => {
      if (!places || places.length==0) {
        return null
      }

      let place = places[0];
      let diaChinh = placeUtil.getDiaChinhFromGooglePlace(place);

      return diaChinh;
    });
};

module.exports = services;