'use strict'

var logUtil = require("../../lib/logUtil");
var constant = require("../../lib/constant");
var dbCache = require("../../lib/DBCache");
var geoUtil = require("../../lib/geoUtil");
var cfg = require('../../config');
var util = require("../../lib/utils");
var moment = require("moment");
var constant = require("../../lib/constant");

var internals = {};

function _mergeViewportWithBox(q, box) {
    let viewport = q.viewport;

    if (viewport) { //merging, giao cua 2 viewport
        viewport.southwest.lat = Math.max(box.southwest.lat, viewport.southwest.lat);
        viewport.southwest.lon = Math.max(box.southwest.lon, viewport.southwest.lon);
        viewport.northeast.lat = Math.min(box.northeast.lat, viewport.northeast.lat);
        viewport.northeast.lon = Math.min(box.northeast.lon, viewport.northeast.lon);
    } else { //lay viewport la` hinh bao
        q.viewport = box;
    }
}

function _transform(allAds, q) {
    let transformeds = allAds.map((ads) => {
            //images:
            var targetSize = "745x510"; //350x280

    let tmp = {
        adsID: ads.id,
        gia: ads.gia && !isNaN(ads.gia) ? ads.gia : Number(0),
        giaFmt: util.getPriceDisplay(ads.gia, ads.loaiTin),
        giaFmtForWeb: util.getPriceDisplay(ads.gia, ads.loaiTin, true),
        dienTich: ads.dienTich, dienTichFmt: util.getDienTichDisplay(ads.dienTich),
        soPhongNgu: ads.soPhongNgu,
        soPhongNguFmt: ads.soPhongNgu ? ads.soPhongNgu + "p.ngủ" : null,
        soTang: ads.soTang ,
        soTangFmt: ads.soTang ? ads.soTang + "tầng" : null,
        soPhongTam: ads.soPhongTam,
        soPhongTamFmt: ads.soPhongTam ? ads.soPhongTam + "p.tắm" : null,
        image: {
            cover: ads.image.cover ? ads.image.cover.replace("80x60", targetSize).replace("120x90", targetSize).replace("200x200", targetSize) : cfg.noCoverUrl,
            images: ads.image.images ? ads.image.images.map((e) => {
                return e.replace("80x60", targetSize).replace("120x90", targetSize).replace("200x200", targetSize);
}) : [cfg.noCoverUrl]
},
    diaChi: ads.place.diaChi,
        ngayDangTin: ads.ngayDangTin && !isNaN(ads.ngayDangTin) ? ads.ngayDangTin.toString() : "",
        giaM2: ads.giaM2,
        loaiNhaDat: ads.loaiNhaDat,
        loaiTin: ads.loaiTin,
        huongNha: ads.huongNha && !isNaN(ads.huongNha) ? ads.huongNha : Number(0),
        place : ads.place
};
    //console.log(tmp.cover);

    //dummy for cover image
    if (tmp.image.cover && tmp.image.cover.indexOf("no-photo") > -1) {
        tmp.image.cover = cfg.noCoverUrl;
        //console.log("1"+tmp.image.cover);
    }

    if (tmp.ngayDangTin) {
        var ngayDangTinDate = moment(tmp.ngayDangTin, constant.FORMAT.DATE_IN_DB);
        tmp.soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');
    }

    return tmp;
});

    return transformeds;
}

const giaTrungBinhBanTmp = [
        {loaiNhaDat: 1, loaiNhaDatVal: "Bán căn hộ chung cư", giaM2:0, giaM2TrungBinh: 0, count: 0},
        {loaiNhaDat: 2, loaiNhaDatVal: "Bán nhà riêng", giaM2:0, giaM2TrungBinh: 0, count: 0},
        {loaiNhaDat: 3, loaiNhaDatVal: "Bán biệt thự, liền kề", giaM2:0, giaM2TrungBinh: 0, count: 0},
        {loaiNhaDat: 4, loaiNhaDatVal: "Bán nhà mặt phố", giaM2:0, giaM2TrungBinh: 0, count: 0}
        ];

const giaTrungBinhThueTmp = [
    {loaiNhaDat: 1, loaiNhaDatVal: "Cho Thuê căn hộ chung cư", giaM2:0, giaM2TrungBinh: 0, count: 0},
    {loaiNhaDat: 2, loaiNhaDatVal: "Cho Thuê nhà riêng", giaM2:0, giaM2TrungBinh: 0, count: 0},
    {loaiNhaDat: 3, loaiNhaDatVal: "Cho Thuê nhà mặt phố", giaM2:0, giaM2TrungBinh: 0, count: 0},
    {loaiNhaDat: 4, loaiNhaDatVal: "Cho Thuê nhà trọ, phòng trọ", giaM2:0, giaM2TrungBinh: 0, count: 0},
    {loaiNhaDat: 5, loaiNhaDatVal: "Cho Thuê văn phòng", giaM2:0, giaM2TrungBinh: 0, count: 0},
    {loaiNhaDat: 6, loaiNhaDatVal: "Cho Thuê cửa hàng, ki-ốt", giaM2:0, giaM2TrungBinh: 0, count: 0}
]

