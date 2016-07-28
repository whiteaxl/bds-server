'use strict';

var utils = require('../../lib/utils');
var log = require('../../lib/logUtil');
var cfg = require('../../config');
var OnepayClass = require('../../dbservices/OnePay');
var onepayDB = new OnepayClass();

//var cryto = require("crypto-js/hmac-sha256");
var crypto = require('crypto');

var internals = {};

function generateSignature(query, secret) {
  var data = `access_key=${query.access_key}`
    + `&amount=${query.amount}`
    + `&command_code=${query.command_code}`
    + `&error_code=${query.error_code}`
    + `&error_message=${query.error_message}`
    + `&mo_message=${query.mo_message}`
    + `&msisdn=${query.msisdn}`
    + `&request_id=${query.request_id}`
    + `&request_time=${query.request_time}`
    ;

  log.info("data=", data);
  log.info("secret=", secret);

  var hash = crypto.createHmac('SHA256', "iv9wvzqvy9bhpk1xv7w2hol9qbzsw1i4").update(data).digest('hex');

  return hash;
}

internals.SmsplusCharging = function(req, reply) {
  var query = req.query;
  log.info("SmsplusCharging, query=", query);

  var mySig = generateSignature(query, cfg.onepay.secret);

  log.info("mySig=", mySig);
  log.info("1paySig=", query.signature);
  query.mySignature = mySig;

  if (mySig==query.signature) {
    query.status = 1;
    onepayDB.upsertSmsPlus(query);

    reply({
      status : 1,
      sms : "OK, Signature khớp nhau",
      type : "text"
    });
  } else {
    query.status = 0;
    onepayDB.upsertSmsPlus(query);

    reply({
      status : 0,
      sms : "Error, Signature không khớp!",
      type : "text"
    });
  }



};

module.exports = internals;