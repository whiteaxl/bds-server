"use strict";

var logUtil = require("./logUtil");
var _ = require("lodash");
var CommonService = require("../dbservices/Common");
var commonService = new CommonService;



//declare global cache
global.rwcache = {};

function loadDoc(type, callback) {
  let sql = `select t.* from default t where type='${type}' `;
  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }
    global.rwcache[type] = {
      asMap : {},
      asArray : []
    };

    list.forEach(e => {
      global.rwcache[type].asMap[e.id] = e;
      global.rwcache[type].asArray.push(e);
    });

    logUtil.info("Done load all " + type, list.length + " records");

    callback();
  });
}


var cache = {
  init() {
    this.reloadAds();
  },
  reloadAds() {
    loadDoc("Ads", ()=> {

    });
  },

  adsAsArray() {
    return global.rwcache.Ads.asArray;
  },

  query(q, callback){
    let startQuery = new Date().getTime();

    if (q.huongNha && q.huongNha.length==1 && q.huongNha[0] == 0) {
      q.huongNha = null;
    }

    let filtered = [];
    this.adsAsArray().forEach((e) => {
      if (this._match(q, e)) {
        filtered.push(e);
      }
    });

    //ordering
    let count = filtered.length;

    console.log("Filterred length: ", count);

    //sorting
    let orderBy = q.orderBy || {"name": "ngayDangTin", "type":"DESC"};
    let startTime = new Date().getTime();
    filtered.sort((a, b) => {
      if (a[orderBy.name] > b[orderBy.name]) {
        return 1;
      }

      if (a[orderBy.name] < b[orderBy.name]) {
        return -1;
      }

      if (a.timeModified > b.timeModified) {
        return 1;
      }
      if (a.timeModified < b.timeModified) {
        return -1;
      }

      return 0;
    });
    let endTime = new Date().getTime();

    logUtil.info("Sorting time " + (endTime - startTime) + " ms for " + filtered.length + " records");

    //do paging
    filtered = filtered.slice((q.dbPageNo-1)*q.dbLimit, q.dbPageNo*q.dbLimit);

    let endQuery = new Date().getTime();

    logUtil.info("Query time " + (endQuery - startQuery) + " ms for " + filtered.length + " records");

    callback(null, filtered, count);

    return filtered;
  },

  _match(q, ads){
    if (q.loaiTin !== ads.loaiTin) {
      //logUtil.info("Not match loaiTin", q.loaiTin, ads.loaiTin);
      return false;
    }

    if(q.loaiNhaDat && _.indexOf(q.loaiNhaDat, ads.loaiNhaDat) === -1){
      //logUtil.info("Not match loaiNhaDat", q.loaiNhaDat, ads.loaiNhaDat);
      return false;
    }

    if (q.viewport) {
      let vp = q.viewport;
      let geo = ads.place.geo;

      if (geo.lat < vp.southwest.lat || geo.lat > vp.northeast.lat
        || geo.lon < vp.southwest.lon || geo.lat > vp.northeast.lon
      ) {
        //logUtil.info("Not match viewport", vp, geo);
        return false;
      }
    }

    if (q.diaChinh) {
      let dc = q.diaChinh;
      if (dc.tinhKhongDau && ads.place.diaChinh.codeTinh !== dc.tinhKhongDau) {
        //logUtil.info("Not match codeTinh", dc.tinhKhongDau, ads.place.diaChinh.codeTinh);
        return false;
      }

      if (dc.huyenKhongDau && ads.place.diaChinh.codeHuyen !== dc.huyenKhongDau) {
        //logUtil.info("Not match codeHuyen", dc.huyenKhongDau, ads.place.diaChinh.codeHuyen);
        return false;
      }
      if (dc.xaKhongDau && ads.place.diaChinh.codeXa !== dc.xaKhongDau) {
        return false;
      }
      if (dc.duAnKhongDau && ads.place.diaChinh.codeDuAn !== dc.duAnKhongDau) {
        return false;
      }
    }

    if (q.ngayDangTinGREATER && ads.ngayDangTin <= q.ngayDangTinGREATER) { //ngayDangTinFrom: 20-04-2016
      return false;
    }

    if (q.giaBETWEEN && (q.giaBETWEEN[0] > 1 || q.giaBETWEEN[1] < 9999999)) {
      if (ads.gia < q.giaBETWEEN[0] || ads.gia > q.giaBETWEEN[1]) {
        return false;
      }
    }

    if(q.soPhongNguGREATER){
      let soPhongNguGREATER = Number(q.soPhongNguGREATER);
      if (soPhongNguGREATER && ads.soPhongNgu < soPhongNguGREATER) {
        return false;
      }
    }


    if(q.soPhongTamGREATER){
      let soPhongTamGREATER = Number(q.soPhongTamGREATER);
      if (soPhongTamGREATER && ads.soPhongTam < soPhongTamGREATER) {
        return false;
      }
    }
    if(q.soTangGREATER){
      let soTangGREATER = Number(q.soTangGREATER);
      if (soTangGREATER && ads.soTang < soTangGREATER) {
        return false;
      }
    }

    if ((q.dienTichBETWEEN) && (q.dienTichBETWEEN[0] > 1 || q.dienTichBETWEEN[1] < 9999999)) {
      if (ads.dienTich < q.dienTichBETWEEN[0] || ads.dienTich > q.dienTichBETWEEN[1]) {
        return false;
      }
    }

    if(q.huongNha  && _.indexOf(q.huongNha, ads.huongNha) === -1){
      return false;
    }

    if(q.soPhongNgu){
      let soPhongNgu = Number(q.soPhongNgu);
      if (ads.soPhongNgu !== soPhongNgu) {
        return false;
      }
    }
    if(q.soPhongTam){
      let soPhongTam = Number(q.soPhongTam);
      if (ads.soPhongTam !== soPhongTam) {
        return false;
      }
    }

    if(q.soTang){
      let soTang = Number(q.soTang);
      if (ads.soTang !== soTang) {
        return false;
      }
    }

    if (q.gia) {
      if (ads.gia !== gia) {
        return false;
      }
    }

    if (q.dienTich) {
      if (ads.dienTich !== dienTich) {
        return false;
      }
    }

    return true;
  }

};

module.exports = cache;