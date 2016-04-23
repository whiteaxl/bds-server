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
        console.log("OK1111!");

        if (!error && response.statusCode === 200) {
            console.log("OK!");
            callback(body.result);
        } else {
            console.log("Error when getPlaceDetail" + error);
            callbackError(error);
        }
    })
};


module.exports = services;