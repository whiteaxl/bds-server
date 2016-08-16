'use strict';
/*
1. Scratch card topup:
 https://docs.google.com/spreadsheets/d/1sz0Sp3AkW_N8duhWQFRfyqNPbgCNkHpIHUhQ9m9s_yA/edit#gid=0

Notes: cac loi sau
 lỗi 99: không xác định nguyên nhân này
 lỗi 18: thẻ có thể bị trừ này

 1.2 Query api : used to solve timeout issue
      If timeout when calling

 */

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

function updateTxTopupInfo(txTopup, calcRes, callback) {
  //store into db
  txTopup.stage = constant.TOPUP_STAGE.SUCCESS;
  txTopup.endDateTime = new Date().getTime();
  txTopup.mainAmount = calcRes.mainAmount;
  txTopup.bonusAmount = calcRes.bonusAmount;
  txTopup.paymentBonus = calcRes.paymentBonus;

  onepayDB.upsert(txTopup, (err, dbRes) => {
    if (err) {
      callback({
        status : 100,
        msg : "Giao dịch không thành công! Lỗi khi lưu TxTopup"
      });
      log.error("updateTxTopupInfo, error when update topup response into DB", err);

      return;
    }
    //update User infor
    userDB.updateAccount({
      mainAmount:calcRes.mainAmount,
      bonusAmount:calcRes.bonusAmount,
      userID : txTopup.userID
    }, (err, res) => {
      if (err) {
        callback({
          status : 101,
          msg : "Giao dịch không thành công! Lỗi khi cập nhật tài khoản"
        });
        log.error("updateTxTopupInfo, error when update updateAccount into DB", err);

        return;
      }

      log.info("Done updateTxTopupInfo to DB", err, res);
      callback({
        status : 0,
        totalMain : res.user.account.main,
        totalBonus : res.user.account.bonus,
      });
    });
  });
}

function smsplus_reply(req, res2onepay, reply) {
  //store as it's in db first
  onepayDB.logData({
    req: req.url,
    res : res2onepay
  }, "Onepay_Request", "SmsTopup");

  reply(res2onepay);
}

internals.smsplusCharging = function(req, reply) {
  var query = req.query;
  log.info("SmsplusCharging, query=", query);

  var mySig = onepayServices.genSmsSignature(query);

  log.info("mySig vs 1paySig", {relandSig: mySig, onepaySig: query.signature});
  query.mySignature = mySig;

  var res2onepay = null;

  if (mySig!==query.signature) {
    res2onepay = {
      status : 0,
      sms : "Error, Signature không khớp!",
      type : "text"
    };

    smsplus_reply(req, res2onepay, reply);

    return;
  }

  onepayDB.insertSmsPlus(query, (res) => {
    if (res.status==0) {
      var startDateTime = new Date(query.request_time).getTime();

      //calc and update to user...
      paymentEngine.calcFinalTopupAmount({
        paymentType : constant.PAYMENT.SMSPLUS,
        datetime : startDateTime,
        topupAmount : query.amount
      }, (calcRes) => {
        log.info("Done calc Amount: ", {calcRes});

        userDB.getUserByMsisdn(query.msisdn, (err, res) => {
          if (err) {
            let msg = "Lỗi khi thực hiện update TxTopup của smsplus.";

            log.error(msg, err);
            res2onepay = {
              status : 0,sms : msg,type : "text"
            };
            smsplus_reply(req, res2onepay, reply);

            return;
          }

          if (res.length ==0) {
            let msg = "Số điện thoại nạp tiền không tồn tại.:" + + query.msisdn;
            log.error(msg);

            res2onepay = {
              status : 0,sms : msg,type : "text"
            };
            smsplus_reply(req, res2onepay, reply);
            return;
          }

          updateTxTopupInfo({
            id : "SMS_" + query.request_id,
            userID : res[0].userID,
            paymentType : constant.PAYMENT.SMSPLUS,
            paymentName : constant.PAYMENT.SMSPLUS,
            startDateTime : startDateTime,
            topupAmount : query.amount,
          }, calcRes, (res) => {
            log.info("Done updateTxTopupInfo");
            res2onepay = {
              status : 1,sms : "OK, Signature khớp nhau",type : "text"
            };
            smsplus_reply(req, res2onepay, reply);
          });
        });
      });

      return;
    }

    //fail cases
    if (res.status==1) { //lap requestID
      res2onepay = {
        status : 0,
        sms : res.msg,
        type : "text"
      };
    } else { //other error
      res2onepay = {
        status : 0,
        sms : res.msg,
        type : "text"
      };
    }

    smsplus_reply(req, res2onepay, reply);
  });
};

