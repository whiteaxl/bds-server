'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;
var log = require('../lib/logUtil');

/**
id,clientReportID,
reportUserID,
reportCode,
reportContent,
reportObjID
*/
class ClientReportModel {


	initBucket() {
		bucket.enableN1ql(['127.0.0.1:8093']);
		bucket.operationTimeout = 60 * 1000;
		bucket = cluster.openBucket('default');
	}

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