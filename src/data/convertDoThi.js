'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");

var DBCache = require("../lib/DBCache");
var _ = require("lodash");

function getBdsImage(bds) {
  let image = {
    cover : bds.image.cover,
    images : bds.image.images
  };

  if (!image.cover) {
    image.cover = undefined;
  }

  return image;
}

function toRewayCode(code) {
  if (!code || code == "0" || code == "-1") {
    return undefined;
  }

  return code;
}

function getDiaChinh(bds) {
  let diaChinh = {
    codeTinh : toRewayCode(bds.extMaCity),
    codeHuyen : toRewayCode(bds.extMaDist),
    codeXa : toRewayCode(bds.extMaWard),
    codeDuAn : toRewayCode(bds.extMaProject)
  };

  if (!DBCache.placeById("Place_T_" + diaChinh.codeTinh)) {
    logUtil.error("Dont have Tinh:", "Place_T_" + diaChinh.codeTinh);
    return diaChinh;
  }

  diaChinh.tinh = DBCache.placeById("Place_T_" + diaChinh.codeTinh).placeName;

  if (!DBCache.placeById("Place_H_" + diaChinh.codeHuyen)) {
    logUtil.error("Dont have Tinh:", "Place_H_" + diaChinh.codeHuyen);
    return diaChinh;
  }

  diaChinh.huyen = DBCache.placeById("Place_H_" + diaChinh.codeHuyen).placeName;
  if (diaChinh.codeXa) {
    diaChinh.xa = DBCache.placeById("Place_X_" + diaChinh.codeXa).placeName;
  }
  if (diaChinh.codeDuAn) {
    let tmp = DBCache.placeById("Place_A_" + diaChinh.codeDuAn);
    if (!tmp) {
      logUtil.error("NO DuAn:", diaChinh.codeDuAn);
    } else {
      diaChinh.duAn = tmp.placeName;
    }
  }

  return diaChinh;
}

//convert from bds data to reway data
function convertBds(bds) {
  let ads = {};
  ads.chiTiet = bds.chiTiet.trim();
  ads.dangBoi = bds.dangBoi;
  ads.dienTich = bds.dienTich || -1;
  ads.gia = bds.gia || -1;
  ads.giaM2 = bds.giaM2 || -1;
  if (ads.gia > 10000000 || ads.giaM2 > 5000) { //wrong data
    ads.gia = -1;
    ads.giaM2 = -1;
  }

  ads.image = getBdsImage(bds);
  ads.loaiNhaDat = bds.loaiNhaDat;
  ads.loaiTin = bds.loaiTin;
  ads.ngayDangTin = bds.ngayDangTin;
  ads.place = {
    diaChi : bds.place.diaChi,
    diaChinh : getDiaChinh(bds),
    geo : bds.place.geo
  };
  ads.soPhongNgu = bds.soPhongNgu;
  ads.soPhongTam = bds.soPhongTam;
  ads.soTang = bds.soTang;
  ads.huongNha = bds.huongNha ? bds.huongNha : -1;

  ads.timeExtracted = bds.timeModified;
  ads.timeModified = new Date().getTime();

  ads.source = "dothi";
  ads.type = "Ads";
  ads.maSo = "02_" + bds.maSo; //01 => from bds.com
  ads.id = "Ads_" + ads.maSo;

  return ads;
}

function convertAllBds(callback, ngayDangFrom, ngayDangTo) {
  let start = new Date().getTime();
  let condition = "";
  if (ngayDangFrom) {
    condition = `and ngayDangTin >= '${ngayDangFrom}'`
  }
  if (ngayDangTo) {
    condition = `${condition} and ngayDangTin <= '${ngayDangTo}'`
  }

  let sql = "select t.* from default t where type='Ads_Raw' and source = 'DOTHI.NET' and place.geo.lat is not null " + condition;
  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }

    let ads = null;
    let cnt = 0, cntChanged = 0, cntNew = 0;
    list.forEach(e => {
      ads = convertBds(e);
      DBCache.upsertAdsIfChanged(ads, (err, res) => {
        if (res == 0) { //same, no need any action
          cnt++;
        }
        if (res == 1) { //insert
          cnt++;
          cntNew++;
        }
        if (res == 2) { //update
          cnt++;
          cntChanged++;
        }
      });
    });

    let end = new Date().getTime();
    logUtil.info("Done " + list.length + " in " + (end-start) + "ms");

    setInterval(() => {
      logUtil.info("Check count:", cnt, list.length);
      if (cnt == list.length) {
        logUtil.info("Number of new records: " + cntNew + ", number of changed records: " + cntChanged + ", total: " + cnt);
        callback();
      }
    }, 1000)
  });
}

function loadPlaces(callback) {
  let sql = "select t.* from default t where type='Place' ";
  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }

    list.forEach(e => {
      g_cachePlaces[e.id] = e;
    });

    logUtil.info("Done load Places:", list.length);

    callback();
  });
}

//-----------------------------------------------------------
module.exports = {loadPlaces, convertAllBds};
