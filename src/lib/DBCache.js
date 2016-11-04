"use strict";

var logUtil = require("./logUtil");
var _ = require("lodash");
var CommonModel = require("../dbservices/Common");
var commonService = new CommonModel;

var loki = require("lokijs");

var REFRESH_INTERVAL = 60;//seconds
var ADS_BATCH_SIZE = 100000; //each loading batch
var ADS_NUMBER_OF_BATCH = 3;
var ADS_BATCH_WAIT = 20; //seconds, waiting after each loading batch

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


function loadAds(limit, offset, isFull, callback) {
  let type = 'Ads';
  let projection = "id, gia, loaiTin, dienTich, soPhongNgu, soTang, soPhongTam, image, place, giaM2, loaiNhaDat, huongNha, ngayDangTin ";

  projection = isFull ? "default.*" : projection;

  let sql = `select ${projection} from default where type='Ads' and timeModified >= ${global.lastSyncTime} limit ${limit} offset ${offset} `   ;
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

    logUtil.info("Done load all " + type, list.length + " records" + ", offset="+offset);

    callback(list.length);
  });
}

var cache = {
  updateLastSyncTime(lastSyncTime) {
    global.lastSyncTime = lastSyncTime || new Date().getTime();
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
          that.reloadAds(() => {}, isFull);
        }, REFRESH_INTERVAL*1000);

        done && done();
      }
    };

    this.reloadAds(checkDone, isFull);
    this.reloadPlaces(checkDone);

  },
  _loadingAds : false,

  reloadAds(done, isFull) {
    if (this._loadingAds) {
      logUtil.warn("Can't perform reloadAds, there is readAds running!");
      return;
    }
    this._loadingAds = true;
    let that = this;

    let limit = ADS_BATCH_SIZE;
    let total = 0;
    let cnt = 0;
    let n = ADS_NUMBER_OF_BATCH;

    for (let i = 0; i < n; i++) {
      setTimeout(()=> {
        loadAds(limit, limit * i, isFull, (length)=> {
          total += length;
          cnt ++;
          if (cnt == n) {
            logUtil.info("Total loaded ads : ", total + ", from loki ads:" + adsCol.count());
            that._loadingAds = false;
            if (done) {
              done();
            }
          }
        });
      }, ADS_BATCH_WAIT*1000*i);
    }
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

  upsertAdsIfChanged(ads, callback) {
    let fromDB = this.adsById(ads.id);
    if (!fromDB) { //insert
      commonService.upsert(ads, (err, res) => {
        callback(err, 1);
      });
    } else {
      let c1 = _.clone(fromDB);
      let c2 = _.clone(ads);
      c2 = JSON.parse(JSON.stringify(c2));

      c1.$loki = null;
      c2.$loki = null;
      c1.meta = null;
      c2.meta = null;

      c1.timeExtracted = null;
      c2.timeExtracted = null;
      c1.timeModified = null;
      c2.timeModified = null;

      if (!_.isEqual(c1, c2)) { //update
        commonService.upsert(ads, (err, res) => {
          callback(err, 2);
        });
      } else { //same, no need any action
        callback(null, 0);
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