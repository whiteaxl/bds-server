'use strict';

var request = require("request");



var services = {};



services.getPlaceDetail = function(placeId, callback) {
    var url = "https://maps.googleapis.com/maps/api/place/details/json?" +
        "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
        "&placeid=" + placeId;

    console.log(url);

    request({url: url,json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            callback(body.result);
        }
    })
};

module.exports = services;