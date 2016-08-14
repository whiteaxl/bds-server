'use strict';

var log = require('./logUtil');
var constant = require("./constant");
var PaymentModel = require("../dbservices/Payment");
var paymentModel = new PaymentModel();

var payment = {};

var paymentRate = {};
paymentRate[constant.PAYMENT.SCRATCH] = 0.8;
paymentRate[constant.PAYMENT.SMSPLUS] = 0.5;
paymentRate[constant.PAYMENT.IN_APP_PURCHASE] = 0.7;
paymentRate[constant.PAYMENT.MANUAL_BANK_TRANSFER] = 1.0;


/*
param: {paymentType, datetime, topupAmount}
ret: {bonusAmount, bonusID, mainAmount}
 */
payment.calcFinalTopupAmount = function(param, callback) {
  var main = param.topupAmount;
  main = main * paymentRate[param.paymentType];
  //
  this.calcBonus(param, (bonus) => {
    callback({
      mainAmount : main,
      bonusAmount :bonus.bonusAmount,
      paymentBonus : bonus.paymentBonus
    })
  });
};

/*
 param: {paymentType, datetime, topupAmount}
 ret: {bonusAmount, bonusID, mainAmount}
 */
payment.calcBonus = function(param, callback) {
  paymentModel.getAllPaymentBonus((err, res) => {
    if (err) {
      log.error("Error when getAllPaymentBonus:", err);
      callback({bonusAmount:0, paymentBonus:null});
      return;
    }

    var bonus = {bonusAmount:0, paymentBonus:null};

    //{id, paymentType, fromDateTime, toDateTime, percent, min}
    res.forEach((inDB) => {
      log.info("Compare bonus", {param, inDB});
      if ( (!inDB.paymentType || inDB.paymentType==param.paymentType)
        && inDB.fromDateTime <= param.datetime && inDB.toDateTime >= param.datetime
        && inDB.min <= param.topupAmount) {

        log.warn("Got bonus", inDB);

        bonus = {bonusAmount:param.topupAmount * inDB.percent/100, paymentBonus:inDB}
      }
    });

    callback(bonus);
  });
};

module.exports = payment;