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
		  log.info("Done get next seq numnber for scratchTopup");

			if (err) {
				callback(err, res);
			} else {
				var id = `Scratch_${payload.userID}_${res.value}`;

				var dto = {
					id : id,
          type: "TxTopup",
          userID: payload.userID,
					clientType: payload.clientType,
          clientInfor: payload.clientInfor,
          paymentType : "scratch",
          paymentName : "Thẻ cào",
          startDateTime : new Date().getTime(),
          stage : constant.TOPUP_STAGE.INIT, //mean initial
          //optional
          cardType : payload.type,
          cardSerial : payload.serial,
          cardPin : payload.pin,

				};


				bucket.upsert(dto.id, dto, (err, res) => {
          log.info("Done save init txTopup");
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