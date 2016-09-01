'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;

class CommonModel {
	upsert(dto,callback) {
		bucket.operationTimeout = 1200 * 1000;

		bucket.upsert(dto.id, dto, function (err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
			if(callback)
				callback(err,res);
		})
	}


	countByType(type, onSuccess) {
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