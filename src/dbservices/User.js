'use strict';

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

class UserModel {
	constructor(myBucket) {
		this.myBucket = myBucket;
	}

	upsert(userDto) {
		this.myBucket.upsert(userDto.userID, userDto, function(err, res) {
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