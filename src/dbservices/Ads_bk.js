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

/*
	queryAll(callBack) {
        let query = ViewQuery.from('ads', 'all_ads').limit(3);

        this.myBucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            callBack(all);
        });
    }
*/
    queryAll(callBack) {
        console.log("Ads.queryAll:");
        var N1qlQuery =  require('couchbase').N1qlQuery;

        this.myBucket.enableN1ql(['127.0.0.1:8799']);
        var query = N1qlQuery.fromString("SELECT * FROM `default` where _type='Ads' LIMIT 3");
        	this.myBucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            console.log("all: " + all);
            callBack(all);
        });
    }

    queryWhere(whereCodition, callBack) {
        this.myBucket.query(N1qlQuery.simple("SELECT * FROM `default` where _type='Ads' LIMIT 4"), function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            callBack(all);
        });
    }
}

module.exports = AdsModel;