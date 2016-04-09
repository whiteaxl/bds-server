'use strict';

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

class AdsModel {
	constructor(myBucket) {
		this.myBucket = myBucket;
	}

	upsert(adsDto) {
		this.myBucket.upsert(adsDto.adsID, adsDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	queryAll(callBack) {
        let query = ViewQuery.from('ads', 'all_ads');

        this.myBucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            callBack(all);
        });
    }
}

module.exports = AdsModel;