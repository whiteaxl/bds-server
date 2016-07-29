'use strict';
/*
1. Scratch card topup:
1.1 Topup api:
  - Client send data to server
  - Server gen txn number (transRef) and save client request into DB
      type : 'TxTopup',
      cat : 'ScratchTopup',
      id : transRef
      stage : 0
  - Prepare request api, save request object into DB then call 1pay topup api
    + Save request which is sent to onepay first:
      type : 'Onepay_ScratchTopup_Req'
      id : auto increase
    + Call Topup api:https://api.1pay.vn/card-charging/v5/topup
  - Server get response, save a copy and update DB:
    + Save response to:
      type : 'Onepay_ScratchTopup_Res'
      id : auto increase
    + Update into :
      type : 'TxTopup'
      id : transRef
      amount:
      stage : 1

 1.2 Query api : used to solve timeout issue
      If timeout when calling

 */

var utils = require('../../lib/utils');
var log = require('../../lib/logUtil');
var cfg = require('../../config');
var request = require("request");
var rp = require("request-promise");
var onepayServices =require('../../lib/onepay');

var OnepayDBClass = require('../../dbservices/OnePay');
var onepayDB = new OnepayDBClass();

//var cryto = require("crypto-js/hmac-sha256");
var crypto = require('crypto');

var internals = {};

internals.smsplusCharging = function(req, reply) {
  var query = req.query;
  log.info("SmsplusCharging, query=", query);

  var mySig = onepayServices.genSmsSignature(query);

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

internals.scratchTopup = function(req, reply) {
  var payload = req.payload;
  log.info("scratchTopup, payload=", payload);

  //need store into DB and return transRef
  onepayDB.saveScratchTopupRequestFromClient(payload, (err, res, txnInDB) => {
    if (err) {
      reply({
        status : "99",
        msg : err.msg
      });

      return;
    }

    onepayServices.scratchTopup(txnInDB)
      .then((res) => {
        log.info("scratchTopup onepay res:", res);
        //store as it's in db first
        onepayDB.logData(res, "Onepay_Request", "ScratchTopup");

        if (res.err) {
          let e = res.err;

          //todo: need handle exception here
          if (e.code === 'ETIMEDOUT') {
            handleScratchTopupTimeout(txnInDB);
          }

          reply({
            status : '99',
            description  : 'Loi khi thuc hien thanh toan The cao voi 1pay!'
          });

          return;
        }

        //
        let onepayRes = res.res;
        //store into db
        txnInDB.status = onepayRes.status;
        txnInDB.stage = 1;
        txnInDB.transId = onepayRes.transId;
        txnInDB.resSerial = onepayRes.serial;
        txnInDB.amount = onepayRes.amount;
        txnInDB.resDescription = res.description;
        txnInDB.closeDateTime = new Date().getTime();

        onepayDB.upsert(txnInDB, (err, dbRes) => {
          log.info("Done store onepay response for ScratchTopup to DB", err, dbRes);
          reply(onepayRes);
        });

      })
  });
};

internals.scratchDelayHandler = function(req, reply) {
  var query = req.query;
  log.info("scratchDelayHandler, query=", query);

  if (!query.trans_ref) {
    reply({
      status : "01",
      msg : "Error! Bad request, missing 'trans_ref'"
    });

    return;
  }

  var dto = {
    amount : query.amount,
    type : query.type,
    requestTime : query.request_time,
    serial : query.serial,
    status : query.status,
    transRef : query.trans_ref,
    transId : query.trans_id,
    id : query.trans_ref
  };

  onepayDB.saveDelayCardTopup(dto, (err, res) => {
    if (err) {
      log.info("scratchDelayHandler, error:", err);
      reply({
        status : "99",
        msg : "Error:" + err.message
      })
    } else {
      reply({
        status : "00",
        msg : "Success"
      })
    }
  });
};

//------------
var handleScratchTopupTimeout = function(txn) {
  onepayServices.queryScratchTopup(txn).then((res) => {
    log.info("scratchTopup onepay res:", res);
    //store into db
    txn.status = res.status;
    txn.stage = 1;
    txn.transId = res.transId;
    txn.resSerial = res.serial;
    txn.amount = res.amount;
    txn.resDescription = res.description;
    txn.closeDateTime = new Date().getTime();

    onepayDB.upsert(txnInDB, (err, dbRes) => {
      log.info("Done store onepay response for ScratchTopup to DB", err, dbRes);
      reply(res);
    });

  })
    .catch((e) => {
      log.error("scratchTopup onepay error:", e.statusCode, e.options);
    });
};



module.exports = internals;