'use strict';

var findHandlerV2 = require('./findHandlerV2');
var services = require('../../lib/services');
var placeUtil = require('../../lib/placeUtil');
var danhMuc = require('../../lib/DanhMuc');
var utils = require('../../lib/utils');
var cfg = require('../../config');
var _ = require("lodash");

var DuAnNoiBatService = require('../../dbservices/DuAnNoiBat');
var duAnNoiBatService = new DuAnNoiBatService();

var moment = require('moment');

var internals = {};

function convertListResult(list) {
  let result = list.map((e) => {
    let cover = e.image.cover || cfg.noCoverUrl;
    if (cover == '/web/asset/img/reland_house_large.jpg') {
      cover = cfg.noCoverUrl
    }

    return {
      adsID: e.adsID,
      loaiTin: e.loaiTin,
      loaiNhaDat: e.loaiNhaDat,
      giaFmt: e.giaFmt || undefined,
      dienTichFmt: e.dienTichFmt || undefined,
      khuVuc: e.place.diaChinh.huyen ?   e.place.diaChinh.huyen + ", " + e.place.diaChinh.tinh : e.place.diaChinh.tinh,
      soPhongNguFmt: e.soPhongNguFmt || undefined,
      soPhongTamFmt: e.soPhongTamFmt || undefined,
      cover: cover
    }
  });

  return result;
}

const defaultItemInCollection = {
  adsID: "EMPTY",
  giaFmt: " ",
  khuVuc: " ",
  soPhongNguFmt: " ",
  soPhongTamFmt: " ",
  dienTichFmt: " ",
  cover: "http://203.162.13.177:5000/web/asset/img/reland_house_large.jpg"
};

function appDefault(collection) {
  for (var i = collection.data.length; i < 5; i++) {
    collection.data.push(defaultItemInCollection);
  }

  return collection;
}

function doSearchAds(collections, title1, title2, queryToday, doneToday) {
  findHandler.searchAdsWithFilter(queryToday, (res) => {
    if (!res.list || res.list.length == 0) {
      doneToday(collections);
      return;
    }

    let todayColection = {
      title1: title1,
      title2: title2,
      data: convertListResult(res.list),
      query: queryToday
    };

    collections.push(appDefault(todayColection));

    doneToday(collections);
  });
}


function searchAds(title1, title2, query, callback) {
  console.log("searchAds: " + title1, JSON.stringify(query));
  var origQuery = {}; Object.assign(origQuery, query);

  findHandlerV2.findAds(query, (res) => {
    
    if (!res.list || res.list.length == 0) {
        callback(null
        , {
          title1: title1,
          title2: title2,
          data: [],
          query: origQuery
        });

      return;
    }
    let collection = {
      title1: title1,
      title2: title2,
      data: convertListResult(res.list),
      query: origQuery
    };
    appDefault(collection);
    callback(null, collection);
  });
}

function generateSearchNgangGiaFn(query, diaChinh){
  let results = [];
  let loaiNhaDat = [];
  let loaiTin = query.loaiTin;
  let loaiNhaDatLastSearch = query.loaiNhaDat;
  if(!diaChinh)
    diaChinh = {};

  if(loaiTin == 0){
    loaiNhaDat = [1,2,3,4,5,6];
  }else if(loaiTin == 1){
    loaiNhaDat = [1,2,3,4];
  }

  if (loaiNhaDatLastSearch && loaiNhaDatLastSearch.length >= 1)
    loaiNhaDat = loaiNhaDat.filter(x => loaiNhaDatLastSearch.indexOf(x) == -1);
  
  _(loaiNhaDat).forEach(function(value) {
    results.push(function(callback){
      //let queryNgangGia = {}; Object.assign(queryNgangGia, query);
      let  queryNgangGia = JSON.parse(JSON.stringify(query));

      let loaiNhaDatName = danhMuc.getLoaiNhaDatForDisplayNew(loaiTin,value);
      
      if(!queryNgangGia.giaBETWEEN || (queryNgangGia.giaBETWEEN[0]<=-1 && queryNgangGia.giaBETWEEN[1]> 99999)){
        queryNgangGia.giaBETWEEN = [];

        if(loaiTin==0){
          if(value == 1 || value ==2 || value ==5 || value ==6){
            loaiNhaDatName = loaiNhaDatName + " dưới 5 tỷ";
            queryNgangGia.giaBETWEEN[0] = 0;
            queryNgangGia.giaBETWEEN[1] = 5000;
          }else{
            loaiNhaDatName = loaiNhaDatName + " dưới 20 tỷ";
            queryNgangGia.giaBETWEEN[0] = 0;
            queryNgangGia.giaBETWEEN[1] = 20000;
          }
        } else if (loaiTin == 1){
          if(value == 4){
            loaiNhaDatName = loaiNhaDatName + " dưới 5 triệu";
            queryNgangGia.giaBETWEEN[0] = 0;
            queryNgangGia.giaBETWEEN[1] = 5;
          }else{
            loaiNhaDatName = loaiNhaDatName + " dưới 20 triệu";
            queryNgangGia.giaBETWEEN[0] = 0;
            queryNgangGia.giaBETWEEN[1] = 20;
          }
        }
        
      } else {
        loaiNhaDatName = loaiNhaDatName + " ngang giá";
      }
      loaiNhaDatName = loaiNhaDatName.replace("Cho Thuê ", "").replace("Bán ","");
      loaiNhaDatName = utils.upperFirstCharacter(loaiNhaDatName);

      queryNgangGia.loaiNhaDat = [value];
      //queryNgangGia.orderBy = {name:"ngayDangTin", type: "DESC"};
      queryNgangGia.orderBy = undefined;

      // reset search conditions
      queryNgangGia.soPhongNguGREATER = 0;
      queryNgangGia.soPhongTamGREATER = 0;
      queryNgangGia.huongNha = [0];
      queryNgangGia.dienTichBETWEEN = [-1,9999999];

      searchAds(loaiNhaDatName, query.diaChinh ? query.diaChinh.fullName : query.fullName, queryNgangGia, callback);

    });
  });
  
  return results;

}

