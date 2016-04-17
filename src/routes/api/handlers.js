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

var geoUtil = require("../../lib/geoUtil");

var DEFAULT_SEARCH_RADIUS = 5; //km

var Q_FIELD = {
	limit : "limit",
	orderBy : "orderBy",
	geoBox : "geoBox",
	place: "place",
    radiusInKm: "radiusInKm",
    gia : "gia",
    dienTich : "dienTich",
    loaiTin : "loaiTin"
};

var internals = {};


function _filterResult(allAds, queryCondition) {


	//ES5 syntax to select
	var filtered = allAds.filter(function(doc) {
		for (var attr in queryCondition) {
            if (!match(attr, queryCondition[attr], doc)) {
				//console.log("Not match attr=" + attr + ", value=" + queryCondition[attr]);
				return false;
			}
		}
		return true;
	});


	console.log("List ads filtered length = " + filtered.length);

	// TODO: limit
	let listResult = filtered.slice(0,1000).map((one) => {
		let val = one.value;
		val.giaDisplay = util.getPriceDisplay(val.gia);
		val.dienTichDisplay = util.getDienTichDisplay(val.dienTich);

        if (val.chiTiet) {
            var idx = val.chiTiet.indexOf("Tìm kiếm theo từ khóa");
            val.chiTiet =  val.chiTiet.substring(0, idx);
            //val.chiTietDisplay =  val.chiTiet.substring(0, idx);
        }

		if (val.ngayDangTin) {
            var NgayDangTinDate= moment(val.ngayDangTin, "DD-MM-YYYY");
            val.soNgayDaDangTin = moment().diff(NgayDangTinDate, 'days');
        }

		return one;
	});

	console.log("FINAL listResult length = " + listResult.length);

	return listResult;
}



