'use strict';


var utils = require('../../lib/utils');
var log = require('../../lib/logUtil');
var constant = require('../../lib/constant');
var cfg = require('../../config');
var request = require("request");
var rp = require("request-promise");
var onepayServices =require('../../lib/onepay');
var paymentEngine = require('../../lib/paymentEngine');

var UserDBClass = require('../../dbservices/User');
var userDB = new UserDBClass();

var OnepayDBClass = require('../../dbservices/OnePay');
var onepayDB = new OnepayDBClass();

//var cryto = require("crypto-js/hmac-sha256");
var crypto = require('crypto');

var internals = {};

internals.simScratchTopup = function(req, reply) {
  var query = req.query;
  log.info("simScratchTopup, query=", query);
  var pin = query.pin || "00";

  if (pin.indexOf("00") > -1) {
      reply({
        transId : "1paytransId_00",
        transRef : query.transRef,
        serial : query.serial,
        status : "00",
        amount : query.serial.substring(0,2)*1000,
        description : "Giao dịch thành công"
      });

    return;
  }

  if (pin.indexOf("01") > -1) {
    reply({
      transId : "1paytransId_01",
      transRef : query.transRef,
      serial : query.serial,
      status : "01",
      amount : query.serial*1000,
      description : "Lỗi, địa chỉ IP truy cập API bị từ chối"
    });

    return;
  }

  if (pin.indexOf("05") > -1) {
    setTimeout(() => {
      reply({
        transId : "1paytransId_05",
        transRef : query.transRef,
        serial : null,
        status : "02",
        amount : 0,
        description : "Timeout"
      });
    }, 60000);

    return;
  }

  reply({
    transId : "1paytransId_02",
    transRef : query.transRef,
    serial : null,
    status : "02",
    amount : 0,
    description : "Lỗi, tham số gửi từ merchant tới chưa chính xác (thường sai tên tham số hoặc thiếu tham số)"
  });
};



internals.simScratchQuery = function(req, reply) {
  var query = req.query;
  log.info("simScratchQuery, query=", query);
  var pin = query.pin || "00";

  if (pin.indexOf("00") > -1) {
    reply({
      transId : "1paytransId_00",
      transRef : query.transRef,
      serial : query.serial,
      status : "00",
      amount : query.serial.substring(0,2)*1000,
      description : "Giao dịch thành công"
    });

    return;
  }

  if (pin.indexOf("01") > -1) {
    reply({
      transId : "1paytransId_01",
      transRef : query.transRef,
      serial : query.serial,
      status : "01",
      amount : query.serial*1000,
      description : "Lỗi, địa chỉ IP truy cập API bị từ chối"
    });

    return;
  }
  //others
  reply({
    transId : "1paytransId_02",
    transRef : query.transRef,
    serial : null,
    status : "02",
    amount : 0,
    description : "Lỗi, tham số gửi từ merchant tới chưa chính xác (thường sai tên tham số hoặc thiếu tham số)"
  });
};
module.exports = internals;