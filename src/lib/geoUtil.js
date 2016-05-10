'use strict';

var geolib = require("geolib");

var internals = {};


internals.meter2degree = function(km) {
    //1° ~= 111km;
    return km/111;
};

internals.getBox = function(point, radius) {
    let ne = {};
    let sw = {};

    ne.lat = point.lat + radius;
    ne.lon = point.lon + radius;

    sw.lat = point.lat - radius;
    sw.lon = point.lon - radius;

    return [sw.lat, sw.lon, ne.lat, ne.lon];
};

internals.getBoxForSpatialView = function(point, radius) {
    let ne = {};
    let sw = {};

    ne.lat = point.lat + radius;
    ne.lon = point.lon + radius;

    sw.lat = point.lat - radius;
    sw.lon = point.lon - radius;

    return [sw.lon, sw.lat, ne.lon, ne.lat];
};


//meters
internals.measure = function(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    return geolib.getDistance({latitude: lat1, longitude: lon1}, {latitude: lat2, longitude: lon2})
};


internals.measure_old = function(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
};

module.exports  = internals;