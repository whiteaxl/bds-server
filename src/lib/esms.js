'use strict';

var rp = require("request-promise");
var cfg = require('../config');
var log = require('./logUtil');

var parseString = require('xml2js').parseString;

var CommonClass = require("../dbservices/Common");
var commonService = new CommonClass();

var services = {};


/*
  params:
    content : khong dau
    phones : ['111', '2222']
  response:
    code: 0, ... 0 mean success
    errorMsg : detail error msg
 */

services.sendMultipleMessage = function(content, phones) {
  var url = cfg.esms.SendMultipleMessageURL;

  let customers = phones.map((e) => {
    return `<CUSTOMER><PHONE>${e}</PHONE></CUSTOMER>`;
  });
  let customerAsString = customers.join("");

  var body = `
  <RQST>
    <APIKEY>${cfg.esms.APIKEY}</APIKEY>
    <SECRETKEY>${cfg.esms.SECRETKEY}</SECRETKEY>
    <ISFLASH>0</ISFLASH>
    <SMSTYPE>7</SMSTYPE>
    <CONTENT>${content}</CONTENT>
    <CONTACTS>${customerAsString}</CONTACTS>
  </RQST>
`;

  var options = {
    method: 'POST',
    uri: url,
    body: body.trim(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  };

  log.info("sendMultipleMessage, sendMultipleMessage request:", options);

  return rp(options)
    .then((resp) => {
      console.log("sendMultipleMessage, res:", resp);

      let jsonRes, errMsg;
      //<?xml version="1.0" encoding="utf-8"?><SmsResultModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><CodeResult>99</CodeResult><ErrorMessage>Danh sach nhan tin rong, hoac khong co so nao hop le</ErrorMessage><CountRegenerate>0</CountRegenerate></SmsResultModel>
      //
      parseString(resp, (err, result) => {
        jsonRes = result;
      });

      let esmsRequest = {
        type: "ESMS",
        subType : "sendMultipleMessage",
        id : "ESMS_" + new Date().getTime(),
        req : {
          content: content,
          phones: phones
        },
      };

      esmsRequest.res = {
        CodeResult : String(jsonRes.SmsResultModel.CodeResult),
        ErrorMessage : jsonRes.SmsResultModel.ErrorMessage && String(jsonRes.SmsResultModel.ErrorMessage),
        CountRegenerate : jsonRes.SmsResultModel.CountRegenerate && String(jsonRes.SmsResultModel.CountRegenerate),
        SMSID: jsonRes.SmsResultModel.SMSID && String(jsonRes.SmsResultModel.SMSID),
        IsSandbox: jsonRes.SmsResultModel.IsSandbox && String(jsonRes.SmsResultModel.IsSandbox),

        raw : resp
      };

      //need store it into DB
      commonService.upsert(esmsRequest, (err, res) => {});

      if (esmsRequest.res.CodeResult == cfg.esms.RETURN_CODE.SUCCESS) {
        return {
          code : 0, //success
          errorMsg : undefined
        }
      } else {
        return {
          code : esmsRequest.res.CodeResult, //success
          errorMsg : esmsRequest.res.ErrorMessage
        }
      }
    })
    .catch((err) => {
      console.log("Error when esms:", err);

      let esmsRequest = {
        type: "ESMS",
        subType : "sendMultipleMessage",
        id : "ESMS_" + new Date().getTime(),
        req : {
          content: content,
          phones: phones
        },
      };
      esmsRequest.res = {
        CodeResult : 90,
        ErrorMessage : err.toString()
      };

      //need store it into DB
      commonService.upsert(esmsRequest, (err, res) => {});

      return {
        code : esmsRequest.res.CodeResult, //success
        errorMsg : esmsRequest.res.ErrorMessage
      }
    })
};

module.exports = services;