"use strict";

var User = require ("../../dbservices/User");
var Boom = require('boom');

var user = new User();

var internals = {};

/**
 * request {
  *     deviceID : "device-ID1"
  * }
 */
internals.create = function(req, reply) {
    var query = req.payload;

    var deviceID = query.deviceID;
    var userDto = {
        deviceID : deviceID
    };
    user.upsert(userDto, (err, res) => {
        if (err) {
            console.log(err);
            reply(Boom.internal("Error when call create user " + deviceID + ",err:") + err)
        } else {
            console.log(res);

            reply(res);
        }
    });
};

module.exports = internals;

