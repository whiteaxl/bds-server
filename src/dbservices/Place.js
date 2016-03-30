'use strict';

class PlaceModel {
	constructor(myBucket) {
		this.myBucket = myBucket;
	}

	upsert(placeDto) {
		this.myBucket.upsert(placeDto.placeID, placeDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			};
		})
	}
}

module.exports = PlaceModel