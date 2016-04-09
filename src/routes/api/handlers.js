'use strict';

var Boom = require('boom');
//var Ads = require('../../database/models/Ads');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

var myBucket = require('../../database/mydb');
var QueryOps = require('../../lib/QueryOps');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");
var PlacesModel = require('../../dbservices/Place');
var AdsModel = require('../../dbservices/Ads');
var placeUtil = require("../../lib/placeUtil");
var _ = require("lodash");
var moment = require("moment");


var Q_FIELD = {
	limit : "limit",
	orderBy : "orderBy",
	geoBox : "geoBox",
	place: "place"
};

var internals = {};

function _filterResult(allAds, queryCondition) {

	//ES5 syntax to select
	var filtered = allAds.filter(function(doc) {
		for (var attr in queryCondition) {
			if (attr !== "orderBy"  && attr !== "limit"
				&& !match(attr, queryCondition[attr], doc)) {
				console.log("Not match attr=" + attr + ", value=" + queryCondition[attr]);
				return false;
			}
		}
		return true;
	});

	//sort

	if (queryCondition) {
		let od = queryCondition['orderBy'];
		if (od) {
			console.log("Perform ordering by " + od);
			orderAds(filtered, od);
		} else {
			console.log("No ordering by ");
		}
	}
	console.log("filtered length = " + filtered.length);

	// TODO: limit
	let listResult = filtered.slice(0,1000).map((one) => {
		let val = one.value;
		val.giaDisplay = util.getPriceDisplay(val.gia);
		val.dienTichDisplay = util.getDienTichDisplay(val.dienTich);

		if (val.ngayDangTin) {
            var NgayDangTinDate= moment(val.ngayDangTin, "DD-MM-YYYY");
            val.soNgayDaDangTin = moment().diff(NgayDangTinDate, 'days');
        }

		return one;
	});

	console.log("listResult length = " + listResult.length);

	//
	if (queryCondition && queryCondition['limit']) {
		let lim = queryCondition['limit'];
		listResult = listResult.slice(0, lim)
	}

	return listResult;
}



function findAds(queryCondition, reply) {
	//return all first
	let query;

	if (queryCondition[Q_FIELD.geoBox]) {
		query = couchbase.SpatialQuery.from("ads_spatial", "points").bbox(queryCondition[Q_FIELD.geoBox]);
		queryCondition[Q_FIELD.geoBox] = undefined;//remove it
	} else if (queryCondition[Q_FIELD.place]) { //by place
		query = ViewQuery.from('ads', 'all_ads');
	} else {
		query = ViewQuery.from('ads', 'all_ads');

		//let msg = "GeoBox or place is mandatory!";
		//logUtil.error(msg);
		//reply(Boom.badRequest(msg, queryCondition));
	}

	myBucket.query(query, function(err, allAds) {
		if (!allAds)
			allAds = [];

		logUtil.info("By geo/place: allAds.length= " + allAds.length);
		let listResult = _filterResult(allAds, queryCondition);

	  	reply({
	  		length: listResult.length,
			list: listResult
	  	});
	});
}

// ?loaiTin=0&loaiNhaDat=0&giaBETWEEN=1000,2000&soPhongNguGREATER=2
// &spPhongTamGREATER=1&dienTichBETWEEN=50,200
// &orderBy=giaASC,dienTichDESC,soPhongNguASC
internals.findGET = function(req, reply) {
	//get query object
	var queryCondition = req.query;

	findAds(queryCondition, reply);
};

//
function matchDiaChi(adsPlace, place) {
    if (!place.diaChi || !adsPlace.diaChi) {
        logUtil.info("Fail, one of the diaChi is null!")
        return false;
    }

	logUtil.info("ads.place.diaChi="+ adsPlace.diaChi);
	//logUtil.info("value="+ value);
	//logUtil.info("ads.place.diaChi.indexOf(value)="+ ads.place.diaChi.indexOf(value));


	//compare diaChi
	let placeDiaChiLocDau = util.locDau(place.diaChi);
	let adsPlaceDiaChiLocDau = util.locDau(adsPlace.diaChi);
	//remove common words
	const COMMON_WORDS = {
        '-district': '',
        '-vietnam':'',
        'hanoi' : 'ha-noi'
    };
	for (var f in COMMON_WORDS) {
		placeDiaChiLocDau = placeDiaChiLocDau.replace(f,COMMON_WORDS[f]);
		adsPlaceDiaChiLocDau = adsPlaceDiaChiLocDau.replace(f,COMMON_WORDS[f]);
	}

	logUtil.info("placeDiaChiLocDau="+ placeDiaChiLocDau + ", adsPlaceDiaChiLocDau=" + adsPlaceDiaChiLocDau);

	if (adsPlaceDiaChiLocDau.indexOf(placeDiaChiLocDau)!==-1)
		return true;

	return false;
}

