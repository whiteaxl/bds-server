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

internals.getBoxOfCircle = function(point, radius) {
    let ne = {};
    let sw = {};

    ne.lat = point.lat + radius;
    ne.lon = point.lon + radius;

    sw.lat = point.lat - radius;
    sw.lon = point.lon - radius;

    return {northeast: ne, southwest: sw};
};

//polygon: [{lat,lon}]
internals.getGeoBoxOfPolygon = function(coords) {
    var tmpCenter = geolib.getCenter(coords);
    var center = {lat: Number(tmpCenter.latitude), lon: Number(tmpCenter.longitude)};

    var maxLat = 0;
    var maxLon = 0;

    coords.forEach((e) => {
        if (maxLat < Math.abs(center.lat-e.latitude)) {
            maxLat = Math.abs(center.lat-e.latitude);
        }

        if (maxLon < Math.abs(center.lon-e.longitude)) {
            maxLon = Math.abs(center.lon-e.longitude);
        }
    });

    var sw = {
        lat : center.lat - maxLat,
        lon : center.lon - maxLon,
    };

    var ne = {
        lat : center.lat + maxLat,
        lon : center.lon + maxLon,
    };

    var geoBox = [sw.lat, sw.lon, ne.lat, ne.lon];

    return {geoBox: geoBox, center: center};
};

internals.getBoxOfPolygon = function(coords) {
    var tmpCenter = geolib.getCenter(coords);
    var center = {lat: Number(tmpCenter.latitude), lon: Number(tmpCenter.longitude)};

    var maxLat = 0;
    var maxLon = 0;

    coords.forEach((e) => {
        if (maxLat < Math.abs(center.lat-e.latitude)) {
            maxLat = Math.abs(center.lat-e.latitude);
        }

        if (maxLon < Math.abs(center.lon-e.longitude)) {
            maxLon = Math.abs(center.lon-e.longitude);
        }
    });

    var sw = {
        lat : center.lat - maxLat,
        lon : center.lon - maxLon,
    };

    var ne = {
        lat : center.lat + maxLat,
        lon : center.lon + maxLon,
    };

    return {southwest:sw, northeast: ne};
};

internals.isPointInside = function(geo, polygonCoords) {
    return geolib.isPointInside({
        latitude : geo.lat,
        longitude : geo.lon,
    }, polygonCoords);
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