'use strict';

var rp = require("request-promise");
var cfg = require('../config');
var crypto = require('crypto');
var log = require('./logUtil');

var services = {};

services.genSig = function(msg) {
  return crypto.createHmac('SHA256', cfg.onepay.secret).update(msg).digest('hex');
};


services.genSmsSignature = function(query) {
  var msg = `access_key=${query.access_key}`
      + `&amount=${query.amount}`
      + `&command_code=${query.command_code}`
      + `&error_code=${query.error_code}`
      + `&error_message=${query.error_message}`
      + `&mo_message=${query.mo_message}`
      + `&msisdn=${query.msisdn}`
      + `&request_id=${query.request_id}`
      + `&request_time=${query.request_time}`
    ;

  log.info("genSmsSignature=", msg);

  return this.genSig(msg);
};


services.queryScratchTopup = function(txn) {
  var params = {
    access_key : cfg.onepay.access_key,
    type : txn.cardType,
    pin : txn.pin,
    serial : txn.serial,
    transRef : txn.transRef,
    transId : txn.transId || ""
  };
  var signatureMsg = `access_key=${params.access_key}`
    + `&pin=${params.pin}`
    + `&serial=${params.serial}`
    + `&transId=${params.transId}`
    + `&transRef=${params.transRef}`
    + `&type=${params.type}`;

  log.info("queryScratchTopup, signatureMsg=", signatureMsg);
  params.signature = genSig(signatureMsg);

  var url = "https://api.1pay.vn/card-charging/v5/query";
  //console.log(url);
  var options = {
    method: 'POST',
    uri: url,
    body: params,
    json: true // Automatically parses the JSON string in the response
  };

  return rp(options)
};


services.scratchTopup = function(txnInDB) {
  var params = {
    access_key : cfg.onepay.access_key,
    type : txnInDB.cardType,
    pin : txnInDB.pin,
    serial : txnInDB.serial,
    transRef : txnInDB.transRef,
  };

  var signatureMsg = `access_key=${params.access_key}`
    + `&pin=${params.pin}`
    + `&serial=${params.serial}`
    + `&transRef=${params.transRef}`
    + `&type=${params.type}`;

  log.info("genScatchTopupSig, signatureMsg=", signatureMsg);

  params.signature = this.genSig(signatureMsg);

  signatureMsg += "&signature=" + params.signature;

  var url = "https://api.1pay.vn/card-charging/v5/topup?" + signatureMsg;

  var options = {
    method: 'POST',
    uri: url,
    body: {},
    json: true // Automatically parses the JSON string in the response
  };

  log.info("scratchTopup, topup request:", options);

  return rp(options)
    .then((res) => {
      return {
        req : options,
        res : res
      }
    })
    .catch((err) => {
      return {
        req : options,
        err : err
      }
    })
};

module.exports = services;