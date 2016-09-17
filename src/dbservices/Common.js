'use strict';

var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;

class CommonModel {
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
	

		var query = N1qlQuery.fromString(sql);
		bucket.query(query, callback);
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