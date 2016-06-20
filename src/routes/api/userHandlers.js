"use strict";

var User = require("../../dbservices/User");
var Boom = require('boom');
var moment = require('moment');
var log = require("../../lib/logUtil");
var constant = require("../../lib/constant");


var userService = new User();

var internals = {};

var cache = {};

/**
 * request {
  *     deviceID : "device-ID1"
  * }
 */
internals.create = function (req, reply) {
  var query = req.payload;

  var deviceID = query.deviceID;
  var userDto = {
    deviceID: deviceID
  };
  userService.upsert(userDto, (err, res) => {
    if (err) {
      console.log(err);
      reply(Boom.internal("Error when call create user " + deviceID + ",err:") + err)
    } else {
      console.log(res);

      reply(res);
    }
  });
};


internals.requestVerifyCode = function (req, reply) {
  console.log("Call requestVerifyCode:", req.payload);
  const phone = req.payload.phone;

  try {
    //check existing:
    userService.getUser({phone: phone}, (err, res) => {
      if (err) {
        reply({
          status: 99,
          msg: err.toString()
        });

        return;
      }

      if (res.length > 0) { //exists
        log.warn("User already existed!");
        log.info(res);

        reply({
          status: 1,
          msg:constant.MSG.USER_EXISTS
        });

        return;
      }
      //good
      const verifyCode = Number(moment().format('HHmm'));
      cache[phone] = verifyCode;
      console.log("requestVerifyCode, verifyCode of " + phone + " is " + verifyCode);

      reply({
        status: 0,
        verifyCode: verifyCode
      });
    });
  } catch (e) {
    console.log(e);
    reply(Boom.badImplementation());
  }
};

internals.registerUser = function (req, reply) {
  log.info("Call registerUser:", req.payload);

  let userDto = {
    phone: req.payload.phone,
    email: req.payload.email,
    matKhau: req.payload.matKhau,
    fullName: req.payload.fullName
  };

  userService.createUserAndLogin(userDto, (err, res) => {
    console.log("Callback createUserAndLogin", err, res);
    let toClient = {};
    if (err) {
      toClient.status = 99;
      toClient.msg = err.msg;

    } else {
      toClient.status = 0;
      toClient.res = res;
    }

    reply(toClient);
  });
};

internals.updateDevice = function (req, reply) {
  log.info("Call updateDevice:", req.payload);
  let dto = req.payload;

  dto.type = 'Device';

  const userDto = {
    phone : dto.phone,
    email : dto.email
  };

  userService.getUser(userDto, (err, res) => {
    if (!err && res.length > 0) { //exists
      //console.log("Callback getUser", err, res);
      dto.userID = res[0].userID;

      userService.updateDevice(dto, (err, res) => {
        let toClient = {};
        if (err) {
          toClient.status = 99;
          toClient.msg = err.msg;

        } else {
          toClient.status = 0;
          toClient.res = res;
        }

        reply(toClient);
      });
    } else {
      console.log("Callback getUser error", err, res);
      reply({
        status : 99,
        msg : err.msg + " Or user does not exist!"
      });
    }
  });


};


module.exports = internals;

