'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');

var placeUtil = require('../lib/placeUtil');

bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;

class PlaceModel {

	initBucket() {
		cluster = new couchbase.Cluster('couchbase://localhost:8091');
		bucket.enableN1ql(['127.0.0.1:8093']);
		bucket.operationTimeout = 120 * 1000;
		bucket = cluster.openBucket('default');
	}

	upsert(dto) {
		this.initBucket();
		bucket.upsert(dt.placeID, dto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	//return top 5
	getPlaceByNameLike(input, callback) {
		this.initBucket();

		let inputKhongDau = placeUtil.chuanHoaAndLocDau(input);

    var sql = `select default.* from default where type='Place' and geometry is not missing 
    		and nameKhongDau like '%${inputKhongDau}%' order by placeType desc limit 10 `;

    console.log('getPlaceByNameLike, sql=',sql);
    var query = N1qlQuery.fromString(sql);

    bucket.query(query, callback);
  }

	//may be for testing only
	patchDataInDB(){
		this.initBucket();
		
		var sql = "select default.* from default where type='Place'";
		var query = N1qlQuery.fromString(sql);

		var that = this;
		bucket.query(query, function (err, all) {
			console.log("number of Place:" + all.length);
			if (!all)
				all = [];

			all.forEach((obj) => {
				if (obj.fullName) {
					let spl = obj.fullName.split(",");
					let l = spl.length;
					if (l>=1) {
						obj.tinh = spl[l-1].trim();
						obj.tinhKhongDau =placeUtil.chuanHoaAndLocDau(obj.tinh);
					} else {
						console.log("Error, obj.fullName empty:", obj.fullName)
					}

					if (l>=2) {
						obj.huyen = spl[l-2].trim() ;
						obj.huyenKhongDau =placeUtil.chuanHoaAndLocDau(obj.huyen);
					}

					if (l>=3) {
						obj.xa = spl[l-3].trim() ;
						obj.xaKhongDau =placeUtil.chuanHoaAndLocDau(obj.xa);
					}
				}

				obj.nameKhongDau = placeUtil.chuanHoaAndLocDau(obj.placeName);

				bucket.upsert(obj.id, obj, function (err, res) {
					if (err) {
						console.log("ERROR:" + err);
					}
				})
			});

			console.log("Finish!");
		});
	}
}



module.exports = PlaceModel;