'use strict';

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

var myBucket = require('../database/mydb');

class AdsModel {
	upsert(adsDto) {
		myBucket.upsert(adsDto.adsID, adsDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	queryAll(callBack) {
        let query = ViewQuery.from('ads', 'all_ads').limit(3);

        myBucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            callBack(all);
        });
    }

	getAds(adsID, callback) {
		myBucket.get(adsID, callback);
	}
}

module.exports = AdsModel;