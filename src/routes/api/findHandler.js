'use strict';

var Boom = require('boom');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");

var AdsModel = require('../../dbservices/Ads');
var adsModel = new AdsModel();

var placeUtil = require("../../lib/placeUtil");

var http = require('http');
var https = require('https');
var services = require("../../lib/services");
var constant = require("../../lib/constant");
var moment = require("moment");
var geoUtil = require("../../lib/geoUtil");

var UserService = require('../../dbservices/User');
var userService = new UserService();

var DuAnService = require('../../dbservices/DuAn');
var duAnService = new DuAnService();
var DuAnNoiBatService = require('../../dbservices/DuAnNoiBat');
var duAnNoiBatService = new DuAnNoiBatService();

var cfg = require('../../config');


var DEFAULT_SEARCH_RADIUS = 5; //km

var _ = require("lodash");


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
    soPhongTam : "soPhongTam"
};

var internals = {};
/**
 *  Co' 3 loai search:
 *      Tim kiem theo GeoBox, polygon : phuc vu MAP
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
 *		eg: [20.986007099732642,105.84372998042551,21.032107100267314,105.87777141957429]
 *
 *  polygon : [{lat, lon}, {}]
 	*
 *  place { //Object
 *      placeId:
 *          Lay tu google place
 *      relandTypeName : de thong nhat giua client-server, mandatory for PLACE
 *          String: Tinh/Huyen/Xa/DiaDiem
 *      radiusInKm : // 2km
 *          Number, eg: 0.5
 *      currentLocation: current location
 *          Array: [lat, lon]
 *  }
 *  diaChinh{ tinh huyen xa khong dau se bi bo qua neu co place
 *       tinh
 *       huyen
 *       xa
 *  }
 *  orderBy:
 *      string: ngayDangTinDESC/giaASC/giaDESC/dienTichASC, soPhongTamASC, soPhongNguASC
 * }
 *
 *  Response : xem chi tiet trong file sample_find.js
 *  {
 *       length: Number, so bai dang thoa man
         list: []
            Danh sach cac bai dang thoa man
         viewport : {
            center: {lat, lon}
            northeast : {lat, lon}
            southwest : {lat, lon}
         }
            -- Neu theo DiaDiem hoac CurrentLocation: box bao cua Hinh Tron
            -- Neu theo Tinh/Huyen/Xa: lay viewport tu google place
 *  }
 */

function _validateFindRequestParameters(req, reply) {
    var query = req.payload;
    console.log(JSON.stringify(req.payload));
    if (!query.hasOwnProperty('loaiTin')) {
        reply(Boom.badRequest());

        return false;
    }

    return true;
}

