'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;


class DuAnModel {


	initBucket() {
		bucket.enableN1ql(['127.0.0.1:8093']);
		bucket.operationTimeout = 60 * 1000;
		bucket = cluster.openBucket('default');
	}

	upsert(duAnDto) {
		this.initBucket();

		bucket.upsert(duAnDto.duAnID, duAnDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}
}

module.exports = DuAnModel;