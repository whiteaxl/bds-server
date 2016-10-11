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
var cfg = require("../../config");

myBucket.operationTimeout = 120 * 1000;

var UserService = require('../../dbservices/User');
var JWT    = require('jsonwebtoken');


var _ = require("lodash");
var moment = require("moment");

var geoUtil = require("../../lib/geoUtil");

var DEFAULT_SEARCH_RADIUS = 5; //km

var adsService = new AdsService();
var userService = new UserService();
var ClientReportService = require("../../dbservices/ClientReport");
var clientReportService = new ClientReportService();


var RewayMailer = require("../../lib/RewayMailer");


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
        console.log("tim log "+JSON.stringify(query));
        if(query.userID) {
            userService.getUserByID(query.userID, function(err,res){
                if(err || res.length ==0)
                    console.log(err);
                else { 
                    console.log(JSON.stringify(res));
                    var user = res[0];
                    user.lastViewAds = adsID;
                    console.log("user with last view");
                    console.log(JSON.stringify(user));
                    userService.upsert(user);
                }
            });
        }
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

            //increase luotXem
            if(!ads.luotXem)
                ads.luotXem = 0;
            ads.luotXem = ads.luotXem + 1;
            adsService.upsert(ads);
            console.log("luotXem " + ads.luotXem);

            ads = _transformDetailAds(ads);
            logUtil.info("Detail response:", ads);
            reply({
                ads: ads,
                status : constant.STS.SUCCESS
            });
        });
    }
};

function minutesOne2Undefined(val) {
    return val == -1 ? undefined : val;
}

//to client format
/*

 */
function _transformDetailAds(adsFromDb) {
    let ads = {};
    ads.adsID = adsFromDb.adsID;
    ads.dangBoi = {};

    ads.dangBoi.email = adsFromDb.dangBoi.email;
    ads.dangBoi.name = adsFromDb.dangBoi.name;
    ads.dangBoi.phone = adsFromDb.dangBoi.phone;
    ads.dangBoi.userID = adsFromDb.dangBoi.userID;

    ads.gia = minutesOne2Undefined(adsFromDb.gia);
    ads.dienTich = minutesOne2Undefined(adsFromDb.dienTich);

    ads.soPhongNgu = adsFromDb.soPhongNgu;
    ads.soTang = adsFromDb.soTang;
    ads.soPhongTam = adsFromDb.soPhongTam;

    ads.image = {};
    ads.image.cover = adsFromDb.image.cover || cfg.noCoverUrl;
    if(ads.image.cover.indexOf("no-photo")>-1){
        ads.image.cover = cfg.noCoverUrl;
    }

    ads.image.images = adsFromDb.image.images;

    ads.diaChi = adsFromDb.diaChi;
    ads.ngayDangTin = adsFromDb.ngayDangTin;
    ads.giaM2 = minutesOne2Undefined(adsFromDb.giaM2);
    ads.loaiNhaDat = adsFromDb.loaiNhaDat;
    ads.loaiTin = adsFromDb.loaiTin;
    ads.huongNha = minutesOne2Undefined(adsFromDb.huongNha);
    ads.chiTiet = adsFromDb.chiTiet;

    ads.place = {};
    ads.place.duAn = adsFromDb.place.duAn;
    ads.place.diaChi = adsFromDb.place.diaChi;
    ads.place.diaChinh = adsFromDb.place.diaChinh;
    ads.place.geo = adsFromDb.place.geo;
    ads.place.diaChinhFullName = adsFromDb.place.diaChinhFullName;
    ads.place.duAnFullName = adsFromDb.place.duAnFullName;

    ads.type = adsFromDb.type;


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
        ads.chiTiet =  idx >= 0 ? ads.chiTiet.substring(0, idx) : ads.chiTiet;
        //val.chiTietDisplay =  val.chiTiet.substring(0, idx);
    }

    //dummy
    ads.luotXem = adsFromDb.luotXem;

    if (ads.giaM2) {
        ads.giaM2Fmt = util.roundToTwo(ads.giaM2) + " tr/m²"
    }

    ads.maSo = adsFromDb.maSo;

    return ads;
}

internals.saveSearch = function(req, reply){
    var query = req.payload.query;
    var userID = req.payload.userID;    
    var name = req.payload.saveSearchName;
    console.log("payload is" + JSON.stringify(req.payload));
    var data = {
        name: name,
        query: query
    };
    userService.saveSearch(data,userID,function(res){
        reply( JSON.stringify(res));    
    });
    
}
internals.likeAds = function(req, reply){
    //req.payload.userID = "User_6";
    console.log("payload is" + JSON.stringify(req.payload));
    userService.likeAds(req.payload,reply);    
}
internals.unlikeAds = function(req, reply){
    //req.payload.userID = "User_6";
    console.log("payload is" + JSON.stringify(req.payload));
    userService.unlikeAds(req.payload,reply);
}

/**

This function send email / sms to nguoi dang 

{
Request Data:
{
    name: ten nguoi gui
    email: email muon nhan thong tin
    phone: so dien thoai de nhan thong tin
    content: noi dung email
    nguoiDang: nguoi dang tin
}
Response Data:
{
    success: true/false
    sentMail: true/false
    sentSms: true/false
}

}

*/

internals.requestInfo = function(req,reply){
    var data = req.payload;
    var nguoiDang = data.nguoiDang;
    //dummy
    nguoiDang = {
        email: "tim.hung.dao@gmail.com"
    }
    var result = {
        success: false,
        sentMail: false,
        sentSms: false
    }
    console.log(" log data for send mail "+JSON.stringify(data));
    if(nguoiDang.email){        
        RewayMailer.sendMail({
            to: 'hungdq@gipxy.com',
            subject: 'yeu cau them thong tin ve bds',
            // text: 'Hi '+ nguoiDang.emai + '. Có một yêu cầu thông tin bds về ' + data.content+' ' + data.name + ' - ' + data.email + (_.isNull(data.phone)?'':' - ' + data.phone),
            html: 'Hi '+ nguoiDang.email + ',<br> Có một yêu cầu thông tin về bất động sản <a href="' + data.adsUrl + '">' + data.adsUrl + '</a> từ ' + data.name + ' - ' + data.email + (_.isNull(data.phone)?'':' - ' + data.phone) + '<br> <b>"' + data.content + '"</b>'  
        }, function(error, response){
            if (error) {
                console.log(error);
                result.success = false;
                reply(result);
           } else {
                console.log('Message sent');
                result.success = true;
                result.sentMail = true;
                result.msg = "Mail đã gửi thành công"
                reply(result);
           }
        });

    }else if(nguoiDang.phone){
        //TODO
    }

}

internals.reportReland = function(req, reply){
    var result = {
        success: false        
    }
    clientReportService.upsert(req.payload, function(err,res){
        if (err) {
            console.log("ERROR:" + err);
            result.success = false;
            result.errMsg = "Đã có lỗi xảy ra. Reland mong bạn thông cảm, chúng tôi sẽ khắc phục sớm";
        }else{
            result.success = true;
            reply(result);
        }
    })
    console.log(" log data for report "+JSON.stringify(req.payload));
}




module.exports = internals;