//
function _handleDBFindResult(error, allAds, replyViewPort, center, radiusInKm, reply, polygonCoords, diaChinh) {
    let transformeds = [];

    allAds.forEach((e) => {
        let transformed ={};
        let ads = e;
        //images:
        var targetSize = "745x510"; //350x280

        let tmp = {
            adsID : ads.adsID,
            gia : ads.gia,
            giaFmt: util.getPriceDisplay(ads.gia, ads.loaiTin),
            giaFmtForWeb: util.getPriceDisplay(ads.gia, ads.loaiTin,true),
            dienTich: ads.dienTich, dienTichFmt: util.getDienTichDisplay(ads.dienTich),
            soPhongNgu: ads.soPhongNgu,
            soPhongNguFmt: ads.soPhongNgu ? ads.soPhongNgu + "pn" : null,
            soTang: ads.soTang,
            soTangFmt: ads.soTang ? ads.soTang + "t" : null,
            soPhongTam: ads.soPhongTam,
            soPhongTamFmt: ads.soPhongTam ? ads.soPhongTam + "pt" : null,
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
            loaiTin: ads.loaiTin,
            huongNha: ads.huongNha
        };
        //console.log(tmp.cover);

        //dummy for cover image
        if(tmp.image.cover && tmp.image.cover.indexOf("no-photo")>-1){
            tmp.image.cover = cfg.noCoverUrl;
            //console.log("1"+tmp.image.cover);
        }

        if (tmp.chiTiet) {
            var idx = val.chiTiet.indexOf("Tìm kiếm theo từ khóa");
            tmp.chiTiet =  tmp.chiTiet.substring(0, idx);
        }

        if (tmp.ngayDangTin) {
            var ngayDangTinDate= moment(tmp.ngayDangTin, constant.FORMAT.DATE_IN_DB);
            tmp.soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');
        }

        transformed = ads;

        Object.assign(transformed, tmp);

        let place = transformed.place;
        //console.log(center.lat, center.lon, place.geo.lat, place.geo.lon);

        //filter by radius
        if (radiusInKm) {
            if (center.lat && center.lon && place.geo.lat && place.geo.lon) {
                transformed.distance = geoUtil.measure(center.lat, center.lon, place.geo.lat, place.geo.lon);
                if (transformed.distance < radiusInKm * 1000) {
                    transformeds.push(transformed);
                }
            }
        } else if (polygonCoords && polygonCoords.length > 0) {//filter by polygon
          if (geoUtil.isPointInside(place.geo,polygonCoords)) {
            transformeds.push(transformed)
          }
        }
        else {
            transformeds.push(transformed)
        }

        return transformed;
    });

    logUtil.info("There are " + transformeds.length + " ads");
    var response = {
        length: transformeds.length,
        viewport : {
            center: center,
            northeast : {lat:replyViewPort[2], lon:replyViewPort[3]},
            southwest : {lat:replyViewPort[0], lon:replyViewPort[1]}
        },
        list: transformeds
    };

    //get formatted_address of center
    center.formatted_address = diaChinh && diaChinh.shortName;

    //if we manage tinh/huyen/xa data, so no need this ?
    if (!center.formatted_address) {
        services.getGeocoding(center.lat, center.lon,
          (res) => {
              if (res && res.formatted_address) {
                  const adr = res.formatted_address;
                  center.formatted_address = adr;
                  const spl = adr.split(",");
                try {
                  center.name = spl[spl.length-3].trim() + ", " + spl[spl.length-2].trim()
                } catch(e) {
                  console.log("Error when get geoCode", e);
                  center.name = center.lat + ',' + center.lon;
                }
              }
              else {
                  center.formatted_address = center.lat + ',' + center.lon;
              }
              reply(response);
          },
          (err) => {
              center.formatted_address = center.lat + ',' + center.lon;
              reply(response);
          }
        );
    } else {
        reply(response);
    }
}

function _toNgayDangTinFrom(ngayDaDang) {
    if (ngayDaDang == null || ngayDaDang == undefined) {
        return null;
    }
    let ret = moment().subtract(ngayDaDang, "d");
    ret = ret.format(constant.FORMAT.DATE_IN_DB);
    return ret;
}

//giaDESC, dienTichASC, ngayDangTinASC, giaM2DESC, soPhongNguDESC, soPhongTamDESC
function _toOrderBy(orderByPam) {
    let orderByField;
    let orderByType;
    let ret = null;

    if (orderByPam){
        var arr = orderByPam.split(",");
        var firstElement = arr[0];
        var len =   firstElement.length;

        if(firstElement.endsWith("DESC")){
            orderByField = firstElement.substring(0,len - 4);
            orderByType =  "DESC";
        } else {
            if (firstElement.endsWith("ASC"))
                orderByField = firstElement.substring(0,len - 3);
            else
                orderByField = firstElement;

            orderByType =  "ASC";
        }

        ret = {orderByField, orderByType}
    }

    return ret;
}

function _isDiaDiem(relandTypeName) {
    var tmp = util.locDau(relandTypeName);
    if (tmp) {
        tmp = tmp.toLowerCase();
    }

    if (tmp=="diadiem"
        || tmp=="dia diem"
        || tmp=="dia-diem"
        || tmp=="duong"
    ) {
        return true;
    }

    return false;
}

