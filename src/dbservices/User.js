'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);


class UserModel {
    getUserByDeviceID(deviceID, callback) {
        var sql = `select * from default where _type='User' and deviceID =  '${deviceID}'`;
        var query = N1qlQuery.fromString(sql);

        bucket.query(query, callback);
    }


	upsert(userDto) {
        bucket.get();

        bucket.upsert(userDto.userID, userDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	queryAll(callBack) {
        let query = ViewQuery.from('user', 'all_user');

        this.myBucket.query(query, function(err, all) {
            console.log(all);

            if (!all)
                all = [];

            callBack(all);
        });
    }
}

module.exports = UserModel;