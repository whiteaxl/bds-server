'use strict';

var Boom = require('boom');
//var Ads = require('../../database/models/Ads');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

var myBucket = require('../../database/mydb');
var QueryOps = require('../../lib/QueryOps');
var http = require("http");
var logUtil = require("../../lib/logUtil");

var Q_FIELD = {
	limit : "limit",
	orderBy : "orderBy",
	geoBox : "geoBox",
	place: "place"
};

var internals = {};

function _filterResult(allAds, queryCondition) {
	if (!allAds)
		allAds = [];

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

	// limit
	let listResult = filtered.slice(0,1000).map((one) => {
		let val = one.value;
		if (val.cover) {
			val.cover_small = val.cover;
			val.cover = val.cover_small.replace("120x90", "745x510");
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

	//default is equals
	//console.log(ads[attr] + "," + attr)
	//console.log(ads)

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
		console.log("orderByVal=" + orderByVal)
		console.log(orderByVal.indexOf("DESC"))

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
				return 1*isASC;
			if (a.value[field] < b.value[field])
				return -1 * isASC;

			return 0;
		}

		filtered.sort(compare);
	};

}


internals.findPOST = function(req, reply) {
	logUtil.info("findPOST - query: " + req.payload);
	try {
		//let x=1/0;
		findAds(req.payload, reply) 	
	} catch (e) {
		console.log('ERROR')

		console.log(e);
		reply("ERROR" + e);
	}
	
}


module.exports = internals;