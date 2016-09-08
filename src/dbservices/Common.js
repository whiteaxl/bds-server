'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;

class CommonModel {

	initBucket() {
		cluster = new couchbase.Cluster('couchbase://localhost:8091');
		bucket.enableN1ql(['127.0.0.1:8093']);
		bucket.operationTimeout = 120 * 1000;
		bucket = cluster.openBucket('default');
	}

	upsert(dto,callback) {
		bucket.upsert(dto.id, dto, function (err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
			if(callback)
				callback(err,res);
		})
	}

	insert(dto,callback) {
		bucket.insert(dto.id, dto, function (err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
			if(callback)
				callback(err,res);
		})
	}

	query(sql, callback) {
		this.initBucket();

		var query = N1qlQuery.fromString(sql);
		bucket.query(query, callback);
	}

	countByType(type, onSuccess) {
		this.initBucket();
		
		var sql = `select count(*) cnt from default where type = '${type}'`;
		var query = N1qlQuery.fromString(sql);

		bucket.operationTimeout = 1200 * 1000;

		bucket.query(query, function (err, res) {
			if (err) {
				console.log('query failed'.red, err);
				return;
			}
			console.log('success!', res);

			onSuccess(res[0].cnt);
		});
	}

}

module.exports = CommonModel;