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
var http = require('http');
var https = require('https');



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

internals.findGooglePlaceById = function(req, reply){
	logUtil.info("findPOST - query: " + req.payload);
	var googlePlaceId = req.payload.googlePlaceId;
	var url = 'https://maps.googleapis.com/maps/api/place/details/json?';
	url = url + 'key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU';
	url = url + '&placeid=' + googlePlaceId;
	console.log("googlePlaceId " + googlePlaceId);
	console.log("url " + url);

	https.get(url)
    .on('response', function (response) {
    	console.log("go here with " + response.status);
        reply(response);
    });
}


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
	//query = ViewQuery.from('ads', 'all_ads');

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

			if (center.lat && center.lon && place.geo.lat && place.geo.lon)
            	ads.distance = geoUtil.measure(center.lat, center.lon, place.geo.lat, place.geo.lon);

            //console.log("Distance for " + ads.place.diaChi +  "= " + ads.distance + "m");

            //filter by distance bcs get by geoBox, not radius
            if (isSearchByDistance) {
                if (ads.distance && ads.distance < radiusInKm * 1000) {
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


/**
 *  Co' 3 loai search:
 *      Tim kiem theo GeoBox : phuc vu MAP
 *      Tim kiem theo Dia Chinh : search text
 *      Tim kiem theo Dia Diem  + Ban Kinh: search text
 *  Thu tu uu tien khi tim kiem: GeoBox > Dia Chinh/Dia Diem
 *  Su dung tim theo BanKinh cho: DiaDiem (ko phai Tinh/Huyen/Xa), Current Location
 * Request json: {
 *  loaiTin: bat buoc
 *  	Number, 0=BAN, 1 = THUE
 *  loaiNhaDat:
 *  	Number, eg: 1,2,... (tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js)
 *  giaBETWEEN:
 *  	Array, eg [0,85] : <from,to>, don vi la` TRIEU (voi THUE la trieu/thang)
 *  dienTichBETWEEN:
 *  	Array: [from,to] , don vi la` m2
 *  ngayDaDang: 1,...//so ngay da dang
 *  huongNha:
 *      Number, 1.... (tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js)
 *  geoBox:
 *		[105.84372998042551,20.986007099732642,105.87777141957429,21.032107100267314]
 *  place_id:
 *      Lay tu google place
 *  CurrentLocation: //current location
 *      Array: [lat, lon]
 *  radiusInKm : // 2km
 *      Number, eg: 0.5
 *  relandTypeName : //de thong nhat giua client-server
 *      String: Tinh/Huyen/Xa/DiaDiem
 	*
 *  }
 *
 *  Reponse : xem trong file sample_find.js
 */

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



module.exports = internals;
