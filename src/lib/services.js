'use strict';

var request = require("request");
var https = require("https");


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


module.exports = services;