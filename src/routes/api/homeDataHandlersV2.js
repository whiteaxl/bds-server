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

var DuAnService = require('../../dbservices/DuAn');
var duAnService = new DuAnService();


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
  cover: "http://203.162.13.40:5000/web/asset/img/reland_house_large.jpg"
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
  console.log("searchAds" + JSON.stringify(query));
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

function generateSearchNgangGiaFn(query,diaChinh){
  let results = [];
  let loaiNhaDat = [];
  let loaiTin = query.loaiTin;
  if(!diaChinh)
    diaChinh = {};
  if(loaiTin ==0){
    loaiNhaDat = [1,2,3,4,7,5];
  }else if(loaiTin==1){
    loaiNhaDat = [1,2,3,4];
  }
  
  _(loaiNhaDat).forEach(function(value) {
    // console.log("tim log loaiNhaDat" + value);
    results.push(function(callback){
      let queryNgangGia = {}; Object.assign(queryNgangGia, query);
      let loaiNhaDatName = danhMuc.getLoaiNhaDatForDisplayNew(loaiTin,value);
      let giaDisplay = " ngang giá";
      if(!queryNgangGia.giaBETWEEN || (queryNgangGia.giaBETWEEN[0]==0 && queryNgangGia.giaBETWEEN[1]> 99999)){
        queryNgangGia.giaBETWEEN = [];
        queryNgangGia.giaBETWEEN[0] = [0];
        queryNgangGia.giaBETWEEN[1] = 5000;
        if(loaiTin==0){
          if(value == 1 || value ==2 || value ==5 || value ==7){
            loaiNhaDatName = loaiNhaDatName + " dưới 5 tỷ";
          }else{
            loaiNhaDatName = loaiNhaDatName + " dưới 20 tỷ";    
          }
        }else if(loaiTin == 1){
          if(value == 4){
            loaiNhaDatName = loaiNhaDatName + " dưới 5 triệu";
          }else{
            loaiNhaDatName = loaiNhaDatName + " dưới 20 triệu";    
          }
        }
        
      }else{
        loaiNhaDatName = loaiNhaDatName + " ngang giá";
      }
      queryNgangGia.ngayDaDang = 700;  
      queryNgangGia.orderBy = {name:"ngayDangTin", type: "DESC"};
      queryNgangGia.loaiNhaDat = [value];
      searchAds(loaiNhaDatName   ,diaChinh?diaChinh.fullName:"",queryNgangGia,callback);

    });
    // console.log("tim log " + results[0]);
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

  var currentLocation = req.payload.currentLocation;
  if (!currentLocation)
    currentLocation = {};

  query.limit = 5;
  query.pageNo = 1;
  query.loaiTin = query.loaiTin ? query.loaiTin : 0;
  let ngayDangTinBegin = moment().subtract(2800, 'days').format('YYYYMMDD');
  query.isIncludeCountInResponse = false; //no need count
  query.ngayDangTinGREATER = ngayDangTinBegin;
  //todo: order ?

  var lastQuery = undefined;
  if(query){
    lastQuery = {};
    Object.assign(lastQuery, query);
  }

  services.getDiaChinhKhongDauByGeocode(currentLocation.lat, currentLocation.lon)
    .then((diaChinh) => {

      var async = require("async");
      var fl = [];
      

      if(diaChinh){
        fl.push(function (callback) {
          let queryNearBy = {};
          Object.assign(queryNearBy, query);

          queryNearBy.diaChinh = {
            fullName : diaChinh.fullName,
            tinhKhongDau : diaChinh.tinh,
            huyenKhongDau : diaChinh.huyen,
            xaKhongDau: diaChinh.xa || undefined
          };
          console.log("nha gan vi tri " + JSON.stringify(queryNearBy));
          searchAds("Nhà Gần Vị Trí Bạn", diaChinh.fullName, queryNearBy, callback);
        });
      } else {
        if(lastQuery){
          fl.push(
            function (callback) {
              let queryMoiDang = {};
              Object.assign(queryMoiDang, query);
              queryMoiDang.orderBy = {
                name: "ngayDangTin",
                type: "DESC"
              };
              searchAds("Nhà Mới Đăng", query.diaChinh?(query.diaChinh.fullName):query.fullName, queryMoiDang, callback);
            }
          );
          if(lastQuery.giaBETWEEN && !(lastQuery.giaBETWEEN[0] ==0 && lastQuery.giaBETWEEN[1] > 999999)){
            
          }
          let ngangGiaFl = generateSearchNgangGiaFn(lastQuery,query.diaChinh); 
          fl = _.concat(fl,ngangGiaFl);
          // console.log("tim log bc " + ngangGiaFl[1]);
        }else{
          console.log("tim log not have last query")
        }

      }




      // if (!diaChinh) { // not know current location
      //   //diaChinh = lastQuery
      //   // need to get diaChinh from lastQuery
      //   if (lastQuery) {
      //     fl.push(
      //       function (callback) {
      //         let queryMoiDang = {};
      //         Object.assign(queryMoiDang, query);
      //         queryMoiDang.ngayDangTinGREATER = ngayDangTinBegin;
      //         queryMoiDang.orderBy = {
      //           name: "ngayDangTin",
      //           type: "DESC"
      //         };
      //         searchAds("Nhà Mới Đăng Hôm Nay", query.fullName, queryMoiDang, callback);
      //       }
      //     );
      //     async.series(fl,
      //       function (err, results) {
      //         reply({
      //           data: results,
      //           status: 0,
      //           lastQuery
      //         });
      //       }
      //     );
      //     return;
      //   }
      //   //reply({status: 1, msg: 'Không xác định được vị trí hiện tại của bạn!'});
      // } else{
      //   fl.push(function (callback) {
      //     let queryNearBy = {};
      //     Object.assign(queryNearBy, query);

      //     queryNearBy.diaChinh = {
      //       fullName : diaChinh.xaCoDau ? diaChinh.xaCoDau + ", " + diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau :
      //                                     diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau,
      //       tinhKhongDau : diaChinh.tinh,
      //       huyenKhongDau : diaChinh.huyen,
      //       xaKhongDau: diaChinh.xa || undefined
      //     };
      //     console.log("nha gan vi tri " + JSON.stringify(queryNearBy));
      //     searchAds("Nhà Gần Vị Trí Bạn", diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau, queryNearBy, callback);
      //   });
      // }

      fl.push(
        function (callback) {
          let queryMoiDang = {};
          Object.assign(queryMoiDang, query);          
          queryMoiDang.orderBy = {
            name: "ngayDangTin",
            type: "DESC"
          };

          searchAds("Nhà Mới Đăng", query.fullName || diaChinh.huyen + ", " + diaChinh.tinh, queryMoiDang, callback);
        }
      );

      /*if (lastQuery && lastQuery.giaBETWEEN) {
        fl.push(
          function (callback) {
            let queryDuoiGia = {};
            Object.assign(queryDuoiGia, query);
            let mid = getGiaTrungBinh(lastQuery);
            searchAds("Nhà Có Giá Dưới " + mid, diaChinh.huyenCoDau + ", " + diaChinh.tinhCoDau, queryDuoiGia, callback);
          }
        );
      }*/

      //if no history, defaul if current Tinh and loaiTin=BAN
      /*if (query.loaiTin == null || query.loaiTin == undefined) {
        query.loaiTin = 0;
        query.diaChinh = {
          tinhKhongDau: diaChinh.tinhKhongDau
        }
      }

      var q = {
        limit: 3,
        tinhKhongDau: diaChinh.tinhKhongDau,
        huyenKhongDau: diaChinh.huyenKhongDau,
        orderBy: {
          name: "soTinDang",
          type: "DESC"
        }
      };

      duAnService.findDuAn(q, function (err, res) {
        if (err || res.length <= 0) {
          async.series(fl,
            function (err, results) {
              console.log("Response1: ", results[0].data);
              results.msg = err;
              reply({
                data: results,
                status: 0,
                lastQuery
              });
            }
          );
        } else {
          for (var i = 0; i < res.length; i++) {
            let queryDuAn = {};
            Object.assign(queryDuAn, query);
            queryDuAn.duAnID = res[i].duAnID;
            let title2 = res[i].ten;
            var f = function (callback) {
              searchAds("Nhà Thuộc Dự Án Nổi Bật", title2, queryDuAn, callback);
            };
            fl.push(f);
          }
          async.series(fl,
            function (err, results) {
              console.log("Response: ", results);

              reply({
                data: results,
                status: 0,
                lastQuery
              });
            }
          );
        }
      });


      /*var q = {
       //level: 1,
       limit: 3,
       tinhKhongDau: diaChinh.tinhKhongDau,
       huyenKhongDau: diaChinh.huyenKhongDau
       }

       duAnNoiBatService.findDuAnNoiBat(q,function(err,res){
       if(err || res.length<=0){
       result.msg = err;
       async.series(fl,
       function(err, results){
       reply({
       data : results,
       status : 0,
       lastQuery
       });
       }
       );
       }else{
       for(var i=0;i<res.length;i++){
       let queryDuAn = {}; Object.assign(queryDuAn, query);
       queryDuAn.duAnId = res[i].duAnId;
       let title2 = res[i].tenDuAn;
       var f = function(callback){
       searchAds("Nhà thuộc dự án nổi bật",title2,queryDuAn,callback);
       }
       fl.push(f);
       }
       async.series(fl,
       function(err, results){
       reply({
       data : results,
       status : 0,
       lastQuery
       });
       }
       );
       }
       });
       */

      async.series(fl,
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