function countAds(q, reply){
    var geoBox = q.geoBox;
    let limit = q.limit;
    let diaChinh = q.diaChinh;

    //need keep DiaChinh condition
    if (!diaChinh && q.place && q.place.placeId && q.place.tinh) {//must have Tinh = tinhKhongDau
        diaChinh = q.place;
    }
    placeUtil.chuanHoaDiaChinh(diaChinh);

    console.log("into here111");
    let ngayDangTinFrom = _toNgayDangTinFrom(q.ngayDaDang);
    var count = 0;
    var callback = (err, data) =>  {
        console.log("before reply count = " + data);
        reply({
            countResult: data
        });
    };
    var duAnID = q.duAnID;
    console.log("into here");

    if(geoBox || diaChinh){
        count = adsModel.countForAllData(
            callback, geoBox,diaChinh, q.loaiTin, q.loaiNhaDat
            , q.giaBETWEEN, q.dienTichBETWEEN
            , q.soPhongNguGREATER, q.soPhongTamGREATER
            , ngayDangTinFrom, q.huongNha, duAnID
        );
    } else if (q[Q_FIELD.place]) {
        var center = {lat: 0, lon: 0};
        var radiusInKm = null;
        var place = q[Q_FIELD.place];
        if(place.placeId){
            var relandTypeName = q.place.relandTypeName;
            services.getPlaceDetail(place.placeId, (placeDetail) => {
                if (!placeDetail) { //sometime autocomplete and detail not sync
                    reply({
                        error: constant.MSG.DIA_DIEM_NOTFOUND,
                        status : constant.STS.FAILURE
                    })
                } else {
                    //from google placedetail
                    
                    center.lat = placeDetail.geometry.location.lat;
                    center.lon = placeDetail.geometry.location.lng;
                    placeDetail.fullName = placeDetail.name;
                    let diaChinh = null;

                    if (_isDiaDiem(relandTypeName)) {
                        radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;
                        diaChinh = null;
                        geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
                    } else {
                        diaChinh  = placeUtil.getDiaChinhFromGooglePlace(placeDetail);
                        geoBox = null;
                    }

                    adsModel.countForAllData(
                        callback, geoBox,diaChinh, q.loaiTin, q.loaiNhaDat
                        , q.giaBETWEEN, q.dienTichBETWEEN
                        , q.soPhongNguGREATER, q.soPhongTamGREATER
                        , ngayDangTinFrom, q.huongNha,duAnID
                    )
                }
            }, (error) => {
                logUtil.error(error);
                reply(Boom.internal("Call google detail fail", null, null));
            });

        }else if (place.currentLocation) {
            center.lat = place.currentLocation.lat;
            center.lon = place.currentLocation.lon;

            radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;

            geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
            diaChinh = null;

            adsModel.countForAllData(
                callback,geoBox,diaChinh, q.loaiTin, q.loaiNhaDat
                , q.giaBETWEEN, q.dienTichBETWEEN
                , q.soPhongNguGREATER, q.soPhongTamGREATER
                , ngayDangTinFrom, q.huongNha
            )
        }

    } 
    
}

