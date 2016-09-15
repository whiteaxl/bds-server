'use strict';

var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;
var log = require('../lib/logUtil');

/**
id,clientReportID,
reportUserID,
reportCode,
reportContent,
reportObjID
*/
class ClientReportModel {

	upsert(clientReportDto, callback) {
		this.initBucket();

		clientReportDto.id = clientReportDto.clientReportID;

        bucket.counter("idGeneratorForChats", 1, {initial: 0}, (err, res)=> {
          if (err) {
            callback(err, res);
          } else {
            console.log(res);

            var clientReportID = "Client_Report_" + res.value;

            clientReportDto.type = "ClientReport";
            clientReportDto.clientReportID = clientReportID;
            clientReportDto.id = clientReportID;
            var date = new Date();
            // chat.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
            clientReportDto.reportDate = date;
            console.log("before upsert " + clientReportDto.id);
            //TODO set timestamp for chat

            bucket.upsert(clientReportDto.id, clientReportDto, function (err, res) {
              if (err) {
                console.log("ERROR:" + err);
                callback({code:99, msg:err.toString()})
              }else{
                log.info("ClientReport save:", res);
                callback(null, clientReportDto);
              }
            });
          }
        });
	}	
}

module.exports = ClientReportModel;