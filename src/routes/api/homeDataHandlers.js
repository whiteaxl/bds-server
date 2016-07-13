'use strict';

var findHandler = require('./findHandler');
var services = require('../../lib/services');
var placeUtil = require('../../lib/placeUtil');
var danhMuc = require('../../lib/DanhMuc');
var utils = require('../../lib/utils');


var internals = {};

function convertListResult(list) {
  let result = list.map((e) => {
    return {
      adsID : e.adsID,
      giaFmt : e.giaFmt || undefined,
      dienTichFmt : e.dienTichFmt || undefined,
      khuVuc : e.place && e.place.diaChi ,
      soPhongNguFmt : e.soPhongNguFmt || undefined,
      soPhongTamFmt : e.soPhongTamFmt || undefined,
      cover : e.image.cover
    }
  });

  return result;
}

const defaultItemInCollection = {
  adsID : "EMPTY",
  giaFmt : " ",
  khuVuc : " ",
  soPhongNguFmt : " ",
  soPhongTamFmt : " ",
  dienTichFmt : " ",
  cover : "http://203.162.13.40:5000/web/asset/img/reland_house_large.jpg"
};

function appDefault(collection) {
  for (var i = collection.data.length ; i < 5; i ++) {
    collection.data.push(defaultItemInCollection);
  }

  return collection;
}

function doSearchAds(collections, title1, title2, queryToday, doneToday) {
  findHandler.searchAds(queryToday, (res) => {
    if (!res.list || res.list.length == 0) {
      doneToday(collections);
      return;
    }

    let todayColection = {
      title1 :title1 ,
      title2 : title2,
      data : convertListResult(res.list),
      query: queryToday
    };

    collections.push(appDefault(todayColection));

    doneToday(collections);
  });
}

function getGiaTrungBinh(lastQuery) {
  let giaBETWEEN = lastQuery.giaBETWEEN;

  if (giaBETWEEN && giaBETWEEN.length == 2) {
    return ((giaBETWEEN[0] + giaBETWEEN[1]) / 2).toFixed(2);
  }

  return danhMuc.BIG;
}

internals.homeData4App = function(req, reply) {
  //console.log(req);

  var query = req.payload.query;
  var lastQuery = {}; Object.assign(lastQuery, query);

  console.log(query);

  var currentLocation = req.payload.currentLocation;
  query.limit = 5;
  //todo: order ?

  services.getDiaChinhKhongDauByGeocode(currentLocation.lat, currentLocation.lon)
    .then((diaChinh) => {
      if (!diaChinh) {
        reply({status: 1, msg: 'Không xác định được vị trí hiện tại của bạn!'});
      }

      //if no history, defaul if current Tinh and loaiTin=BAN
      if (query.loaiTin == null || query.loaiTin == undefined) {
        query.loaiTin = 0;
        query.diaChinh = {
          tinh : diaChinh.tinh
        }
      }

      //Dang hom nay:
      var doneDuoiGia = (collections) => {
        reply({
          data : collections,
          status : 0,
          lastQuery
        });
      };

      var doneToday = (collections) => {
        let queryDuoiGia = {}; Object.assign(queryDuoiGia, query);
        let mid = getGiaTrungBinh(lastQuery);
        queryDuoiGia.giaBETWEEN = [0, mid];
        doSearchAds(collections,
          "Nhà có giá dưới " + utils.getPriceDisplay(mid, query.loaiTin),
          query.fullName || diaChinh.tinhCoDau,
          queryDuoiGia,
          doneDuoiGia
        )
      };

      var doneNearBy = (collections) => {
        let queryToday = {}; Object.assign(queryToday, query);
        queryToday.ngayDaDang = 7;
        doSearchAds(collections,
          "Nhà mới đăng",
          query.fullName || diaChinh.tinhCoDau,
          queryToday,
          doneToday
        )
      };

      //gan vi tri
      let queryNearBy = {}; Object.assign(queryNearBy, query);
      queryNearBy.diaChinh = diaChinh;

      let collections = [];
      doSearchAds(collections,
        "Nhà gần vị trí của bạn",
        diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau,
        queryNearBy,
        doneNearBy
      );
    });
};

module.exports = internals;