function findAds(queryCondition, reply) {
	//return all first
	let query;
    let center = {lat: 0, lon: 0};
    let radiusInKm = util.popField(queryCondition, Q_FIELD.radiusInKm) || DEFAULT_SEARCH_RADIUS;
    let isSearchByDistance = false;
    let limit = util.popField(queryCondition,Q_FIELD.limit);
    let orderBy = util.popField(queryCondition,Q_FIELD.orderBy);

    logUtil.info("isSearchByDistance=" + isSearchByDistance + ", radiusInKm=" + radiusInKm)

	if (queryCondition[Q_FIELD.geoBox]) {
        let geoBox = util.popField(queryCondition, Q_FIELD.geoBox);
        logUtil.warn("findAds - Search by BOX: " + geoBox);
		query = couchbase.SpatialQuery.from("ads_spatial", "points").bbox(geoBox);

        //search by geoBox, so no need place
		delete queryCondition[Q_FIELD.place];

	} else if (queryCondition[Q_FIELD.place]) {
        var place = queryCondition[Q_FIELD.place];

        console.log(place.geometry);
        center.lat = place.geometry.location.lat;
        center.lon = place.geometry.location.lng;

        if (placeUtil.isOnePoint(place)) { //DIA_DIEM, so by geoBox also
            logUtil.warn("findAds - Search by DIA_DIEM");
            isSearchByDistance = true;
			let geoBox = geoUtil.getBox({lat:place.geometry.location.lat, lon:place.geometry.location.lng}
                , geoUtil.meter2degree(radiusInKm));

            console.log("Search in box: " + geoBox);
            //search by geoBox, so no need place
            delete queryCondition[Q_FIELD.place];

            query = couchbase.SpatialQuery.from("ads_spatial", "points").bbox(geoBox);
		} else {
            logUtil.warn("findAds - Search by DIA CHINH : Tinh, Huyen, Xa");
            query = ViewQuery.from('ads', 'all_ads');
        }
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

        //filter by distance
        let transformed = [];
        listResult.forEach((e) => {
            let ads = e.value;

            let place = ads.place;
            //console.log(center.lat, center.lon, place.geo.lat, place.geo.lon);

            ads.distance = geoUtil.measure(center.lat, center.lon, place.geo.lat, place.geo.lon);
            //console.log("Distance for " + ads.place.diaChi +  "= " + ads.distance + "m");

            //filter by distance bcs get by geoBox, not radius
            if (isSearchByDistance) {
                if (ads.distance < radiusInKm * 1000) {
                    transformed.push(ads);
                }
            } else {
                transformed.push(ads)
            }
        });

        //sort
        if (queryCondition && orderBy) {
            console.log("Perform ordering by " + orderBy);
            orderAds(transformed, orderBy);
        } else if (isSearchByDistance) {
            var compare = function(a, b) {
                //console.log("Will compare: " + field +  "," + a.value.dienTich + ", " + b[field])
                if (a.distance > b.distance)
                    return 1;
                else
                    return -1;

                return 0;
            };

            transformed.sort(compare);
        }

        transformed.forEach((e) => {
            console.log("Distance for " + e.adsID +  "= " + e.distance + "m");
        });

        logUtil.info("There are " + transformed.length + " ads");


        //limit
        if (queryCondition && limit) {
            transformed = transformed.slice(0, limit)
        }

	  	reply({
	  		length: transformed.length,
			list: transformed
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

	//logUtil.info("ads.place.diaChi="+ adsPlace.diaChi);
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

	//logUtil.info("placeDiaChiLocDau="+ placeDiaChiLocDau + ", adsPlaceDiaChiLocDau=" + adsPlaceDiaChiLocDau);

	if (adsPlaceDiaChiLocDau.indexOf(placeDiaChiLocDau)!==-1)
		return true;

    logUtil.info("Not match by PLACE: searching DiaChiLocDau=" + placeDiaChiLocDau + ", DB DiaChiLocDau=" + adsPlaceDiaChiLocDau);


	return false;
}

function _NotSupport(attr) {
    let attrFormalize = attr.replace(QueryOps.BETWEEN, "");
    attrFormalize = attrFormalize.replace(QueryOps.GREATER, "");

    for (var e in Q_FIELD) {
        if (Q_FIELD[e] == attrFormalize) {
            return false;
        }
    }

    return true;
}

function match(attr, value, doc) {
	//If not in list, then consider as true
	if (_NotSupport(attr)) {
        logUtil.warn("The parameter " + attr + " does not support! So no filter!");
        return true;
    }

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
	// Place, compare by value.fullName
	if (attr == Q_FIELD.place) {
		//logUtil.info("PLACE OBJECT in QUERY:");
		//logUtil.info(value);

		if (!ads.place.diaChi) {
			return false;
		}

        let place;
		let dc = value.fullName;

        //logUtil.info(dc);
        if (_.isObject(dc)) {
            place = dc;
        } else {
            place = {
                diaChi: dc
            }
        }

		let ret = matchDiaChi(ads.place, place);

        return ret;
	}

	//default is equals
	if (ads[attr] == value) {
        return true;
    } else {
        logUtil.info("Not match '" + attr +  ", db docID:" + ads.adsID + "': db value: "+ ads[attr] + ", searching value:" + value);
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
			if (a[field] > b[field])
				return isASC;
			if (a[field] < b[field])
				return -1 * isASC;

			return 0;
		};

		filtered.sort(compare);
	}

}


internals.findPOST = function(req, reply) {
	logUtil.info("findPOST - query: " );
    console.log(req.payload);


	try {
		//let x=1/0;
		findAds(req.payload, reply) 	
	} catch (e) {
		logUtil.error(e);
		//console.trace(e);
        console.log(e, e.stack.split("\n"));

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
		for (var i = 0; i < result.length; i++) { 
    		var ads = result[i];
    		if(result[i].value.place){
    			if(result[i].value.place.geo){
	    			result[i].map={
	    				center: {
							latitude: 	result[i].value.place.geo.lat,
							longitude: 	result[i].value.place.geo.lon
						},
	    				marker: {
							id: i,
							coords: {
								latitude: 	result[i].value.place.geo.lat,
								longitude: 	result[i].value.place.geo.lon
							},
							options: {
								labelContent : result[i].value.gia
							},
							data: 'test'
						},
						options:{
							scrollwheel: false
						},
						zoom: 14	
	    			}
	    					
				}
    		}
    		
		}


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