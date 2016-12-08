'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var geoHandlers = require("./geoHandlers");

var logUtil = require("../lib/logUtil");
var geoUtil = require("../lib/geoUtil");

var DBCache = require("../lib/DBCache");
var _ = require("lodash");
var helper = require("./convertHelper");
var moment = require("moment");

var services = require("../lib/services");
var utils = require("../lib/utils");

function _getParamsValue(bds, label) {
  for (let i = 0; i < bds.params_label.length; i++) {
    if (bds.params_label[i] == label) {
      return bds.params_value[i];
    }
  }

  return null;
}

function _convertLoaiNhaDat(u, bds) {

  bds.loaiTin = 0;

    if (u.indexOf("mua-ban-nha-dat") > -1) {
      bds.loaiNhaDat = 2
    }

    if (u.indexOf("mua-ban-dat") > -1) {
      bds.loaiNhaDat = 6
    }

    //sang-nhuong-van-phong-mat-bang-kinh-doanh
    if (u.indexOf("sang-nhuong-van-phong-mat-bang-kinh-doanh") > -1) {
      bds.loaiNhaDat = 4
    }

    //mua-ban-can-ho-chung-cu
    if (u.indexOf("mua-ban-can-ho-chung-cu") > -1) {
      bds.loaiNhaDat = 1
    }

  bds.loaiTin = 1;
    //thue-nha-dat
    if (u.indexOf("thue-nha-dat") > -1) {
      bds.loaiNhaDat = 2
    }

    //thue-dat
    if (u.indexOf("thue-dat") > -1) {
      bds.loaiNhaDat = 7
    }

    //thue-van-phong-mat-bang-kinh-doanh
    if (u.indexOf("thue-van-phong-mat-bang-kinh-doanh") > -1) {
      bds.loaiNhaDat = 3
    }

    //thue-can-ho-chung-cu
    if (u.indexOf("thue-can-ho-chung-cu") > -1) {
      bds.loaiNhaDat = 1
    }

    //thue-phong-tro
    if (u.indexOf("thue-phong-tro") > -1) {
      bds.loaiNhaDat = 4
    }
}

function _convertNgayDangTin(baseDateAsMs, dangBoiDateTime, ads) {
  let retDate, retTime;

  let choTotDateTime = dangBoiDateTime.replace("vào", "").trim();
  let retDateTime = moment(baseDateAsMs);
  let mm, hh;
  let spl  = choTotDateTime.split(" ");
  //trc
  if (choTotDateTime.indexOf("trước") > -1) {
    for (let i = 0 ; i < spl.length; i++) {
      if (spl[i] == "giờ") {
        hh = spl[i-1];
        retDateTime = retDateTime.subtract(hh, "hours");
      }
      if (spl[i] == "phút") {
        mm = spl[i-1];
        retDateTime = retDateTime.subtract(mm, "minutes");
      }
    }
    retDate = retDateTime.format("YYYYMMDD");
    retTime = retDateTime.format("HH:mm");

  } else if (choTotDateTime.indexOf("Hôm qua") > -1) {
    retDate = retDateTime.subtract(1, "days").format("YYYYMMDD");
    retTime = spl[1];
  } else {
    let D, M, Y;
    for (let i = 0 ; i < spl.length; i++) {
      if (spl[i] == "ngày") {
        D = spl[i+1];
      }
      if (spl[i] == "tháng") {
        M = spl[i+1];
      }
      if (spl[i] == "năm") {
        Y = spl[i+1];
      }
    }

    if (Y) {
      retDateTime = retDateTime.year(Y);
    }

    retDateTime = retDateTime.month(M).date(D);

    retDate = retDateTime.format("YYYYMMDD");
    retTime = spl[spl.length-1];
  }

  ads.ngayDangTin = retDate;
  ads.gioDangTin  = retTime;
}

function _getPlaceByGGName(address) {
  //init
  if (!global.allTinh) {
    global.allTinh = [];
    DBCache.placeAsArray().forEach((e) => {
      if (e.placeType=='T') {
        global.allTinh.push(e);
      }
    })
  }

  if (!global.allHuyen) {
    global.allHuyen = [];
    DBCache.placeAsArray().forEach((e) => {
      if (e.placeType=='H') {
        global.allTinh.forEach((t) => {
          if (t.codeTinh == e.codeTinh) {
            e.ggTinhName = t.ggName;
            e.ggHuyenName = e.ggName;
          }
        });

        global.allHuyen.push(e);
      }
    })
  }
  let l = address.length;
  if (l <= 3) {
    return null;
  }

  let addressHuyenTinh =  address[l-3].short_name + "," + address[l-2].short_name;
  addressHuyenTinh = addressHuyenTinh.replace("Quận ", "").replace("Huyện ", "");
  let addressHuyenTinhKhongDau = utils.locDau(addressHuyenTinh);

  for (let i = 0; i < global.allHuyen.length ; i++) {

    let h = global.allHuyen[i];
    let rewayHuyenTinhName = h.fullName.replace("Quận ", "").replace("Huyện ", "");

    if (addressHuyenTinhKhongDau ==  utils.locDau(rewayHuyenTinhName)) {
      return h;
    }
  }

  return null;
}

