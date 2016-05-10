'use strict';

var Boom = require('boom');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

var myBucket = require('../../database/mydb');
var QueryOps = require('../../lib/QueryOps');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");
var PlacesModel = require('../../dbservices/Place');
var AdsService = require('../../dbservices/Ads');
var placeUtil = require("../../lib/placeUtil");
var http = require('http');
var https = require('https');
var services = require("../../lib/services");
var constant = require("../../lib/constant");
var danhMuc  = require("../../lib/DanhMuc");

var _ = require("lodash");
var moment = require("moment");

var geoUtil = require("../../lib/geoUtil");

var DEFAULT_SEARCH_RADIUS = 5; //km

var adsService = new AdsService();

var Q_FIELD = {
	limit : "limit",
	orderBy : "orderBy",
	geoBox : "geoBox",
	place: "place",
    placeId: "placeId",
    radiusInKm: "radiusInKm",
    gia : "gia",
    dienTich : "dienTich",
    loaiTin : "loaiTin",
    loaiNhaDat : "loaiNhaDat",
    soPhongNgu : "soPhongNgu",
    soPhongTam: "soPhongTam",
    soTang : "soTang",
    huongNha : "huongNha",
    ngayDangTin : "ngayDangTin"
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

function _performQuery(queryCondition, dbQuery, reply, isSearchByDistance, orderBy, limit, center, radiusInKm, geoBox) {
    myBucket.query(dbQuery, function(err, allAds) {
        if (!allAds)
            allAds = [];

        logUtil.info("By geo/place: allAds.length= " + allAds.length + ", isSearchByDistance="+ isSearchByDistance + ",radiusInKm=" + radiusInKm);
        let listFiltered = _filterResult(allAds, queryCondition);
        //let listFiltered = allAds;
        //filter by distance
        let transformeds = [];
        let transformed ={};

        listFiltered.forEach((e) => {
            let ads = e.value;
            //images:
            var targetSize = "745x510"; //350x280
            /*
            if (ads.image.cover) {
                ads.image.cover = ads.image.cover.replace("80x60", targetSize).replace("120x90", targetSize);
            }
            if (ads.image.images) {
                ads.image.images = ads.image.images.map((e) => {
                    return e.replace("80x60", targetSize);
                });
            }
            */

            let tmp = {
                adsID : ads.adsID,
                gia : ads.gia,
                giaFmt: util.getPriceDisplay(ads.gia, ads.loaiTin),
                dienTich: ads.dienTich, dienTichFmt: util.getDienTichDisplay(ads.dienTich),
                soPhongNgu: ads.soPhongNgu,
                soPhongNguFmt: ads.soPhongNgu ? ads.soPhongNgu + "pn" : null,
                soTang: ads.soTang,
                soTangFmt: ads.soTang ? ads.soTang + "t" : null,
                image : {
                    cover: ads.image.cover ? ads.image.cover.replace("80x60", targetSize).replace("120x90", targetSize):null,
                    images : ads.image.images ? ads.image.images.map((e) => {
                                return e.replace("80x60", targetSize);
                            }) : null
                },
                diaChi : ads.place.diaChi,
                ngayDangTin : ads.ngayDangTin,
                giaM2 : ads.giaM2,
                loaiNhaDat: ads.loaiNhaDat,
                loaiTin: ads.loaiTin
            };

            transformed = ads;

            Object.assign(transformed, tmp);


            let place = ads.place;
            //console.log(center.lat, center.lon, place.geo.lat, place.geo.lon);

            if (isSearchByDistance) {
                if (center.lat && center.lon && place.geo.lat && place.geo.lon) {
                    transformed.distance = geoUtil.measure(center.lat, center.lon, place.geo.lat, place.geo.lon);
                    if (transformed.distance < radiusInKm * 1000) {
                        transformeds.push(transformed);
                    }
                }
            } else {
                transformeds.push(transformed)
            }
        });

        //sort
        if (queryCondition && orderBy) {
            console.log("Perform ordering by " + orderBy);
            orderAds(transformeds, orderBy);
        } else if (isSearchByDistance) {
            var compare = function(a, b) {
                if (a.distance) {
                    if (b.distance) {
                        return a.distance > b.distance
                    } else {
                        return -1
                    }
                } else {
                    return 1
                }
            };

            transformeds.sort(compare);
        }

        transformeds.forEach((e) => {
            console.log("Distance for " + e.adsID +  "= " + e.distance + "m");
        });

        logUtil.info("There are " + transformeds.length + " ads");


        //limit
        if (queryCondition && limit) {
            transformeds = transformeds.slice(0, limit)
        }

        reply({
            length: transformeds.length,
            viewport : {
                center: center,
                northeast : {lat:geoBox[2], lon:geoBox[3]},
                southwest : {lat:geoBox[0], lon:geoBox[1]}
            },
            list: transformeds
        });
    });
}

function _searchByPlace(queryCondition, query, reply, isSearchByDistance, orderBy, limit, place, radiusInKm) {
    //console.log(place.geometry);
    let center = {lat: 0, lon: 0};

    if (place.currentLocation) {
        center.lat = place.currentLocation.lat;
        center.lon = place.currentLocation.lon;
    } else { //from google placedetail
        center.lat = place.geometry.location.lat;
        center.lon = place.geometry.location.lng;
    }

    let geoBox = null;

    if (place.currentLocation || placeUtil.isOnePoint(place)) { //DIA_DIEM, so by geoBox also
        logUtil.warn("findAds - Search by DIA_DIEM");
        isSearchByDistance = true;
        geoBox = geoUtil.getBoxForSpatialView({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));

        console.log("Search in box: " + geoBox);
        //search by geoBox, so no need place
        delete queryCondition[Q_FIELD.place];

        query = couchbase.SpatialQuery.from("ads_spatial", "points").bbox(geoBox);
    } else {
        logUtil.warn("findAds - Search by DIA CHINH : Tinh, Huyen, Xa");

        if (place.geometry && place.geometry.viewport) {
            let vp = place.geometry.viewport;
            geoBox = [vp.southwest.lat, vp.southwest.lng, vp.northeast.lat, vp.northeast.lng];
        }

        query = ViewQuery.from('ads', 'all_ads');
    }

    _performQuery(queryCondition, query, reply, isSearchByDistance, orderBy, limit, center, radiusInKm, geoBox);
}


function findAds(queryCondition, reply) {
	//return all first
	let query;

    let isSearchByDistance = false;
    let limit = util.popField(queryCondition,Q_FIELD.limit);
    let orderBy = util.popField(queryCondition,Q_FIELD.orderBy);

	if (queryCondition[Q_FIELD.geoBox]) {
        let geoBox = util.popField(queryCondition, Q_FIELD.geoBox);
        logUtil.warn("findAds - Search by BOX: " + geoBox);
		query = couchbase.SpatialQuery.from("ads_spatial", "points").bbox(geoBox);

        //search by geoBox, so no need place
		delete queryCondition[Q_FIELD.place];

        _performQuery(queryCondition, query, reply, isSearchByDistance, orderBy, limit, null, null, geoBox);

	} else if (queryCondition[Q_FIELD.place]) {
        var place = queryCondition[Q_FIELD.place];
        let radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;

        if (place.placeId) {
            services.getPlaceDetail(place.placeId, (placeDetail) => {
                if (!placeDetail) { //sometime autocomplete and detail not sync
                    reply({
                        error: constant.MSG.DIA_DIEM_NOTFOUND,
                        status : constant.STS.FAILURE
                    })
                } else {
                    placeDetail.fullName = placeDetail.name;
                    _searchByPlace(queryCondition, query, reply, isSearchByDistance, orderBy, limit, placeDetail, radiusInKm);
                }


            }, (error) => {
                reply(Boom.internal("Call google detail fail", null, null));
            });
            
        } else if (place.currentLocation) {
            _searchByPlace(queryCondition, query, reply, isSearchByDistance, orderBy, limit, place, radiusInKm);

        } else { //backward...
            _searchByPlace(queryCondition, query, reply, isSearchByDistance, orderBy, limit, place, radiusInKm);
        }


	} else {
		query = ViewQuery.from('ads', 'all_ads');

		//let msg = "GeoBox or place is mandatory!";
		//logUtil.error(msg);
		//reply(Boom.badRequest(msg, queryCondition));
	}
}

//
function matchDiaChi(adsPlace, place) {
    if (!place.diaChi || !adsPlace.diaChi) {
        logUtil.info("Fail, one of the diaChi is null!");
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

		var ret = ads[field] >= value[0] && ads[field] <= value[1];

		if (!ret) {
			console.log("FAIL to check BETWEEN " +  "field=" + field  + ", ads[field]=" + ads[field] + ", value[0]=" + value[0] + ", value[1]=" + value[1])
		}
		
		return ret; 
	}
	//GREATER
	idx = attr.indexOf(QueryOps.GREATER);
	if (idx>0) {
		//if 0 then no need to check
        value = Number(value);

		if (value===0) {
			return true;
		}

        var field = attr.substring(0, idx);

        //
		if (!ads[field]) {
			return false;
		}

		let ret = ads[field] >= value;

		if (!ret) {
			console.log("FAIL to check GREATER " +  "field=" + field  + ", ads[field]=" + ads[field])
		}

		return ret;
	}
	// Place, compare by value.fullName
	if (attr == Q_FIELD.place) {
		//logUtil.info("PLACE OBJECT in QUERY:");

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
    if (attr == Q_FIELD.ngayDaDang) {
        var ngayDangTinDate= moment(ads.ngayDangTin, "DD-MM-YYYY");
        ads.soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');

        return ads.soNgayDaDangTin <= value;
    }

	//default is equals
	if (ads[attr] == value) {
        return true;
    } else {
        logUtil.info("Not match '" + attr +  ", db docID:" + ads.adsID + "': db value:"+ ads[attr] + ", searching value:" + value + ";");
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
            if (a[field]!==0 && !a[field]) {
                return 1;
            }

            if (b[field]!==0 && !b[field]) {
                return -1;
            }

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
 *  soPhongNguGREATER:
 *  soPhongTamGREATER:
 *  huongNha:
 *      Number, 1.... (tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js)
 *  geoBox:
 *	    Arrays: [southwest_lat, southwest_lon, northeast_lat, northeast_lon]
 *		eg: [105.84372998042551,20.986007099732642,105.87777141957429,21.032107100267314]
 *  place { //Object
 *      placeId:
 *          Lay tu google place
 *      relandTypeName : de thong nhat giua client-server
 *          String: Tinh/Huyen/Xa/DiaDiem
 *      radiusInKm : // 2km
 *          Number, eg: 0.5
 *      currentLocation: current location
 *          Array: [lat, lon]
 *  }
 *  orderBy:
 *      string: ngayDangTinDESC/giaASC/giaDESC/dienTichASC, soPhongTamASC, soPhongNguASC
 * }
 *
 *  Response : xem chi tiet trong file sample_find.js
 *  {
 *       length: Number, so bai dang thoa man
         list: Danh sach cac bai dang thoa man
             Arrays {
                adsID,
                gia, giaFmt,
                dienTich, dienTichFmt,
                soPhongNgu, soPhongNguFmt,
                soTang, soTangFmt,
                image : {
                    cover, images:[]
                },
                diaChi,
                ngayDangTin,
                giaM2,
                loaiTin,
                loaiNhaDat
             }
         viewport : {
            center: {lat, lon}
            northeast : {lat, lon}
            southwest : {lat, lon}
         }
            -- Neu theo DiaDiem hoac CurrentLocation: box bao cua Hinh Tron
            -- Neu theo Tinh/Huyen/Xa: lay viewport tu google place
 *  }
 */

internals.findPOST = function(req, reply) {
	logUtil.info("findPOST - query parameter: " );
    console.log(req.payload);
    //check parameter
    if (_validateFindRequestParameters(req, reply)) {
        try {
            findAds(req.payload, reply)
        } catch (e) {
            logUtil.error(e);
            //console.trace(e);
            console.log(e, e.stack.split("\n"));

            reply(Boom.badImplementation());
        }
    }
};

//Nhannc
internals.findRencentAds = function(req, reply) {
    logUtil.info("findRencentAds - query parameter: " );
    console.log(req.payload);

    try {
        var  queryCondition = req.payload;
        var adsModel = new AdsService(myBucket);
        var orderbyList = queryCondition.orderBy;
        var limit = queryCondition.limit;
        var ngayDangTin = util.popField(queryCondition, Q_FIELD.ngayDangTin);
        var orderByName ="";
        var orderByType ="";

        if (orderbyList){
            var arr = orderbyList.split(",");
            var firstElement = arr[0];
            var len =   firstElement.length;
            var idxASC = firstElement.indexOf("ASC");
            var idxDESC = firstElement.indexOf("DESC");

            if(idxASC >-1){
                orderByName = firstElement.substring(0,len -3);
                orderByType =  "ASC";
            }
            if(idxDESC >-1){
                orderByName = firstElement.substring(0,len -4);
                orderByType =  "DESC";
            }
        }

        var onSuccess = function(res) {
            let listResult = res;
            console.log("-----listResult: " + res.data.list);
            reply({
                length: listResult.length,
                list: listResult
            });
        };

        var onFailure = function(err) {
            reply(Boom.internal("Error when search:"));
        };

        adsModel.queryRecentAds(reply,
            ngayDangTin,
            orderByName,
            orderByType,
            limit);
    } catch (e) {
        logUtil.error(e);
        //console.trace(e);
        console.log(e, e.stack.split("\n"));

        reply(Boom.badImplementation());
    }
};
internals.findBelowPriceAds = function(req, reply) {
    logUtil.info("findBelowPriceAds - query parameter: " );
    console.log(req.payload);

    try {
        var  queryCondition = req.payload;
        var adsModel = new AdsService(myBucket);
        var orderbyList = queryCondition.orderBy;
        var limit = queryCondition.limit;
        var gia = util.popField(queryCondition, Q_FIELD.gia);
        var orderByName ="";
        var orderByType ="";

        if (orderbyList){
            var arr = orderbyList.split(",");
            var firstElement = arr[0];
            var len =   firstElement.length;
            var idxASC = firstElement.indexOf("ASC");
            var idxDESC = firstElement.indexOf("DESC");

            if(idxASC >-1){
                orderByName = firstElement.substring(0,len -3);
                orderByType =  "ASC";
            }
            if(idxDESC >-1){
                orderByName = firstElement.substring(0,len -4);
                orderByType =  "DESC";
            }
        }

        var onSuccess = function(res) {
            let listResult = res;
            console.log("-----listResult: " + res.data.list);
            reply({
                length: listResult.length,
                list: listResult
            });
        };

        var onFailure = function(err) {
            reply(Boom.internal("Error when search:"));
        };

        adsModel.queryBelowPriceAds(reply,
            gia,
            orderByName,
            orderByType,
            limit);
    } catch (e) {
        logUtil.error(e);
        //console.trace(e);
        console.log(e, e.stack.split("\n"));

        reply(Boom.badImplementation());
    }
};

//End Nhannc

function _validateFindRequestParameters(req, reply) {
    var query = req.payload;
    if (!query.hasOwnProperty('loaiTin')) {
        reply(Boom.badRequest());

        return false;
    }

    return true;
}

//-------------------------  DETAIL -----------------------------

/**
 *
 * Request: adsID
 * Response:
 * adsID,
 * image :{
 *  cover, cover_small,images_small,images
 * }
 * gia,
 * giaFmt : eg "20ty",
 * place : {
 *  duAn, diaChi, diaChinh, geo : {lat, lon}
 * }
 * loaiTin : Number,
 * loaiTinFmt : String : "ban"/"Cho Thue"
 * loaiNhaDat : Number, lpaiNhaDatFmt
 * dienTich,
 * dienTichFmt: eg "200m2",
 * soPhongTam, soPhongNgu, soTang,
 * soNgayDaDangTinFmt : eg "Tin da dang 3 ngay",
 * chiTiet,
 * huongNha,
 * ngayDangTin, ngayDangTinFmt : "20/03/2016"
 * luotXem : number
 * moiGioiTuongTu : Array {
     *  userID : "12345",
        cover : "http://www.odilederousiers.fr/charles/dl/profile.png",
        diemDanhGia: 3,
        numberOfAds : 10,
        phone: "0123456789",
        name: "Nguyen Van Thang"
    * }
 */


internals.detail = function(req, reply) {
    var query = req.payload;
    console.log("Find Detail:", query);
    if (!query.hasOwnProperty('adsID')) {
        reply(Boom.badRequest());
    } else {
        let adsID =  query.adsID;
        adsService.getAds(adsID, (err, result) => {
            if (err) {
                console.log(err);
                if (err.code === 13) {
                    reply({
                        status : constant.STS.SUCCESS
                    })
                } else {
                    reply(Boom.badImplementation("Error when getting detail for asdID: " + adsID));
                }

                return;
            }

            var ads = result.value;

            _transformDetailAds(ads);

            reply({
                ads: ads,
                status : constant.STS.SUCCESS
            });
        });
    }
};

//to client format
function _transformDetailAds(ads) {
    ads.loaiTinFmt = danhMuc.LoaiTin[ads.loaiTin];
    if (ads.loaiNhaDat) {
        ads.loaiNhaDatFmt = ads.loaiTin ? danhMuc.LoaiNhaDatThue[ads.loaiNhaDat] : danhMuc.LoaiNhaDatBan[ads.loaiNhaDat];
    }

    ads.giaFmt = util.getPriceDisplay(ads.gia, ads.loaiTin);
    ads.dienTichFmt = util.getDienTichDisplay(ads.dienTich);

    if (ads.ngayDangTin) {
        var NgayDangTinDate= moment(ads.ngayDangTin, "DD-MM-YYYY");
        ads.soNgayDaDangTin = moment().diff(NgayDangTinDate, 'days');
        ads.soNgayDaDangTinFmt =  "Tin đã đăng " + ads.soNgayDaDangTin + " ngày";

        ads.ngayDangTinFmt = ads.ngayDangTin.replace(/-/g, "/");
    }
    // big images:

    ads.image.images_small =ads.image.images;

    if (ads.image.images_small) {
        ads.image.images = ads.image.images.map((one) => {
            return one.replace("80x60", "745x510");
        });
    }

    if (ads.chiTiet) {
        var idx = ads.chiTiet.indexOf("Tìm kiếm theo từ khóa");
        ads.chiTiet =  ads.chiTiet.substring(0, idx);
        //val.chiTietDisplay =  val.chiTiet.substring(0, idx);
    }

    //dummy
    ads.luotXem = 1232;

    //dummy moi gioi
    var mg1 = {
        userID : "12345",
        cover : "http://www.odilederousiers.fr/charles/dl/profile.png",
        diemDanhGia: 3,
        numberOfAds : 10,
        phone: "0123456789",
        name: "Nguyen Van Thang"
    };

    var mg2 = {
        cover : "https://avatars0.githubusercontent.com/u/12259246?v=3&s=96",
        userID : "12346",
        diemDanhGia: 5,
        numberOfAds : 20,
        phone: "0123456781",
        name: "Phan Nhat Vuong"
    };

    ads.moiGioiTuongTu = [mg1, mg2];


}

module.exports = internals;
