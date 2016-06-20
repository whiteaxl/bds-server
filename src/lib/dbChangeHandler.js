'use strict';

var request = require('request');
var http = require('http');
var apn = require('apn');

var last = 0;
var log = require('./logUtil');
var UserService = require('../dbservices/User');
var userService = new UserService();

var dbChangeHandler = {};


dbChangeHandler.initDBListen = function(lastSeq) {
  http.get({
    host: 'localhost',
    port: 4985,
    path: '/default/_changes?feed=continuous&since=' + lastSeq
  }, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
      //body += d;
      console.log('dbChangeHandler changes:', d.toString());
      if (d) {
        dbChangeHandler.onChanged(d.toString());
      }
    });
    response.on('end', function() {
      console.log("FINAL BODY, will re-init", body);

      dbChangeHandler.initDBListen(last);
    });
  });
};

dbChangeHandler.init = function() {
  request('http://localhost:4985/default/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      var lastSeq = info.update_seq;
      console.log("Startup..lastSeq=", lastSeq);
      dbChangeHandler.initDBListen(lastSeq);
    }
  });
};

dbChangeHandler.pushNotify = function(data) {
  log.info("Calling pushNotify...", data);

  userService.getDocById(data.id, (err, res) => {
    if (err || !res) {
      log.error("Error in pushNotify", err);
      return;
    }

    let doc = res.value;
    //log.info("pushNotify...", doc);

    if (doc.type === 'Chat') {
      //get token
      userService.getTokenOfUser(doc.toUserID, (err, res) => {
        if (res.length > 0) {
          let token = res[0].tokenID;
          if (token) {
            console.log("will token to ", token);

            this._pushNotify(doc.content, [token]);
          }
        } else {
          log.warn("Can not get tokenID of chat msg to user:", doc.toUserID)
        }
      });
    }
  });
};

dbChangeHandler.onChanged = function(data) {
  let spl = data.split('\n');
  spl.forEach((e) => {
    if (e && e.length > 0) {
      let obj = JSON.parse(e);
      last = obj.seq;
      log.info("Last seq pushed:",last);
      this.pushNotify(obj);
    }
  });
};

dbChangeHandler.initAPN = function() {
  //var tokens = ["90e53434603079f3680f51234801b2abb4c91cb9dd69100e2e49a55570175bb8"];
  var service = new apn.connection({
    production: false,
    cert:'src/apn/prod_cert.pem',
    key:'src/apn/prod_key.pem'
  });

  dbChangeHandler.apnService = service;

  service.on("connected", function() {
    console.log("Connected");
  });

  service.on("transmitted", function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString("hex"));
  });

  service.on("transmissionError", function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode === 8) {
      console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
  });

  service.on("timeout", function () {
    console.log("Connection Timeout");
  });

  service.on("disconnected", function() {
    console.log("Disconnected from APNS");
  });

  service.on("socketError", console.error);
};

dbChangeHandler._pushNotify = function(msg, tokens) {
  console.log("Sending the same notification each of the devices with one call to pushNotification.");
  var note = new apn.notification();
  note.setAlertText(msg);
  note.badge = 0;

  dbChangeHandler.apnService.pushNotification(note, tokens);
};

module.exports = dbChangeHandler;