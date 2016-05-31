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
myBucket.operationTimeout = 120 * 1000;

var UserService = require('../../dbservices/User');
var JWT    = require('jsonwebtoken');


var _ = require("lodash");
var moment = require("moment");

var geoUtil = require("../../lib/geoUtil");

var DEFAULT_SEARCH_RADIUS = 5; //km

var adsService = new AdsService();
var userService = new UserService();

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
 * loaiNhaDat : Number, loaiNhaDatFmt
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
                console.log("Erorr when getting detail data:", err);
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
        var ngayDangTinDate= moment(ads.ngayDangTin, constant.FORMAT.DATE_IN_DB);
        ads.soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');
        ads.soNgayDaDangTinFmt =  "Tin đã đăng " + ads.soNgayDaDangTin + " ngày";

        ads.ngayDangTinFmt = moment(ngayDangTinDate).format(constant.FORMAT.DATE_IN_GUI);
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

internals.saveSearch = function(req, reply){
    reply("authorized to use this feature");
}



module.exports = internals;
