'use strict';

var request = require("request");

var syncGatewayDB_URL = "http://localhost:4985/default/";
let log = require('../lib/logUtil');

class SyncGW {
  _setID(dto) {
    if (dto.type='Chat') {
      dto._id = dto.chatID;
    }


  }

  createDocViaSyncGateway(dto, callback) {
    /*
     if (!dto.timeStamp) {
     dto.timeStamp = new Date().getTime();
     }
     */

    this._setID(dto);

    request({
        url: syncGatewayDB_URL, method: "POST",
        json: dto
      },
      function (error, response, body) {
        if (error) {
          log.error("Error when createDocViaSyncGateway", error, response);
          callback(error, body);
          return;
        }

        if (response.statusCode === 200 || response.statusCode === 201) {
          callback(null, body);
        } else {
          log.error("createDocViaSyncGateway - Have response but status fail:", response);
          callback({code:99, msg: response.body}, null);
        }
      });
  }

  delete(_id, callback) {
    request({
        url: syncGatewayDB_URL + _id, method: "GET"
      },
      function (error, response, body) {
        if (error) {
          log.error("Error when delete from Sync", error, response);
          callback(error, body);
          return;
        }

        if (response.statusCode === 200 || response.statusCode === 201) {
          log.info("success:", body);

          let res = JSON.parse(body);



          request({
              url: syncGatewayDB_URL + _id + '?' + res._rev,
              method: "DELETE"
            },
            function (error, response, body) {
              log.info("success:", error);
            });

        } else {
          log.error("createDocViaSyncGateway - Have response but status fail:", response);
          callback({code: 99, msg: response.body}, null);
        }
      });
  }
}

module.exports = SyncGW;