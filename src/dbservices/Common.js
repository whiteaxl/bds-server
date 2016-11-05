'use strict';

var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;
var logUtil = require("../lib/logUtil");

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
		logUtil.info("Call query:",sql);

		var query = N1qlQuery.fromString(sql);
		bucket.query(query, callback);
	}

	byId(id, callback) {
		let sql  = `select t.* from default t where id ='${id}'`;

		var query = N1qlQuery.fromString(sql);
		bucket.query(query, (err ,list) => {
			if (err) {
				logUtil.error("Error:", err);
				callback(err, null);
				return null;
			}

			if (!list || list.length==0) {
				callback(null, null);
				return null;
			}

			callback(null, list[0]);
		});
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