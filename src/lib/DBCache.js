"use strict";

var logUtil = require("./logUtil");
var _ = require("lodash");
var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var loki = require("lokijs");
var db = new loki('rw.json');
var adsCol = db.addCollection('ads', {
  indices: ['loaiTin', 'place.diaChinh.codeTinh', 'place.diaChinh.codeHuyen']
});


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


function loadAds(callback) {
  let type = 'Ads';
  let sql = `select id, gia, loaiTin, dienTich, soPhongNgu, soTang, soPhongTam, image, place, giaM2, loaiNhaDat, huongNha, ngayDangTin from default where type='Ads'`;
  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }

    list.forEach(e => {
      adsCol.insert(e);
      /*
      global.rwcache[type].asMap[e.id] = e;
      if (e.loaiTin ==0) {
        global.rwcache[type].sale.push(e);
      } else {
        global.rwcache[type].rent.push(e);
      }
      */
    });

    logUtil.info("Done load all " + type, list.length + " records");

    callback();
  });
}

var cache = {
  init() {
    this.reloadAds_01();
    this.reloadPlaces();
  },
  reloadAds_01() {
    if (global.loadCluster) {
      let n = global.numCPUs;
      let t = Math.floor((Math.random() * n) + 1);
      let interval = global.delayLoadTime || 30000;

      setTimeout(() => {
        loadAds(()=> {});
      }, t * interval)
    } else {
      loadAds(()=> {});
    }
  },

  reloadPlaces() {
    loadDoc("Place", ()=> {
    });
  },

  placeAsArray() {
    return global.rwcache.Place.asArray;
  },

  query(q, callback){
    let startQuery = new Date().getTime();

    if (q.huongNha && q.huongNha.length==1 && q.huongNha[0] == 0) {
      q.huongNha = null;
    }
    //sorting
    let orderBy = q.orderBy || {"name": "ngayDangTin", "type":"DESC"};

    let that = this;

    let filtered = [];
    filtered = adsCol.chain()
      .find({loaiTin:q.loaiTin})
      .where((e) => {
        return that._match(q, e)
      })
      .data();

    //ordering
    let count = filtered.length;

    console.log("Filterred length: ", count);

    let sign = 1;
    if (orderBy.type == 'DESC') {
      sign = -1;
    }
    console.log("Will sort by ", orderBy, sign);

    let startTime = new Date().getTime();
    filtered.sort((a, b) => {
      if (a[orderBy.name] > b[orderBy.name]) {
        return sign;
      }

      if (a[orderBy.name] < b[orderBy.name]) {
        return -1 * sign;
      }

      if (a.timeModified > b.timeModified) {
        return sign;
      }
      if (a.timeModified < b.timeModified) {
        return -1 * sign;
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
        || geo.lon < vp.southwest.lon || geo.lon > vp.northeast.lon
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