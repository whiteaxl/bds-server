"use strict";

var apn = require('apn');

var tokens = ["90e53434603079f3680f51234801b2abb4c91cb9dd69100e2e49a55570175bb8"];

var service = new apn.connection({ production: false });

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


// If you plan on sending identical paylods to many devices you can do something like this.
function pushNotificationToMany() {
  console.log("Sending the same notification each of the devices with one call to pushNotification.");
  var note = new apn.notification();
  note.setAlertText("Hello, from node-apn1!");
  note.badge = 0;

  service.pushNotification(note, tokens);
}

pushNotificationToMany();


// If you have a list of devices for which you want to send a customised notification you can create one and send it to and individual device.
function pushSomeNotifications() {
  console.log("Sending a tailored notification to %d devices", tokens.length);
  tokens.forEach(function(token, i) {
    var note = new apn.notification();
    note.setAlertText("Hello, from node-apn! You are number 1:  " + i);

    note.badge = 3;
    note.foreground = false;

    note.title = 'This is my title';

    note.data = {
      alertBody: 'Alert from APN 1'
    };

    note.message = 'Msg 1';

    service.pushNotification(note, token);
  });
}

//pushSomeNotifications();