function _getDuAn(title, huyenTinh) {
  //init
  if ((!global.duAnByCodeHuyen)) {
    global.duAnByCodeHuyen = {};
    DBCache.placeAsArray().forEach((e) => {
      if (e.placeType=='A') {
        if (!global.duAnByCodeHuyen[e.codeHuyen]) {
          global.duAnByCodeHuyen[e.codeHuyen] = [];
        }
        global.duAnByCodeHuyen[e.codeHuyen].push(e);
      }
    })
  }
  //check
  let titleLowerCase = title.toLowerCase();
  let listDuAn = global.duAnByCodeHuyen[huyenTinh.codeHuyen];
  if (listDuAn) {
    for (let i=0; i < listDuAn.length; i++) {
      let a = listDuAn[i];
      if (titleLowerCase.indexOf(a.duAn.toLowerCase()) > -1) {
        return a;
      }
    }
  }

  return null;
}

function _chuanHoaDiaChi(dc) {
  //init
  if (!global.chuanHoaMapping) {
    global.chuanHoaMapping = require("./chotot/chuanHoaDiaChi.json");
  }

  global.chuanHoaMapping.forEach((e) => {
    if (e.isRegEx) {
      dc = dc.replace(e.from, e.to);
    } else {
      dc = dc.replace(new RegExp(e.from, "i"), e.to);
    }
  });

  return dc;
}

function _convertDiaChi(ads, bds, callback) {
  //prepare data
  if (!global.huyenMapping) {
    let hnHuyenMapping = require("./chotot/hnMapping.json");
    hnHuyenMapping = hnHuyenMapping.map((e) => {
      e.codeTinh = 'HN';
      return e;
    });
    let hcmHuyenMapping = require("./chotot/hcmMapping.json");
    hcmHuyenMapping = hcmHuyenMapping.map((e) => {
      e.codeTinh = 'SG';
      return e;
    });
    global.huyenMapping = hnHuyenMapping.concat(hcmHuyenMapping);

    global.huyenMapping.forEach(h => {
      let tmp  = DBCache.placeById("Place_H_"+h.codeHuyen);
      h.huyen = tmp.huyen;
      h.tinh = tmp.tinh;
    })
  }


  let vung = _getParamsValue(bds, "Vùng/Tỉnh, thành, quận");
  let huyenTinh = null;
  global.huyenMapping.forEach((e) => {
    if (e.chotot === vung) {
      huyenTinh = e;
    }
  });

  if (!huyenTinh) {
    callback({
      conversionError: "Not exist Vung:" + vung
    });
    return;
  }



  let diaChiChoTot = _getParamsValue(bds, "Địa chỉ");
  if (!diaChiChoTot) {
    callback({
      conversionError: "Not exist diaChi"
    });
    return;
  }

  diaChiChoTot = _chuanHoaDiaChi(diaChiChoTot);
  //vung
  let vungSpl = vung.replace("Tp ", "").split(",");
  let tinhKhongDauInVung = utils.locDau(vungSpl[0]);
  let diaChiChoTotKhongDau = utils.locDau(diaChiChoTot);
  if (!diaChiChoTotKhongDau.endsWith(tinhKhongDauInVung)) {
    diaChiChoTot = diaChiChoTot + "," + vungSpl[0];
  }

  //try to get by du an first, if chung cu
  let loai = _getParamsValue(bds, "Loại");
  if (loai == "Căn hộ/Chung cư") {
    let duAn = _getDuAn(bds.title, huyenTinh);
    if (duAn) {
      ads.place = {
        diaChi : diaChiChoTot,
        diaChinh : {
          tinh : duAn.tinh,
          huyen: duAn.huyen,
          codeTinh: duAn.codeTinh,
          codeHuyen: duAn.codeHuyen,
          duAn: duAn.duAn,
          codeDuAn: duAn.codeDuAn
        },
        geo : {
          lat : duAn.geometry.location.lat,
          lon : duAn.geometry.location.lon
        }
      };

      return callback(null);
    }

    //return callback({ notByDuAn : true });
  }

  //return callback({ notByDuAn : true });

  services.getGeocodingByAddress(diaChiChoTot, (results) => {
    console.log("Done search:" + diaChiChoTot);
    if (results && !results[0].partial_match && results[0].address_components.length >= 5) {
      let ggPlace = results[0];

      let placeHuyen = _getPlaceByGGName(ggPlace.address_components);
      if (placeHuyen && placeHuyen.codeHuyen == huyenTinh.codeHuyen) {
        ads.place = {
          diaChi : diaChiChoTot,
          diaChinh : {
            tinh : huyenTinh.tinh,
            huyen: huyenTinh.huyen,
            codeTinh: huyenTinh.codeTinh,
            codeHuyen: huyenTinh.codeHuyen
          },
          geo : {
            lat : ggPlace.geometry.location.lat,
            lon : ggPlace.geometry.location.lng
          }
        };

        ads.gg_formatted_address = ggPlace.formatted_address;

        callback(null)
      } else {
        callback({
          conversionError: "Huyen, Tinh do not match! ggAddress:",
          ggPlace: ggPlace
        })
      }
    } else {
      callback({
        conversionError: "No google matched result with more than 4 level!",
        ggPlace: results && results[0]
      });
    }
  })
}

