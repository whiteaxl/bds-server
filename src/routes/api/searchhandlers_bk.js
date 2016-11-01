'use strict';

var Boom = require('boom');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");
var AdsModel = require('../../dbservices/Ads');
var placeUtil = require("../../lib/placeUtil");


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

internals.search = function(req, reply) {
    logUtil.info("findPOST - query parameter: " );
    console.log(req.payload);

    try {
        var  queryCondition = req.payload;
        var adsModel = new AdsModel();
        var orderbyList = queryCondition.orderBy;
        var limit = queryCondition.limit;

        var orderByName ="";
        var orderByType ="";

        //let listResult = [];

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
            reply({
                length: listResult.length,
                list: listResult
            });
        };

        var onFailure = function(err) {
            reply(Boom.internal("Error when search:"));
        };

        adsModel.queryAllData(onSuccess,onFailure,
            queryCondition.loaiTin,
            util.popField(queryCondition, Q_FIELD.loaiNhaDat),
            util.popField(queryCondition, Q_FIELD.gia),
            util.popField(queryCondition, Q_FIELD.soPhongNgu),
            util.popField(queryCondition, Q_FIELD.soPhongTam),
            util.popField(queryCondition, Q_FIELD.dienTich),
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
module.exports = internals;