function match(attr, value, doc) {
	//
	let ads = doc.value;

	let idx = 0;
	//BETWEEN
	idx = attr.indexOf(QueryOps.BETWEEN);

	if (idx > 0) {
		var field = attr.substring(0, idx);

		var splits = value.split(",");

		var ret = ads[field] >= splits[0] && ads[field] <= splits[1];

		if (!ret) {
			console.log("FAIL to check " +  "field=" + field  + ", ads[field]=" + ads[field] + ", splits[0]=" + splits[0] + ", splits[1]=" + splits[1])
		}
		
		return ret; 
	}
	//GREATER
	idx = attr.indexOf(QueryOps.GREATER);
	if (idx>0) {
		//if 0 then no need to check
		if (value===0) {
			return true;
		}

		//
		if (!ads[field]) {
			return false;
		}

		var field = attr.substring(0, idx);
		
		let ret = ads[field] >= value;

		if (!ret) {
			console.log("FAIL to check " +  "field=" + field  + ", ads[field]=" + ads[field])
		}

		return ret;
	}
	// Place
	if (attr == "placeName") {
		if (!ads.place.diaChi) {
			return false;
		}

        let place;
        logUtil.info(value);
        if (_.isObject(value)) {
            place = value;
        } else {
            place = {
                diaChi: value
            }
        }

		return matchDiaChi(ads.place, place);
	}

	//default is equals
	if (ads[attr] == value) {
        return true;
    } else {
        logUtil.info("Not match '" + attr +  "': doc value: "+ ads[attr] + ", filtered value:" + value);
        return false;
    }
}

//orderCondition=dienTichASC
//orderCondition=giaDESC
function orderAds(filtered, orderCondition) {
	if (orderCondition) {
		var orderByVal = orderCondition;
		var field = '';
		var isASC = 1;
		//console.log("orderByVal=" + orderByVal);
		//console.log(orderByVal.indexOf("DESC"));

		if (orderByVal.indexOf("DESC")>0) {
			field = orderByVal.substring(0, orderByVal.length-4); //remove DESC
			isASC = -1;
		} else {
			field = orderByVal.substring(0, orderByVal.length-3); //remove ASC
		}

		console.log("Order by field:" + field);
			var compare = function(a, b) {
				//console.log("Will compare: " + field +  "," + a.value.dienTich + ", " + b[field])
			if (a.value[field] > b.value[field])
				return isASC;
			if (a.value[field] < b.value[field])
				return -1 * isASC;

			return 0;
		};

		filtered.sort(compare);
	}

}


internals.findPOST = function(req, reply) {
	logUtil.info("findPOST - query: " + req.payload);
	try {
		//let x=1/0;
		findAds(req.payload, reply) 	
	} catch (e) {
		logUtil.error(e);
		reply(Boom.badImplementation());
	}
	
};


internals.findPlace = function(req, reply) {
	logUtil.info("Enter findPlace");

	let query = req.payload;
	logUtil.info("findPlace - query: " + query);
	try {
		//let x=1/0;
		logUtil.info("findPlace - query.text: " + query.text);

		if (!query.text) {
			query.text =""
		}

		let textLocDau=util.locDau(query.text);
		logUtil.info("findPlace - textLocDau: " + textLocDau);

		var myPlacesModel = new PlacesModel(myBucket);

		myPlacesModel.queryAll((all) => {
			var filtered = [];
			for (var i in all) {
				let place = all[i].value;
				let name = util.locDau(place.fullName);


				logUtil.info("findPlace - fullName loc dau: " + name);
				if (name.indexOf(textLocDau)!==-1) {
					filtered.push(place);
				}
			}

			reply({length: filtered.length, list: filtered});
		})

	} catch (e) {
		logUtil.error(e);
		reply(Boom.badImplementation());
	}

};

internals.getAllAds = function(req, reply) {
	var adsModel = new AdsModel(myBucket);
	adsModel.queryAll(function(result){
		reply(result);
	});
	/*var query = ViewQuery.from('ads', 'all_ads');
	myBucket.query(query, function(err, allAds) {
		console.log("Number of ads: " + allAds.length);

		if (!allAds)
			allAds = [];
		reply(allAds);
	  	//reply.view('admin/viewall', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
	});*/
};





module.exports = internals;