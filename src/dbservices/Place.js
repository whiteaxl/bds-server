'use strict';


var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;

var placeUtil = require('../lib/placeUtil');

class PlaceModel {


	upsert(dto) {
		
		bucket.upsert(dt.placeID, dto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	//return top 5
	getPlaceByNameLike(input, callback) {
	
		let inputKhongDau = placeUtil.chuanHoaAndLocDau(input);

    var sql = `select default.* from default where type='Place' and geometry is not missing 
    		and nameKhongDau like '%${inputKhongDau}%' order by placeType desc limit 10 `;

    console.log('getPlaceByNameLike, sql=',sql);
    var query = N1qlQuery.fromString(sql);

    bucket.query(query, callback);
  }

	getAllPlaces(callback) {
		var sql = "select default.* from default where type='Place'";
		var query = N1qlQuery.fromString(sql);
		console.log("getAllPlaces, sql=", sql);

		bucket.query(query, callback);
	}

	getAllPlaces4Autocomplete(callback) {
		var sql = "select default.* from default where type='Place' and (notAllowToSearch = false or notAllowToSearch is missing)";
		var query = N1qlQuery.fromString(sql);
		console.log("getAllPlaces, sql=", sql);
		bucket.query(query, callback);
	}

	getPlaceByDiaChinhKhongDau(dto,callback){
		var sql = "select default.* from default where type='Place'";
		var whereClause = this._buildWhereClause(dto);
		sql = sql + whereClause;

		console.log("getDuAnByDiaChinh" + sql);

		var query = N1qlQuery.fromString(sql);
		bucket.query(query, callback);
	}

	_buildWhereClause(dto){
		var tinhKhongDau = dto.tinhKhongDau;
		var huyenKhongDau = dto.huyenKhongDau;
		var xaKhongDau = dto.xaKhongDau;
		var placeType = dto.placeType;

		var whereClause = "";

		if (tinhKhongDau){
			whereClause = whereClause + " and tinhKhongDau='" + tinhKhongDau + "'";
		}

		if (huyenKhongDau){
			// support only for tu liem
			if (huyenKhongDau=='tu-liem') {
				whereClause = whereClause + " and (huyenKhongDau = 'nam-tu-liem' or huyenKhongDau = 'bac-tu-liem')";
			} else {
				whereClause = whereClause + " and huyenKhongDau='" + huyenKhongDau + "'";
			}
		}

		if (xaKhongDau){
			whereClause = whereClause + " and xaKhongDau='" + xaKhongDau + "'";
		}

		if (placeType){
			whereClause = whereClause + " and placeType='" + placeType + "'";
		}

		return whereClause;

	}

	getDuAnByDiaChinh(dto,callback){
		var sql = "select default.* from default where type='Place' and placeType='A'";
		var whereClause = "";
		if (dto.tinhKhongDau){
			whereClause = whereClause + " and tinhKhongDau='" + dto.tinhKhongDau + "'";
		}

		if (dto.huyenKhongDau){
			whereClause = whereClause + " and huyenKhongDau='" + dto.huyenKhongDau + "'";
		}

		sql = sql + whereClause;

		console.log("getDuAnByDiaChinh" + sql);

		var query = N1qlQuery.fromString(sql);
		bucket.query(query, callback);
	}

	getPlaceByID(placeID,callback){
		var sql = "select default.* from default where type='Place' and id='" + placeID + "'";
		console.log("getPlaceByID" + sql);
		var query = N1qlQuery.fromString(sql);
		bucket.query(query, callback);
	}

	//may be for testing only
	patchDataInDB(){
	
		
		var sql = "select default.* from default where type='Place' where geometry is not missing and geometry.viewport is not missing";
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