internals.searchAds = function(q, reply) {
    let limit = q.limit;

    let diaChinh = q.diaChinh;
    if (q.place && q.place.placeId && q.place.tinh) {//must have Tinh = tinhKhongDau
        diaChinh = q.place;
    }
    placeUtil.chuanHoaDiaChinh(diaChinh);

    let ngayDangTinFrom = _toNgayDangTinFrom(q.ngayDaDang);
    let orderBy = _toOrderBy(q.orderBy);
    let duAnID = q.duAnID;
    let relandTypeName ;

    var geoBox = q.geoBox;
    var center = {lat: 0, lon: 0};
    var radiusInKm = null;

    var replyViewPort = geoBox;
    var pageNo = q.pageNo;

    let polygon = q.polygon;
    let polygonCoords = null;
    if (polygon && polygon.length > 2) {
      polygonCoords = polygon.map((e) => {
        return {latitude: e.lat, longitude: e.lon}
      });
    }

    if(q.userID) {
        //console.log(JSON.stringify(q));
        userService.getUserByID(q.userID, function(err,res){
            if(err || res.length ==0)
                console.log(err);
            else { 
                console.log(JSON.stringify(res));
                var user = res[0];
                user.lastSearch = q;
                userService.upsert(user);
            }
        });
    }

    var callback = (err, all) =>  {
        _handleDBFindResult(err, all, replyViewPort, center, radiusInKm, reply, polygonCoords,diaChinh);
    };

    //polygon
    if (polygon && polygon.length > 2) {
      let ret = geoUtil.getGeoBoxOfPolygon(polygonCoords);
      replyViewPort = ret.geoBox;
      center = ret.center;

      adsModel.queryAllData(
        callback,replyViewPort,diaChinh, q.loaiTin, q.loaiNhaDat
        , q.giaBETWEEN, q.dienTichBETWEEN
        , q.soPhongNguGREATER, q.soPhongTamGREATER
        , ngayDangTinFrom, q.huongNha, duAnID
        , orderBy, limit,pageNo
      );
    }
    else if(geoBox || diaChinh) {
        if(geoBox){
            center.lat = (geoBox[0]+geoBox[2])/2;
            center.lon = (geoBox[1]+geoBox[3])/2;    
        }
        replyViewPort = [];
        adsModel.queryAllData(
            callback,geoBox,diaChinh, q.loaiTin, q.loaiNhaDat
            , q.giaBETWEEN, q.dienTichBETWEEN
            , q.soPhongNguGREATER, q.soPhongTamGREATER
            , ngayDangTinFrom, q.huongNha,duAnID
            , orderBy, limit,pageNo
        )

    } else if (q[Q_FIELD.place]) {
        var place = q[Q_FIELD.place];
        relandTypeName = q.place.relandTypeName;

        if (place.placeId) {
            services.getPlaceDetail(place.placeId, (placeDetail) => {
                if (!placeDetail) { //sometime autocomplete and detail not sync
                    reply({
                        error: constant.MSG.DIA_DIEM_NOTFOUND,
                        status : constant.STS.FAILURE
                    })
                } else {
                    //from google placedetail
                    center.lat = placeDetail.geometry.location.lat;
                    center.lon = placeDetail.geometry.location.lng;
                    center.formatted_address = placeDetail.formatted_address;

                    placeDetail.fullName = placeDetail.name;

                    if (_isDiaDiem(relandTypeName)) {
                        radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;
                        diaChinh = null;
                        geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
                        replyViewPort = geoBox;
                    } else {
                        diaChinh  = placeUtil.getDiaChinhFromGooglePlace(placeDetail);
                        geoBox = null;
                        radiusInKm = null;
                        let vp = placeDetail.geometry.viewport;
                        replyViewPort = [vp.southwest.lat, vp.southwest.lng, vp.northeast.lat, vp.northeast.lng];
                    }

                    adsModel.queryAllData(
                        callback,geoBox,diaChinh, q.loaiTin, q.loaiNhaDat
                        , q.giaBETWEEN, q.dienTichBETWEEN
                        , q.soPhongNguGREATER, q.soPhongTamGREATER
                        , ngayDangTinFrom, q.huongNha,duAnID
                        , orderBy, limit,pageNo
                    )
                }
            }, (error) => {
                logUtil.error(error);
                reply(Boom.internal("Call google detail fail", null, null));
            });

        } else if (place.currentLocation) {
            center.lat = place.currentLocation.lat;
            center.lon = place.currentLocation.lon;

            radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;

            geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
            diaChinh = null;
            replyViewPort = geoBox;

            adsModel.queryAllData(
                callback,geoBox,diaChinh, q.loaiTin, q.loaiNhaDat
                , q.giaBETWEEN, q.dienTichBETWEEN
                , q.soPhongNguGREATER, q.soPhongTamGREATER
                , ngayDangTinFrom, q.huongNha, duAnID
                , orderBy, limit, pageNo
            )
        }
    }
}

internals.search = function(req, reply) {
    console.log(req.payload);
    if (_validateFindRequestParameters(req, reply)) {
        try {
          internals.searchAds(req.payload, reply)
        } catch (e) {
            logUtil.error(e);
            console.log(e, e.stack.split("\n"));

            reply(Boom.badImplementation());
        }
    }
};

