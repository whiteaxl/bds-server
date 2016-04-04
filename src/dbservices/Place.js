'use strict';

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

class PlaceModel {
	constructor(myBucket) {
		this.myBucket = myBucket;
	}

	upsert(placeDto) {
		this.myBucket.upsert(placeDto.placeID, placeDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	queryAll(callBack) {
        let query = ViewQuery.from('place', 'all_places');

        this.myBucket.query(query, function(err, all) {
            console.log(all);

            if (!all)
                all = [];

            callBack(all);
        });
    }
}

module.exports = PlaceModel;