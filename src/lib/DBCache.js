"use strict";

var logUtil = require("./logUtil");
var _ = require("lodash");
var Fuse = require("fuse.js");
var CommonModel = require("../dbservices/Common");
var commonService = new CommonModel;

var placeUtil = require('./placeUtil');

var loki = require("lokijs");

var constants = require("./constant");

var COMPARE_FIELDS = ["id", "gia", "loaiTin", "dienTich", "soPhongNgu", "soTang", "soPhongTam", "image"
  , "place", "loaiNhaDat", "huongNha", "ngayDangTin", "chiTiet", "dangBoi"];

var db = new loki('rw.json');
var adsCol = db.addCollection('ads', {
  unique : ['id'],
  indices: ['loaiTin', 'place.diaChinh.codeTinh', 'place.diaChinh.codeHuyen']
});

//declare global cache
global.rwcache = {};

global.lastSyncTime = 0;


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


function loadAds(isFull, callback) {
  let type = 'Ads';
  let projection = "id, gia, loaiTin, dienTich, soPhongNgu, soTang, soPhongTam, image, place, giaM2, loaiNhaDat, huongNha, ngayDangTin,timeExtracted ";
  //projection = isFull ? "`timeModified`,`id`,`gia`,`loaiTin`,`dienTich`,`soPhongNgu`,`soTang`,`soPhongTam`,`image`,`place`,`giaM2`,`loaiNhaDat`,`huongNha`,`ngayDangTin`,`chiTiet`,`dangBoi`,`source`,`type`,`maSo`,`url`,`GEOvsDC`,`GEOvsDC_distance`,`GEOvsDC_radius`,`timeExtracted`" : projection;
  projection = isFull ? COMPARE_FIELDS.join(",") : projection;

  let sql = `select ${projection} from default where type='Ads' and timeModified >= ${global.lastSyncTime}`   ;
  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }

    let adsColNotEmpty = adsCol.count() !== 0;

    list.forEach(e => {
      if (adsColNotEmpty) { // first time fullload, just simply insert
        let inCache = adsCol.by('id', e.id);
        if (inCache) {
          Object.assign(inCache, e);

          adsCol.update(inCache);
        } else {
          adsCol.insert(e);
        }
      } else {
        adsCol.insert(e);
      }
    });

    logUtil.info("Done load all " + type, list.length + " records");

    callback(list.length);
  });
}

function updateCache(ads){
  let inCache = adsCol.by('id', ads.id);
  if (inCache) {
    Object.assign(inCache, ads);

    adsCol.update(inCache);
  } else {
    adsCol.insert(ads);
  }
}

var cache = {
  updateLastSyncTime(lastSyncTime) {
    global.lastSyncTime = lastSyncTime || new Date().getTime();
  },

  placeFuse : null,

  searchPlace(query) {
    console.log("Key search: ", query);
    var result = this.placeFuse.search(query);

    console.log("Matched from fuse:", query, result.length);

    result.forEach((e) => {
      console.log(e.fullName);
    });

    return result;
  },

  initPlaceAutoComplete() {
    var options = {
      shouldSort: true,
      threshold: 0.13,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      keys: [
        "searchKey"
      ]
    };
    this.placeFuse = new Fuse(this.placeAsArray().map((e) => {
      /*
      if (e.placeType=='H') {
        e.searchKey = isNaN(e.nameKhongDau) ? e.nameKhongDau : 'quan-'+e.nameKhongDau;
      }
      if (e.placeType=='X') {
        e.searchKey = isNaN(e.nameKhongDau) ? e.nameKhongDau : 'phuong-'+e.nameKhongDau;
      }
      */
      e.searchKey = placeUtil.chuanHoaAndLocDau(e.fullName);

      return e;
    }), options); // "list" is the item array
    //var result = this.placeFuse.search("");
  },

  init(done, isFull) {
    let lastSyncTime = new Date().getTime();
    let cnt = 0;
    let that = this;

    let checkDone = () => {
      cnt ++ ;
      if (cnt==2) {
        this.updateLastSyncTime(lastSyncTime);

        //schedule to reload
        setInterval(()=> {
          let lastSyncTime = new Date().getTime();
          that.reloadAds(() => {
            this.updateLastSyncTime(lastSyncTime);
          }, isFull);
        }, constants.DBCACHE.REFRESH_INTERVAL*1000);

        done && done();
      }
    };

    this.reloadAds(checkDone, isFull);
    this.reloadPlaces(() => {
      that.initPlaceAutoComplete();
      checkDone();
    });
  },
  _loadingAds : false,

  reloadAds(done, isFull) {
    if (this._loadingAds) {
      logUtil.warn("Can't perform reloadAds, there is readAds running!");
      return;
    }
    this._loadingAds = true;
    let that = this;

    let total = 0;

    loadAds(isFull, (length)=> {
      total += length;
      logUtil.info("Total loaded ads : ", total + ", from loki ads:" + adsCol.count());
      that._loadingAds = false;
      done && done();
    });
  },

  reloadPlaces(done) {
    loadDoc("Place", done);
  },

  placeAsArray() {
    return global.rwcache.Place.asArray;
  },

  placeAsMap() {
    return global.rwcache.Place.asMap;
  },

  placeById(id) {
    return this.placeAsMap()[id];
  },

  adsById(id) {
    return adsCol.by('id', id);
  },

  updateCache(ads){
    updateCache(ads);
  },

  upsertAdsIfChanged(ads, callback) {
    let fromDB = this.adsById(ads.id);
    if (!fromDB) { //insert
      callback(1);
    } else {
      let c1 = _.clone(fromDB);
      let c2 = _.clone(ads);
      c2 = JSON.parse(JSON.stringify(c2));

      if (c1.image.images && c1.image.images.length == 0) {
        c1.image.images = null;
      }
      if (c2.image.images && c2.image.images.length == 0) {
        c2.image.images = null;
      }
      //no need compare geo, just need compare originalGeo
      c1.place.geo = null;
      c2.place.geo = null;

      let needUpdate = false;
      let f;
      for (let i = 0; i < COMPARE_FIELDS.length; i++) {
        f = COMPARE_FIELDS[i];
        if (!_.isEqual(c1[f], c2[f])) {
          needUpdate = true;
          break;
        }
      }

      if (needUpdate) { //update
        callback(2);
      } else { //same, no need any action
        callback(0);
      }
    }
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

      if (a.timeExtracted > b.timeExtracted) {
        return sign;
      }
      if (a.timeExtracted < b.timeExtracted) {
        return -1 * sign;
      }

      if (a.id > b.id) {
        return sign;
      }

      if (a.id < b.id) {
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

    if (q.giaBETWEEN && (q.giaBETWEEN[0] > 0 || q.giaBETWEEN[1] < 9999999)) {
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

    if ((q.dienTichBETWEEN) && (q.dienTichBETWEEN[0] > 0 || q.dienTichBETWEEN[1] < 9999999)) {
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
      if (ads.gia !== q.gia) {
        return false;
      }
    }

    if (q.dienTich) {
      if (ads.dienTich !== q.dienTich) {
        return false;
      }
    }

    return true;
  }

};

module.exports = cache;