internals.searchAdsNew = function(req,reply){
    console.log(req.payload);
    if (_validateFindRequestParameters(req, reply)) {
        console.log(req.payload);

        try {
          internals.searchAdsWithFilter(req.payload, reply)
        } catch (e) {
            logUtil.error(e);
            console.log(e, e.stack.split("\n"));

            reply(Boom.badImplementation());
        }
    }
};

internals.count = function(req,reply){
    if (_validateFindRequestParameters(req, reply)) {
        try {
            countAds(req.payload, reply)
        } catch (e) {
            logUtil.error(e);
            console.log(e, e.stack.split("\n"));

            reply(Boom.badImplementation());
        }
    }
};

internals.countAdsNew = function(req,reply){
    if (_validateFindRequestParameters(req, reply)) {
        try {
            countAdsWithFilter(req.payload, reply)
        } catch (e) {
            logUtil.error(e);
            console.log(e, e.stack.split("\n"));

            reply(Boom.badImplementation());
        }
    }
};


internals.findBdsCungLoaiMoidang = function(req,reply){
    var userID = req.payload.userID;
    var result = {
        msg: "",
        list: []
    }
    reply(result);
}
internals.findBdsLoaiKhacNgangGia = function(req,reply){
    var userID = req.payload.userID;
    var result = {
        msg: "",
        list: []
    }
    reply(result);
}

internals.findBdsGiaThapHon = function(req,reply){
    var userID = req.payload.userID;
    var result = {
        msg: "",
        list: []
    }
    reply(result);
}

internals.findAdsAndDuanForHomePage = function(q, reply){
    var limit = q.limit;
    var userID = q.userID;
    var async = require("async");
    var result = {
        msg: "",
        list: []
    }
    if(userID){
        userService.getUserByID(userID, function(err,res){
            if(err || res.length ==0)
                console.log(err);
            else { 
                console.log(JSON.stringify(res));
                var user = res[0];
                if(user.lastSearch){
                    async.series([
                        function(callback){
                            var searchDataCungLoai = {
                                "loaiTin": user.lastSearch.loaiTin,
                                "loaiNhaDat": user.lastSearch.loaiNhaDat, 
                                "limit": 10,
                                "orderBy": "ngayDangTinDESC",
                                "pageNo": 1
                            };

                            duAnService.findDuAn(q,function(err,res){
                                if(err || res.length<=0){
                                     callback(null,res); 
                                }else{
                                    callback(null,{
                                        name: "Dự án nổi bật tại Hà nội",
                                        location: "Hà Nội",
                                        type: "DU_AN",
                                        list: res
                                    }); 
                                }
                            });               
                        },
                        function(callback){
                            q.tinhKhongDau = 'ho-chi-minh';
                            duAnService.findDuAn(q,function(err,res){
                                if(err || res.length<=0){
                                     callback(null,null); 
                                }else{
                                    callback(null,{
                                        name: "Dự án nổi bật tại Hồ Chí Minh",
                                        location: "Hồ Chí Minh",
                                        type: "DU_AN",
                                        list: res
                                    }); 
                                }
                            });      
                        }
                    ],
                    // optional callback
                    function(err, results){
                        // results is now equal to ['one', 'two']
                        /*_(results).forEach(function(value) {
                            console.log(value);
                        });*/
                        result.list = results;
                        reply(result);
                    });

                }else{

                }
            }
        });

    }else{
        var data = {
            limit: q.limit,
            hot: true,
        };
        q.tinhKhongDau = 'ha-noi';
        async.series([
            function(callback){
                q.tinhKhongDau = 'ha-noi';
                duAnService.findDuAn(q,function(err,res){
                    if(err || res.length<=0){
                         callback(null,res); 
                    }else{
                        callback(null,{
                            name: "Dự án nổi bật tại Hà nội",
                            location: "Hà Nội",
                            type: "DU_AN",
                            list: res
                        }); 
                    }
                });               
            },
            function(callback){
                q.tinhKhongDau = 'ho-chi-minh';
                duAnService.findDuAn(q,function(err,res){
                    if(err || res.length<=0){
                         callback(null,null); 
                    }else{
                        callback(null,{
                            name: "Dự án nổi bật tại Hồ Chí Minh",
                            location: "Hồ Chí Minh",
                            type: "DU_AN",
                            list: res
                        }); 
                    }
                });      
            }
        ],
        // optional callback
        function(err, results){
            // results is now equal to ['one', 'two']
            /*_(results).forEach(function(value) {
                console.log(value);
            });*/
            result.list = results;
            reply(result);
        });

        /*duAnService.findDuAn(q,function(err,res){
            if(err || res.length<=0){
                   
            }else{
                var hn = {
                    name: "Dự án nổi bật tại Hà nội",
                    list: res
                }
                result.list.push(hn);
                var hcm = {
                    name: "Dự án nổi bật tại Hồ Chí Minh",
                    list: res
                }
                 result.list.push(hcm);
            }
            reply(result);
            
        });*/
    }
}

