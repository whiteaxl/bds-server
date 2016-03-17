'use strict'

var Boom = require('boom');
//var Ads = require('../../database/models/Ads');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var myBucket = require('../../database/mydb');
var QueryOps = require('../../lib/QueryOps');

var internals = {};

function findAds(queryCondition, reply) {
	//return all first
	var query = ViewQuery.from('ads', 'all_ads');
	myBucket.query(query, function(err, allAds) {
		if (!allAds)
			allAds = [];

		//ES5 syntax to select
		var filtered = allAds.filter(function(doc) {
			for (var attr in queryCondition) {
				if (attr!=='orderBy' && !match(attr, queryCondition[attr], doc)) {
					return false;
				}
			};
			return true;
		});

		//sort

		console.log("Perform ordering by " + queryCondition['orderBy']);

		orderAds(filtered, queryCondition['orderBy']);


	  	reply({
	  		length: filtered.length,
			list: filtered
			
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
}

function match(attr, value, doc) {
	//
	let ads = doc.value;

	let idx = 0;
	//BETWEEN
	idx = attr.indexOf(QueryOps.BETWEEN);

	if (~idx) {
		var field = attr.substring(0, idx-1);
		var splits = value.split(",");
		
		return ads[field] >= splits[0] && ads[field] <= splits[1] 
	}
	//GREATER
	idx = attr.indexOf(QueryOps.GREATER);
	if (~idx) {
		//if 0 then no need to check
		if (value===0) {
			return true;
		}
		var field = attr.substring(0, idx-1);
		return ads[field] >= value;
	}

	//default is equals
	//console.log(ads[attr] + "," + attr)
	//console.log(ads)

	return ads[attr] == value;

}

//orderCondition=dienTichASC
//orderCondition=giaDESC
function orderAds(filtered, orderCondition) {
	if (orderCondition) {
		var orderByVal = orderCondition;
		var field = '';
		var isASC = 1;
		console.log("aaaa=" + orderByVal)
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
	console.log("payload: " + req.payload);

	findAds(req.payload, reply) 
}


module.exports = internals;