function generateSearchDefaultFn(diaChinh){
    let results = [];
    let loaiNhaDat = [1,2,3,4,6,5];

    let diaChinhpr = {
        fullName : diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau,
        tinhKhongDau : diaChinh.tinh,
        huyenKhongDau : diaChinh.huyen
    };

    _(loaiNhaDat).forEach(function(value) {
        results.push(function(callback){
            let  queryNgangGia = {};
            queryNgangGia.loaiTin = 0
            queryNgangGia.diaChinh = diaChinhpr;

            let loaiNhaDatName = danhMuc.getLoaiNhaDatForDisplayNew(loaiTin,value);

            if(value == 1 || value ==2 || value ==5){
                loaiNhaDatName = loaiNhaDatName + " giá 2-5 tỷ";
                queryNgangGia.giaBETWEEN = [];
                queryNgangGia.giaBETWEEN[0] = 2000;
                queryNgangGia.giaBETWEEN[1] = 5000;
            }

            if(value == 6) {
                loaiNhaDatName = loaiNhaDatName + " giá 1-3 tỷ";
                queryNgangGia.giaBETWEEN = [];
                queryNgangGia.giaBETWEEN[0] = 1000;
                queryNgangGia.giaBETWEEN[1] = 3000;
            }

            if(value == 3 || value==4) {
                loaiNhaDatName = loaiNhaDatName + " giá 10-20 tỷ";
                queryNgangGia.giaBETWEEN = [];
                queryNgangGia.giaBETWEEN[0] = 10000;
                queryNgangGia.giaBETWEEN[1] = 20000;
            }

            loaiNhaDatName = loaiNhaDatName.replace("Cho Thuê ", "").replace("Bán ","");
            loaiNhaDatName = utils.upperFirstCharacter(loaiNhaDatName);

            queryNgangGia.loaiNhaDat = [value];
            queryNgangGia.orderBy = {name:"ngayDangTin", type: "DESC"};

            // reset search conditions
            queryNgangGia.soPhongNguGREATER = 0;
            queryNgangGia.soPhongTamGREATER = 0;
            queryNgangGia.huongNha = [0];
            queryNgangGia.dienTichBETWEEN = [-1,9999999];

            searchAds(loaiNhaDatName, diaChinhpr.fullName, queryNgangGia, callback);

        });
    });

    return results;

}


function getGiaTrungBinh(lastQuery) {
  let giaBETWEEN = lastQuery.giaBETWEEN;

  if (giaBETWEEN && giaBETWEEN.length == 2) {
    return ((giaBETWEEN[0] + giaBETWEEN[1]) / 2).toFixed(2);
  }

  return danhMuc.BIG;
}