internals.findDuAnHotByDiaChinhForSearchPage = function(req,reply){
    var result = {
        msg: "",
        success: false,
        duAnNoiBat: undefined
    };
    
    var q = req.payload.diaChinh || {};
    
    q.limit = 1;
    q.level = 1;
    duAnNoiBatService.findDuAnNoiBat(q,function(err,res){
        if(err || res.length<=0){
            result.msg = err;
            reply(result);
        }else{
            result.success = true;
            result.duAnNoiBat = res[0];
            reply(result); 
        }
    });
    
}

internals.findDuAnHotByDiaChinhForDetailPage = function(req,reply){
    var result = {
        msg: "",
        success: false,
        listDuAnNoiBat: undefined
    };
    
    var q = req.payload.diaChinh || {};
    q.limit = 2;
    q.level = 2;
    duAnNoiBatService.findDuAnNoiBat(q,function(err,res){
        if(err || res.length<=0){
            result.msg = err;
            reply(result);
        }else{
            result.success = true;
            result.listDuAnNoiBat = res;
            reply(result); 
        }
    });
}

internals.searchAdsWithFilter = function(q,reply){
    let limit = q.limit;

    let diaChinh = q.diaChinh;
    placeUtil.chuanHoaDiaChinh(diaChinh);

    let ngayDangTinFrom = _toNgayDangTinFrom(q.ngayDaDang);
    let orderBy = _toOrderBy(q.orderBy);
    let duAnID = q.duAnID;
    let relandTypeName ;

    var geoBox = q.geoBox;
    var center = {lat: 0, lon: 0};
    var radiusInKm = null;

    var replyViewPort = geoBox;
    var pageNo = q.pageNo;

    let polygon = q.polygon;
    let polygonCoords = null;
    if (polygon && polygon.length > 2) {
      polygonCoords = polygon.map((e) => {
        return {latitude: e.lat, longitude: e.lon}
      });
    }

    if(q.userID) {
        //console.log(JSON.stringify(q));
        userService.getUserByID(q.userID, function(err,res){
            if(err || res.length ==0)
                console.log(err);
            else { 
                console.log(JSON.stringify(res));
                var user = res[0];
                user.lastSearch = q;
                userService.upsert(user);
            }
        });
    }

    var callback = (err, all) =>  {
        _handleDBFindResult(err, all, replyViewPort, center, radiusInKm, reply, polygonCoords, diaChinh);
    };

    var filter = _.assign(q);
    filter.orderBy = orderBy;
    filter.ngayDangTinFrom = ngayDangTinFrom;
    filter.duAnID = duAnID;
    filter.limit = limit;
    filter.pageNo = pageNo;

    //polygon
    if (polygon && polygon.length > 2) {
      let ret = geoUtil.getGeoBoxOfPolygon(polygonCoords);
      replyViewPort = ret.geoBox;
      center = ret.center;
      filter.geoBox = req.geoBox;
      adsModel.queryWithFilter(callback,filter);
    }else if(geoBox || diaChinh) {
        if(geoBox){
            center.lat = (geoBox[0]+geoBox[2])/2;
            center.lon = (geoBox[1]+geoBox[3])/2;    
        }
        replyViewPort = [];
        adsModel.queryWithFilter(callback, filter);
    }else if (q[Q_FIELD.place]) {
        var place = q[Q_FIELD.place];
        relandTypeName = q.place.relandTypeName;
        if (place.placeId) {
            services.getPlaceDetail(place.placeId, (placeDetail) => {
                if (!placeDetail) { //sometime autocomplete and detail not sync
                    reply({
                        error: constant.MSG.DIA_DIEM_NOTFOUND,
                        status : constant.STS.FAILURE
                    })
                } else {
                    //from google placedetail
                    center.lat = placeDetail.geometry.location.lat;
                    center.lon = placeDetail.geometry.location.lng;
                    center.formatted_address = placeDetail.formatted_address;

                    placeDetail.fullName = placeDetail.name;

                    if (_isDiaDiem(relandTypeName)) {
                        radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;
                        diaChinh = null;
                        filter.geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
                        replyViewPort = filter.geoBox;
                    } else {
                        diaChinh  = placeUtil.getDiaChinhFromGooglePlace(placeDetail);
                        filter.geoBox = null;
                        radiusInKm = null;
                        let vp = placeDetail.geometry.viewport;
                        replyViewPort = [vp.southwest.lat, vp.southwest.lng, vp.northeast.lat, vp.northeast.lng];
                    }

                    adsModel.queryWithFilter(callback,filter);
                }
            }, (error) => {
                logUtil.error(error);
                reply(Boom.internal("Call google detail fail", null, null));
            });

        }else if (place.currentLocation) {
            center.lat = place.currentLocation.lat;
            center.lon = place.currentLocation.lon;

            radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;

            filter.geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
            filter.diaChinh = null;
            replyViewPort = filter.geoBox;

            adsModel.queryWithFilter(callback,filter);
        }
    }


}

