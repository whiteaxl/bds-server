'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");

var geoHandlers = require("./geoHandlers");

var constants = require("../lib/constant");

var DBCache = require("../lib/DBCache");
var _ = require("lodash");

var helper = require("./convertHelper");

function getDiaChinh(bds) {
  let diaChinh = {
    codeTinh : helper.toRewayCode(bds.extMaCity),
    codeHuyen : helper.toRewayCode(bds.extMaDist),
    codeXa : helper.toRewayCode(bds.extMaWard),
    codeDuAn : helper.toRewayCode(bds.extMaProject)
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
      logUtil.error("NO DuAn:", diaChinh.codeDuAn + " for id:" + bds.id);
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

  ads.image = helper.getBdsImage(bds);
  ads.loaiNhaDat = bds.loaiNhaDat;
  ads.loaiTin = bds.loaiTin;
  ads.ngayDangTin = bds.ngayDangTin;
  ads.place = {
    diaChi : bds.place.diaChi,
    diaChinh : getDiaChinh(bds),
    geo : bds.place.geo,
    originalGeo : _.cloneDeep(bds.place.geo)
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

  ads.url = bds.url;

  ads.getGeoBy = "source";

  //check geo vs place
  if (ads.place.geo.lat) {
    let checkGeo = geoHandlers.notMatchDiaChinhAndGeo(ads.place);
    ads.GEOvsDC = checkGeo.inVP;
    ads.GEOvsDC_distance = checkGeo.GEOvsDC_distance;
    ads.DC_radius = checkGeo.DC_radius;
    ads.GEOvsDC_diff = checkGeo.GEOvsDC_distance - checkGeo.DC_radius;
  } else {
    ads.GEOvsDC = 4; //no geo data
  }

  ads.meta = {
    status : 'good'
  };

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

  let sql = "select t.* from default t where type='Ads_Raw' and source = 'DOTHI.NET' " + condition;
  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }

    let ads = null;
    let cnt = 0, cntChanged = 0, cntNew = 0, cntWrongData=0;
    list.forEach(e => {
      ads = convertBds(e);
      helper.upsertAdsIfChanged(ads, (res) => {
        if (res == 0) { //same, no need any action
          cnt++;
          return;
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

//-----------------------------------------------------------
module.exports = {convertAllBds};