function handleScatchResponse(onepayRes, txTopup, reply) {
  txTopup.resDescription = onepayRes.description;
  txTopup.closeDateTime = new Date().getTime();

  //fail
  if (onepayRes.status !== "00") { //1 – Thành công; 0 – Thất bại.
    txTopup.stage = constant.TOPUP_STAGE.FAIL;
    onepayDB.upsert(txTopup, (err, dbRes) => {
      log.info("updated TxTopup",err,dbRes);
    });

    reply({
      status : Number(onepayRes.status),
      msg : onepayRes.description,
    });

    return;
  }

  paymentEngine.calcFinalTopupAmount({
    paymentType : txTopup.paymentType,
    datetime : txTopup.startDateTime,
    topupAmount : onepayRes.amount
  }, (calcRes) => {
    log.info("Done calc Amount: ", {txTopup, calcRes});

    txTopup.topupAmount = onepayRes.amount;
    updateTxTopupInfo(txTopup, calcRes, (res) => {
      if (res.status !== 0) {
        reply(res);
      } else {
        reply({
          status : Number(onepayRes.status),
          msg : onepayRes.description,
          topupAmount : onepayRes.amount,
          mainAmount : calcRes.mainAmount,
          bonusAmount : calcRes.bonusAmount,
          totalMain : res.totalMain,
          totalBonus : res.totalBonus,
          serial : onepayRes.serial,
        });
      }
    });
  });
}

internals.scratchTopup = function(req, reply) {
  var payload = req.payload;
  log.info("scratchTopup, payload=", payload);

  //need store into DB and return transRef
  onepayDB.saveScratchTopupRequestFromClient(payload, (err, res, txTopup) => {
    log.info("scratchTopup, done saveScratchTopupRequestFromClient", err, res);
    if (err) {
      reply({
        status : 99,
        msg : "Lỗi khi thực hiện khởi tạo nạp thẻ cào: " + err.msg
      });

      return;
    }

    var reqParams = {
      type : txTopup.cardType,
      pin : txTopup.cardPin,
      serial : txTopup.cardSerial,
      transRef : txTopup.id,
    };
    onepayServices.scratchTopup(reqParams)
      .then((res) => {
        log.info("scratchTopup onepay res:", res);
        //store as it's in db first
        onepayDB.logData(res, "Onepay_Request", "ScratchTopup");

        if (res.err) {
          let e = res.err;

          if (e.error && e.error.code === 'ETIMEDOUT') {
            handleScratchTopupTimeout(txTopup, reply);
          } else {
            reply({
              status : 99,
              msg  : 'Loi khi thuc hien thanh toan The cao voi 1pay!'
            });
          }

          return;
        }

        let onepayRes = res.res;
        handleScatchResponse(onepayRes, txTopup, reply)
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
    /*
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
    */

    reply({});
  });
};

//------------
var handleScratchTopupTimeout = function(txn, reply) {
  onepayServices.queryScratchTopup(txn).then((res) => {
    log.info("queryScratchTopup res:", res);
    //store as it's in db first
    onepayDB.logData(res, "Onepay_Request", "ScratchQuery");

    if (res.err) {
      reply({
        status : 99,
        msg  : 'Loi khi thuc hien thanh toan The cao voi 1pay!'
      });
      return;
    }

    //
    let onepayRes = res.res;
    handleScatchResponse(onepayRes, txn, reply)

  })
};



module.exports = internals;