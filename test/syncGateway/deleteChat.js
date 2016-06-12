'use strict';

var SyncGW = require('../../src/dbservices/SyncGW');

let gw = new SyncGW();

gw.delete(
    'Chat_001'
  , (err, res) => {
  console.log("Callback....", err, res);
}
);
