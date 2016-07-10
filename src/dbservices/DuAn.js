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

		duAnDto.id = duAnDto.duAnID;

		bucket.upsert(duAnDto.id, duAnDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	findDuAn(q,callback){
		var sql = "SELECT t.* FROM `default` t  where t.type='DuAn' ";

        if (q.hot) {
            sql = sql + " and t.hot=" + q.hot;
        }
        if(q.tinhKhongDau) {
        	sql = sql + " and t.diaChinh.tinhKhongDau='" + q.tinhKhongDau + "'";
        }
        if (q.limit) {
            sql = sql + " limit  " + q.limit;
        }
        else {
            sql = sql + " limit 4 ";
        }

        console.log("sql:" + sql );
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            
            if (!all)
                all = [];
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            callback(err,all);            
        });

	}

}

module.exports = DuAnModel;