'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");

var g_cachePlaces = {};

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

  diaChinh.tinh = g_cachePlaces["Place_T_" + diaChinh.codeTinh].placeName;
  diaChinh.huyen = g_cachePlaces["Place_H_" + diaChinh.codeHuyen].placeName;
  if (diaChinh.codeXa) {
    diaChinh.xa = g_cachePlaces["Place_X_" + diaChinh.codeXa].placeName;
  }
  if (diaChinh.codeDuAn) {
    let tmp = g_cachePlaces["Place_A_" + diaChinh.codeDuAn];
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

  ads.timeModified = bds.timeModified;

  ads.source = "dothi";
  ads.type = "Ads";
  ads.maSo = "02_" + bds.maSo; //01 => from bds.com
  ads.id = "Ads_" + ads.maSo;

  return ads;
}

function convertAllBds(callback) {
  let start = new Date().getTime();
  let sql = "select t.* from default t where type='Ads_Raw' and source = 'DOTHI.NET' and place.geo.lat is not null";
  commonService.query(sql, (err, list) => {
    let ads = null;
    list.forEach(e => {
      ads = convertBds(e);
      commonService.upsert(ads, (err, res) => {
        if (err) {
          logUtil.error(err);
        }
      });
    });

    let end = new Date().getTime();
    logUtil.info("Done " + list.length + " in " + (end-start) + "ms");

    callback();
  });
}

function loadPlaces(callback) {
  let sql = "select t.* from default t where type='Place' ";
  commonService.query(sql, (err, list) => {
    list.forEach(e => {
      g_cachePlaces[e.id] = e;
    });

    logUtil.info("Done load Places");

    callback();
  });
}

//-----------------------------------------------------------
loadPlaces(() => {
  convertAllBds(()=> {
    logUtil.info("DONE ALL");
  });
});