function countAdsWithFilter(q, reply){
    var geoBox = q.geoBox;
    let limit = q.limit;
    let diaChinh = q.diaChinh;
    console.log("into here111");
    let ngayDangTinFrom = _toNgayDangTinFrom(q.ngayDaDang);
    var count = 0;
    var callback = (err, data) =>  {
        console.log("before reply count = " + data);
        reply({
            countResult: data
        });
    };
    var duAnID = q.duAnID;
    console.log("into here");

    var filter = _.assign(q);
    filter.ngayDangTinFrom = ngayDangTinFrom;
    filter.limit = limit;


    if(geoBox || diaChinh){
        count = adsModel.countWithFilter(callback,filter);
    } else if (q[Q_FIELD.place]) {
        var center = {lat: 0, lon: 0};
        var radiusInKm = null;
        var place = q[Q_FIELD.place];
        if(place.placeId){
            var relandTypeName = q.place.relandTypeName;
            services.getPlaceDetail(place.placeId, (placeDetail) => {
                if (!placeDetail) { //sometime autocomplete and detail not sync
                    reply({
                        error: constant.MSG.DIA_DIEM_NOTFOUND,
                        status : constant.STS.FAILURE
                    })
                } else {
                    //from google placedetail
                    
                    center.lat = placeDetail.geometry.location.lat;
                    center.lon = placeDetail.geometry.location.lng;
                    placeDetail.fullName = placeDetail.name;
                    let diaChinh = null;

                    if (_isDiaDiem(relandTypeName)) {
                        radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;
                        diaChinh = null;
                        filter.geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
                    } else {
                        diaChinh  = placeUtil.getDiaChinhFromGooglePlace(placeDetail);
                        filter.geoBox = null;
                    }

                    adsModel.countWithFilter(callback, filter);
                }
            }, (error) => {
                logUtil.error(error);
                reply(Boom.internal("Call google detail fail", null, null));
            });

        }else if (place.currentLocation) {
            center.lat = place.currentLocation.lat;
            center.lon = place.currentLocation.lon;

            radiusInKm = place[Q_FIELD.radiusInKm] || DEFAULT_SEARCH_RADIUS;

            filter.geoBox = geoUtil.getBox({lat:center.lat, lon:center.lon} , geoUtil.meter2degree(radiusInKm));
            filter.diaChinh = null;

            adsModel.countWithFilter(callback,filter);
        }

    } 
    
}
module.exports = internals;