internals.homeData4App = function (req, reply) {
  //console.log(req);

  var query = req.payload.query;

  console.log("homeData4App V2 " + JSON.stringify(query));

  var lastQuery = undefined;

  if(query && Object.keys(query).length>0){
      query.limit = 5;
      query.pageNo = 1;
      query.loaiTin = query.loaiTin ? query.loaiTin : 0;
      query.viewport = undefined;
      query.polygon = (query.polygon && query.polygon.length >=2) ? query.polygon : undefined;
      query.isIncludeCountInResponse = false; //no need count

      lastQuery = {};
      Object.assign(lastQuery, query);
  }
  

  console.log("homeData4App V2 " + JSON.stringify(req.payload));

  var currentLocation = req.payload.currentLocation;
  if (!currentLocation)
    currentLocation = {};

  let ngayDangTinBegin = moment().subtract(7, 'days').format('YYYYMMDD');

  //todo: order ?


  services.getDiaChinhKhongDauByGeocode(currentLocation.lat, currentLocation.lon)
    .then((diaChinh) => {
      var async = require("async");
      var fl = [];

      /*
      if(diaChinh){
        query.diaChinh = {
          fullName : diaChinh.xaCoDau ? diaChinh.xaCoDau + ", " + diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau :
                                                   diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau,
          tinhKhongDau : diaChinh.tinh,
          huyenKhongDau : diaChinh.huyen
        };

        fl.push(function (callback) {
          let queryNearBy = {};
          Object.assign(queryNearBy, query);

          queryNearBy.diaChinh.xaKhongDau = diaChinh.xa || undefined;

          searchAds("Nhà Gần Vị Trí Bạn", query.diaChinh.fullName, queryNearBy, callback);
        });
      }
      */

      if(lastQuery){
        fl.push(
          function (callback) {
            let queryMoiDang = JSON.parse(JSON.stringify(lastQuery));
            //Object.assign(queryMoiDang, lastQuery);

            queryMoiDang.ngayDangTinGREATER = ngayDangTinBegin;
            //queryMoiDang.orderBy = {name: "ngayDangTin", type: "DESC"};
            queryNgangGia.orderBy = undefined;

            searchAds("Nhà Mới Đăng", lastQuery.diaChinh ? lastQuery.diaChinh.fullName : lastQuery.fullName, queryMoiDang, callback);
          }
        );

        fl.push(
            function (callback) {
              let queryDuoiGia = {};
              Object.assign(queryDuoiGia, lastQuery);

              let mid = 0;

              if (lastQuery.giaBETWEEN && lastQuery.giaBETWEEN[0] >= 0 && lastQuery.giaBETWEEN[1] < 999999) {
                mid = getGiaTrungBinh(lastQuery);
              } else {
                mid = lastQuery.loaiTin==0 ? 5000 : 20;
              }

              queryDuoiGia.giaBETWEEN = [lastQuery.giaBETWEEN[0], mid];
              queryNgangGia.orderBy = undefined;

              let giaFmt = utils.getPriceDisplay(mid, lastQuery.loaiTin);
              searchAds("Nhà Có Giá Dưới " + giaFmt, lastQuery.diaChinh ? lastQuery.diaChinh.fullName :lastQuery.fullName, queryDuoiGia, callback);
            }
        );

        let ngangGiaFl = generateSearchNgangGiaFn(lastQuery, lastQuery.diaChinh);
        fl = _.concat(fl,ngangGiaFl);

      } else {
        console.log("tim log not have last query");
        query = {};
        query.limit = 5;
        query.pageNo = 1;
        query.loaiTin = 0;
        query.viewport = undefined;
        query.polygon = undefined;
        query.isIncludeCountInResponse = false; //no need count

        /*if (diaChinh) {
            // truong hop search lan dau va co dia chinh cua current location
            let defaultFl = generateSearchDefaultFn(diaChinh);
            fl = _.concat(fl, ngangGiaFl);
        } else {*/
            // truong hop ko tim duoc dia chinh cua current location thi hien thi 1 Category: Nha moi dang
            fl.push(
                function (callback) {
                    let queryMoiDang = JSON.parse(JSON.stringify(query));
                    //Object.assign(queryMoiDang, query);
                    queryMoiDang.ngayDangTinGREATER = ngayDangTinBegin;
                    //queryMoiDang.orderBy = {name: "ngayDangTin", type: "DESC"};
                    queryMoiDang.orderBy = undefined;

                    searchAds("Nhà Mới Đăng", "", queryMoiDang, callback);
                }
            );
        //}

      }

      async.parallel(fl,
          function(err, results){
            reply({
              data : results,
              status : 0,
              lastQuery
            });
          }
      );
    });
};

module.exports = internals;