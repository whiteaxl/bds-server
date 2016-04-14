'use strict';

var internals = {};

internals.getBox = function(point, radius) {
    let ne = {};
    let sw = {};

    ne.lat = point.lat + radius;
    ne.lat = point.long + radius;

    sw.lat = point.lat - radius;
    sw.lat = point.long - radius;

    return [sw.lat, sw.lon, ne.lat, ne.lon];

};

module.exports  = internals;