function _convertImage(bds, ads) {
  //https://static.chotot.com.vn/mob_wm_240/93/9368579377.jpg
  //https://static.chotot.com.vn/wm_images/93/9368579377.jpg
  let toBigImage = (url) => {
    if (!url) {
      return null;
    }
    return url.replace("mob_wm_240", "wm_images");
  };
  let imageUrls =  bds.imageUrls;
  let cover = toBigImage(bds.image_url);
  ads.image = {
    cover : cover,
    images : imageUrls ? imageUrls.map(url => toBigImage(url)) : [cover]
  }

}

//convert from bds data to reway data
function convertChoTot(bds, callback) {
  let ads = {};
  ads.chiTiet = bds.chiTiet.trim();

  if (!bds.lienHe_tel) {
    let errMsg ="Not exist phone";
    console.error(errMsg + ", url:" + bds.url);
    callback({
      conversionError: errMsg
    });

    return;
  }

  ads.dangBoi = {
    name : bds.dangBoi,
    phone : bds.lienHe_tel.substring(4)
  };

  ads.dienTich = _getParamsValue(bds, "Diện tích") || -1;
  ads.dienTich = Number(ads.dienTich);
  //gia

  let giaRaw = _getParamsValue(bds, "Giá");
  ads.gia = -1;
  ads.giaM2 = -1;
  if (giaRaw) {
    ads.gia = Number(giaRaw.split(" ")[0].replace(/\./g, "") ) / 1000000;
    if (ads.dienTich != -1) {
      ads.giaM2 = ads.gia / ads.dienTich;
    }

    if (ads.giaM2 > 5000 || !ads.gia ) { //wrong data
      ads.gia = -1;
      ads.giaM2 = -1;
    }

    ads.giaM2 = Math.round(ads.giaM2*100)/100;
  }

  //
  _convertImage(bds, ads);

  _convertLoaiNhaDat(bds.url, ads);

  _convertNgayDangTin(bds.timeModified, bds.dangBoi_dateTime, ads);
  //ads.soPhongNgu = bds.soPhongNgu;
  //ads.soPhongTam = bds.soPhongTam;
  //ads.soTang = bds.soTang;
  //ads.huongNha = bds.emailRegister_direction == "0" ? -1 : Number(bds.emailRegister_direction);

  ads.timeExtracted = bds.timeModified;
  ads.timeModified = new Date().getTime();


  ads.source = "chotot";
  ads.type = "Ads";
  ads.maSo = "03_" + bds.maSo; //01 => from bds.com
  ads.id = "Ads_" + ads.maSo;

  ads.url = bds.url;

  ads.getGeoBy = "convert";
  ads.GEOvsDC = 0;

  ads.meta = {
    status : 'good'
  };

  _convertDiaChi(ads, bds,(err) => {
    if (err) {
      callback(err)
    } else {
      callback(null, ads);
    }
  });
}

function convertAllBds(callback, timeModifedFrom, timeModifiedTo) {
  let start = new Date().getTime();
  let condition = "";
  if (timeModifedFrom) {
    condition = `and timeModified >= '${timeModifedFrom}'`
  }
  if (timeModifiedTo) {
    condition = `${condition} and timeModified <= '${timeModifiedTo}'`
  }

  let sql = "select t.* from default t where type='Ads_Raw' and source = 'chotot' and meta.converted = false"
    + condition;

  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }

    let cnt = 0, cntChanged = 0, cntNew = 0, cntError=0;
    list.forEach(e => {
      convertChoTot(e, (err, ads) => {
        //mark as converted
        if (err) {
          Object.assign(e.meta, err);
        }
        e.meta.converted = true;
        commonService.upsert(e, (err, res) => {
          if (err) {
            console.error("Error during mark as converted!", err);
          }
        });

        if (err) {
          console.log("Done convert with error:" + (err.conversionError || "notByDuAn"));
          cnt++;
          cntError ++;
          return;
        }
        if (!ads) {
          console.log("No converted ADS");
          cnt++;
          cntError ++;
          return;
        }

        helper.upsertAdsIfChanged(ads, (res) => {
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
    });

    let end = new Date().getTime();
    logUtil.info("Done " + list.length + " in " + (end-start) + "ms");

    setInterval(() => {
      logUtil.info("Check count:", cnt, list.length);
      if (cnt == list.length) {
        logUtil.info("Number of new records: " + cntNew + ", number of changed records: " + cntChanged + ", cntError:" + cntError + ", total: " + cnt);
        callback();
      }
    }, 1000)

  });
}
//-----------------------------------------------------------
module.exports = {convertAllBds};
