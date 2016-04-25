"use strict";

var internals = {};

/**
 * request {
  *     deviceID : "device-ID1"
  * }
 */
internals.create = function(req, reply) {
    var query = req.payload;

    var deviceID = query.deviceID;



};

module.exports = internals;

