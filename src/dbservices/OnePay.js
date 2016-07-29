'use strict';

var constant = require('../lib/constant');
var log = require('../lib/logUtil');

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;

class OnePay {


	initBucket() {
		bucket.enableN1ql(['127.0.0.1:8093']);
		bucket.operationTimeout = 60 * 1000;
		bucket = cluster.openBucket('default');
	}

	upsertSmsPlus(dto) {
		dto.type = '1paySmsplus';
		dto.id = '1paySmsplus_' + dto.request_id;

		bucket.upsert(dto.id, dto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	upsert(dto, callback) {
		bucket.upsert(dto.id, dto, callback)
	}
	saveScratchTopupRequestFromClient(payload, callback) {
		bucket.counter(constant.DB_SEQ.ScratchTopup, 1, {initial: 0}, (err, res)=> {
			if (err) {
				callback(err, res);
			} else {
				var id = "ScratchTopup_" + res.value;

				var dto = {
					id : id,
					cardType : payload.type,
					pin : payload.pin,
					serial : payload.serial,
					transRef : id,
					dateTime : new Date().getTime(),
					type : 'TxTopup',
					cat : 'ScratchTopup',
					stage : 0, // 0 = requesting, 1 = done
          deviceInfor: payload.deviceInfor,
          startDateTime : payload.startDateTime,
          clientType : payload.clientType,
          userID: payload.userID
				};

				bucket.upsert(dto.id, dto, (err, res) => {
					callback(err, res, dto);
				})
			}
		});
	}

	saveDelayCardTopup(dto, callback) {
	  var delayDto  = {}; Object.assign(delayDto, dto);

    delayDto.id = "DelayCardTopup_" + dto.transRef;
    delayDto.type ="DelayCardTopup";

    this.upsert(delayDto, (err, res) => {
      callback(err, res);
      if (err) {
        log.error("saveDelayCardTopup, error when insert:", err);
      } else {
        bucket.get(dto.id, (err, res) => {
          if (err) {
            //if not exist, just insert into db
            log.error("saveDelayCardTopup, error:", err);
            return;
          }

          var doc = res.value;
          doc.status = dto.status;
          doc.stage = 1;
          doc.transId = dto.transId;
          doc.resSerial = dto.serial;
          doc.resCardType = dto.type;
          doc.amount = dto.amount;
          doc.closeDateTime = new Date().getTime();
          doc.resRequestTime = dto.requestTime;

          this.upsert(doc, (err, res) => {
            if (err) {
              log.error("saveDelayCardTopup, error when update txn:", err);
            }
          });
        })
      }
    });
	}

  logData(dto, type, cat, callback) {
    bucket.counter("idGen_" + type + "_" + cat, 1, {initial: 0}, (err, res)=> {
      if (err) {
        if (callback) callback(err, res);
      } else {
        var id = type + "_" + cat + "_" + res.value;
        dto.id = id;
        dto.type = type;
        dto.cat = cat;

        log.info("will logData into db:", id);

        this.upsert(dto, (err, res) => {
          if (err) {
            log.error("logData error:", err);
          }

          if (callback) callback(err, res);
        });
      }
    });
  }
}

module.exports = OnePay;