internals.getProductPricing = function (req, reply) {
    console.log("Get Product Pricing:", req.payload);
    let q = req.payload;

    if (!q.codeDuAn || q.codeDuAn.length < 0) {
        let box = geoUtil.getBoxOfCircle({lat: q.position.lat, lon: q.position.lon}, geoUtil.meter2degree(0.5));
        _mergeViewportWithBox(q, box);
    }

    q.giaBETWEEN = [0.1, 9999999];

    if (q.codeDuAn && q.codeDuAn.length>0){
        q.diaChinh= {duAnKhongDau: q.codeDuAn};
    }

    if (q.dienTich){
        q.dienTichBETWEEN= [q.dienTich*0.7, q.dienTich*1.3];
    }

    q.dbLimit = 5000;
    q.dbPageNo =  1;
    q.dbOrderBy = q.orderBy || {"name": "ngayDangTin", "type":"DESC"};

    let inputLoaiNhaDat = q.loaiNhaDat[0];
    let inputLoaiTin = q.loaiTin;

    let giaTrungBinh = [];

    if (q.loaiTin == 0) {
        q.loaiNhaDat = [1, 2, 3, 4];
        giaTrungBinh = JSON.parse(JSON.stringify(giaTrungBinhBanTmp));

    }
    else {
        q.loaiNhaDat = [1, 2, 3, 4, 5, 6];
        giaTrungBinh = JSON.parse(JSON.stringify(giaTrungBinhThueTmp));
    }

    dbCache.query(q, (err, listAds, count) => {
        if (err) {
            console.log("Error when query ADS:", err);
            reply({success: false, msg: err});
            return;
        }
        let giaM2 = 0;
    let adsNgangGia = [];
    let giaTrungBinhKhac = [];
    let pricing = {};
    let radius = 0.5;
    if (listAds && listAds.length > 0) {
        console.log("======================== print listAds, count=" + listAds.length);
        if (q.codeDuAn && q.codeDuAn.length > 0) {
            for (var i = 0; i < listAds.length; i++) {
                giaTrungBinh[listAds[i].loaiNhaDat - 1].giaM2 += listAds[i].giaM2;
                giaTrungBinh[listAds[i].loaiNhaDat - 1].count += 1;
            }

            for (var h = 0; h < giaTrungBinh.length; h++) {
                if (giaTrungBinh[h].count >= 3) {
                    giaTrungBinh[h].giaM2TrungBinh = giaTrungBinh[h].giaM2 / giaTrungBinh[h].count;
                    giaTrungBinh[h].giaM2 = undefined; // remove giaM2
                    if (giaTrungBinh[h].loaiNhaDat == inputLoaiNhaDat) {
                        pricing = giaTrungBinh[h];
                    } else {
                        giaTrungBinhKhac.push(giaTrungBinh[h]);
                    }
                }
            }

            if (pricing != {}) {
                let numOfReturnAds = 1;
                for (var i = 0; i < listAds.length; i++) {
                    if (listAds[i].loaiNhaDat == inputLoaiNhaDat) {
                        adsNgangGia.push(listAds[i]);
                        if (numOfReturnAds >= 5)
                            break;
                        numOfReturnAds = numOfReturnAds + 1;
                    }
                }
            }
        } else {
            for (var u = 1; u <= 5; u++) {
                radius = 0.1 * u;

                let boxfilter = geoUtil.getBoxOfCircle({
                    lat: q.position.lat,
                    lon: q.position.lon
                }, geoUtil.meter2degree(radius));

                // filter pricing in circle
                let filterList = [];
                for (var i = 0; i < listAds.length; i++){
                    if (listAds[i].place && listAds[i].place.geo
                        && listAds[i].place.geo.lat && listAds[i].place.geo.lon
                        && (listAds[i].place.geo.lat - boxfilter.northeast.lat) * (listAds[i].place.geo.lat  - boxfilter.southwest.lat) < 0
                        && (listAds[i].place.geo.lon - boxfilter.northeast.lon) * (listAds[i].place.geo.lon  - boxfilter.southwest.lon) < 0
                    ){
                        giaTrungBinh[listAds[i].loaiNhaDat - 1].giaM2 += listAds[i].giaM2;
                        giaTrungBinh[listAds[i].loaiNhaDat - 1].count += 1;
                        filterList.push(listAds[i]);
                    }
                }

                for (var h = 0; h < giaTrungBinh.length; h++) {
                    if (giaTrungBinh[h].count >= 3) {
                        giaTrungBinh[h].giaM2TrungBinh = giaTrungBinh[h].giaM2 / giaTrungBinh[h].count;
                        giaTrungBinh[h].giaM2 = undefined; // remove giaM2
                        if (giaTrungBinh[h].loaiNhaDat == inputLoaiNhaDat) {
                            pricing = giaTrungBinh[h];
                        } else {
                            giaTrungBinhKhac.push(giaTrungBinh[h]);
                        }
                    }
                }

                if (JSON.stringify(pricing) != JSON.stringify({})) {
                    let tmp = [];
                    filterList.map( (e) => {if (e.loaiNhaDat == inputLoaiNhaDat)
                                                tmp.push(e);
                                         });

                    tmp.sort((a,b) => { return (Math.abs(a.giaM2TrungBinh-pricing.giaM2TrungBinh) - Math.abs(b.giaM2TrungBinh-pricing.giaM2TrungBinh))});

                    if (tmp.length <=5 ){
                        adsNgangGia = tmp;
                    } else{
                        adsNgangGia = tmp.slice(0,5);
                    }
                    break;
                } else {
                    giaTrungBinh = (inputLoaiTin == 0) ? JSON.parse(JSON.stringify(giaTrungBinhBanTmp)) : JSON.parse(JSON.stringify(giaTrungBinhThueTmp));
                    giaTrungBinhKhac = [];
                }
            }
        }
    }

    let res = {
        success: true,
        data: {
            radius: parseInt(radius*1000),
            giaTrungBinh: pricing.count && pricing.count>=3 ? pricing : undefined,
            giaTrungBinhKhac: giaTrungBinhKhac && giaTrungBinhKhac.length>0 ? giaTrungBinhKhac : undefined,
            bdsNgangGia: pricing.count && pricing.count>=3 ? _transform(adsNgangGia) : undefined
        }
    }

    reply(res);
});


}

module.exports = internals;

