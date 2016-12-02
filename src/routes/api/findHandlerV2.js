'use strict';

var Boom = require('boom');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");

var AdsModel = require('../../dbservices/Ads');
var adsModel = new AdsModel();

var placeUtil = require("../../lib/placeUtil");
var dbCache = require("../../lib/DBCache");

var constant = require("../../lib/constant");
var moment = require("moment");
var geoUtil = require("../../lib/geoUtil");
var danhMuc = require("../../lib/DanhMuc");

var UserService = require('../../dbservices/User');
var userService = new UserService();

var cfg = require('../../config');
var _ = require("lodash");

var internals = {};

var geolib = require("geolib");

//const
var MAX_POLYGON_OR_CIRCLE_RESULT = 500000;
var POLYGON_BATCH_SIZE = 500000;

function prepareLatLon(coords) {
  let e;
 for (let i =0; i < coords.length; i++) {
   e = coords[i];
   e.lat = geolib.longitude(e);
   e.lon = geolib.longitude(e);
 }
}

function isPointInsideWithPreparedPolygon(point, coords) {
  var flgPointInside = false,
    y = geolib.longitude(point),
    x = geolib.latitude(point);

  for(var i = 0, j = coords.length-1; i < coords.length; i++) {

    if (coords[i].lon < y && coords[j].lon >=y ||
      coords[j].lon < y && coords[i].lon >= y) {

      flgPointInside^=(y*coords[i].multiple+coords[i].constant < x);
    }

    j=i;

  }

  return flgPointInside;
}

function _doPolygonOrCircleFilter(allAds, q) {
  let polygonCoords = null;
  if (q.polygonCoords) {
    polygonCoords = _.cloneDeep(q.polygonCoords);
    geolib.preparePolygonForIsPointInsideOptimized(polygonCoords);
    prepareLatLon(polygonCoords);
  }

  //
  let distance, ads;
  let filtered = []; //id only

  for (let i = 0; i < allAds.length; i++) {
    ads = allAds[i];
    let lat = ads.place.geo.lat;
    let lon = ads.place.geo.lon;
    let valid = true;

    //filter by radius
    if (q.circle) {
      let center = q.circle.center;
      distance = geoUtil.measure(center.lat, center.lon, lat, lon);
      if (distance > q.circle.radius * 1000) {
        valid = false;
      }
    }

    //filter by polygon
    if (valid && q.polygonCoords) {
      if (!isPointInsideWithPreparedPolygon({
          latitude : lat,
          longitude : lon,
        }, polygonCoords)) {
        valid = false;
      }
    }

    if (valid) {
      filtered.push(ads);
    }
  }

  return filtered;
}

function _transform(allAds, q) {
  let transformeds = allAds.map((ads) => {
    //images:
    var targetSize = "745x510"; //350x280

    let tmp = {
      adsID: ads.id,
      gia: ads.gia && !isNaN(ads.gia) ? ads.gia : Number(0),
      giaFmt: util.getPriceDisplay(ads.gia, ads.loaiTin),
      giaFmtForWeb: util.getPriceDisplay(ads.gia, ads.loaiTin, true),
      dienTich: ads.dienTich, dienTichFmt: util.getDienTichDisplay(ads.dienTich),
      soPhongNgu: ads.soPhongNgu,
      soPhongNguFmt: ads.soPhongNgu ? ads.soPhongNgu + "p.ngủ" : null,
      soTang: ads.soTang ,
      soTangFmt: ads.soTang ? ads.soTang + "tầng" : null,
      soPhongTam: ads.soPhongTam,
      soPhongTamFmt: ads.soPhongTam ? ads.soPhongTam + "p.tắm" : null,
      image: {
        cover: ads.image.cover ? ads.image.cover.replace("80x60", targetSize).replace("120x90", targetSize).replace("200x200", targetSize) : cfg.noCoverUrl,
        images: ads.image.images ? ads.image.images.map((e) => {
          return e.replace("80x60", targetSize).replace("120x90", targetSize).replace("200x200", targetSize);
        }) : [cfg.noCoverUrl]
      },
      diaChi: ads.place.diaChi,
      ngayDangTin: ads.ngayDangTin && !isNaN(ads.ngayDangTin) ? ads.ngayDangTin.toString() : "",
      giaM2: ads.giaM2,
      loaiNhaDat: ads.loaiNhaDat,
      loaiTin: ads.loaiTin,
      huongNha: ads.huongNha && !isNaN(ads.huongNha) ? ads.huongNha : Number(0),
      place : ads.place
    };
    //console.log(tmp.cover);

    //dummy for cover image
    if (tmp.image.cover && tmp.image.cover.indexOf("no-photo") > -1) {
      tmp.image.cover = cfg.noCoverUrl;
      //console.log("1"+tmp.image.cover);
    }

    if (tmp.ngayDangTin) {
      var ngayDangTinDate = moment(tmp.ngayDangTin, constant.FORMAT.DATE_IN_DB);
      tmp.soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');
    }

    return tmp;
  });

  return transformeds;
}

function _updateLastSearch(q) {
  userService.getUserByID(q.userID, function (err, res) {
    if (err || res.length == 0)
      console.log(err);
    else {
      var user = res[0];
      if(!user.lastSearch){
        user.lastSearch = [];
      }else if (user.lastSearch.length==10){
        user.lastSearch =  _(user.lastSearch).slice(1,user.lastSearch.length);                
      }
      user.lastSearch.push({
        time: moment().format('YYYYMMDD hh:mm:ss'),
        timeModified :  new Date().getTime(),
        query: q        
        }        
      );
      userService.upsert(user);
    }
  });
}

function _mergeViewportWithPolygonBox(q) {
  let polygon = q.polygon;

  if (!polygon || polygon.length < 2) {
    return;
  }

  let polygonCoords = polygon.map((e) => {
    return {latitude: e.lat, longitude: e.lon}
  });

  //store here for later use
  q.polygonCoords = polygonCoords;

  let box = geoUtil.getBoxOfPolygon(polygonCoords);
  _mergeViewportWithBox(q, box);
}

function _mergeViewportWithBox(q, box) {
  let viewport = q.viewport;

  if (viewport) { //merging, giao cua 2 viewport
    viewport.southwest.lat = Math.max(box.southwest.lat, viewport.southwest.lat);
    viewport.southwest.lon = Math.max(box.southwest.lon, viewport.southwest.lon);
    viewport.northeast.lat = Math.min(box.northeast.lat, viewport.northeast.lat);
    viewport.northeast.lon = Math.min(box.northeast.lon, viewport.northeast.lon);
  } else { //lay viewport la` hinh bao
    q.viewport = box;
  }
}

function _mergeViewportWithCircleBox(q) {
  let circle = q.circle;

  if (!circle) {
    return;
  }

  let box = geoUtil.getBoxOfCircle({lat:circle.center.lat, lon:circle.center.lon} , geoUtil.meter2degree(circle.radius));

  _mergeViewportWithBox(q, box);
}

function viewportTooLarge(vp) {
  let sw = vp.southwest;
  let ne = vp.northeast;

  let a = geoUtil.measure(sw.lat, sw.lon, sw.lat, ne.lon);
  let b = geoUtil.measure(sw.lat, sw.lon, ne.lat, sw.lon);

  let MAX = (20*1000) * (20*1000);

  let tooLarge = (a * b) > MAX;

  if (tooLarge) {
    logUtil.warn("Khu vu qua rong:" + (a/1000).toFixed(2) + " x " + (b/1000).toFixed(2) + ". Lon nhat cho phep la:" + MAX/(1000*1000) + "km2");
  }

  return tooLarge;
}

function _doPagingAndReply(q, reply, filtered) {
  let count = filtered.length;

  //no need sort
  /*
  let orderBy = q.orderBy || {"name": "ngayDangTin", "type":"DESC"};

  let startTime = new Date().getTime();
  filtered.sort((a, b) => {
    if (a[orderBy.name] > b[orderBy.name]) {
      return 1;
    }

    if (a[orderBy.name] < b[orderBy.name]) {
      return -1;
    }

    if (a.timeModified > b.timeModified) {
      return 1;
    }
    if (a.timeModified < b.timeModified) {
      return -1;
    }

    return 0;
  });
  let endTime = new Date().getTime();

  logUtil.info("Sorting time " + (endTime - startTime) + " ms for " + filtered.length + " records");
  */

  //do paging
  filtered = filtered.slice((q.pageNo-1)*q.limit, q.pageNo*q.limit);

  //
  count = count > MAX_POLYGON_OR_CIRCLE_RESULT ? MAX_POLYGON_OR_CIRCLE_RESULT : count;

  _transformAndReply(q, reply, null, filtered, count);

  /*
  return adsModel.getListAdsByIds(filtered, (err, listAds) => {
    _transformAndReply(q, reply, err, listAds, count);
  });
  */
}

function _doQueryAllIntoMemory(q, reply, allResults) {

  let startTime = new Date().getTime();
  dbCache.query(q, (err, listAds) => {
    if (err) {
      console.log("Error when query ADS:", err);
      reply(Boom.badImplementation());
      return;
    }

    listAds = listAds || [];

    let endTime = new Date().getTime();
    logUtil.info("Time to do one round of query:" + (endTime-startTime) + "ms" + " for "  + (listAds.length) + " records");

    if (listAds.length == 0) {
      return _doPagingAndReply(q, reply, allResults);
    }

    let filtered = _doPolygonOrCircleFilter(listAds, q);
    allResults = allResults.concat(filtered);

    let endTime3 = new Date().getTime();
    logUtil.info("Time to do geo filter:" + (endTime3-endTime) + "ms" + ", new length:"  + (allResults.length) + " records");

    if (allResults.length >= MAX_POLYGON_OR_CIRCLE_RESULT) {
      //allResults = allResults.slice(0, MAX_POLYGON_OR_CIRCLE_RESULT);
      return _doPagingAndReply(q, reply, allResults);
    }

    if (listAds.length < POLYGON_BATCH_SIZE) {
      return _doPagingAndReply(q, reply, allResults);
    }

    //fetch next batch
    q.dbPageNo++;
    _doQueryAllIntoMemory(q, reply, allResults);

  }, null);
}

function _transformAndReply(q, reply, err, filtered, count) {
  if (err) {
    console.log("Error when query ADS:", err);
    if (q.userID && q.updateLastSearch==true && count > 0) {
      //console.log(JSON.stringify(q));
      _updateLastSearch(q);
    }
    reply(Boom.badImplementation());
    return;
  }

  //let endTime = new Date().getTime();
  //logUtil.info("Time todo filter/count:" + (endTime-startTime) + "ms" + " for "  + (filtered.length) + " records");

  let transformed = _transform(filtered, q);

  reply({
    length: transformed.length,
    list: transformed,
    totalCount : q.isIncludeCountInResponse ? count : null
  });
}

function _doDBQueryAndCount(q, reply) {
  dbCache.query(q, (err, listAds, count) => {
    if (err) {
      console.log("Error when query ADS:", err);
      reply(Boom.badImplementation());
      return;
    }

    if (q.isIncludeCountInResponse) {
      if (count || count === 0 ) {
        _transformAndReply(q, reply, err, listAds, count);
      } else {
        adsModel.count(q, (err, cnt) => {
          _transformAndReply(q, reply, err, listAds, cnt);
        });
      }
    } else {
      _transformAndReply(q, reply, null, listAds, undefined);
    }
  });
}

internals.findAds = function (q, reply) {
  if (q.userID && q.updateLastSearch) {
    _updateLastSearch(q);
  }
  _mergeViewportWithPolygonBox(q);
  _mergeViewportWithCircleBox(q);

  //not allow viewport more than 50km
  if (q.viewport && viewportTooLarge(q.viewport)) {
    reply({
      length: 0,
      list: [],
      totalCount : 0,
      errMsg : "Khu vực tìm kiếm quá rộng, bạn cần zoom bé lại!"
    });

    return;
  }

  let needFilterInMemory = q.circle || q.polygon;
  //if no needFilterInMemory
  if (!needFilterInMemory) {
    console.log("------------------------_doDBQueryAndCount---------------");
    q.dbLimit = q.limit;
    q.dbPageNo =  q.pageNo;
    q.dbOrderBy = q.orderBy || {"name": "ngayDangTin", "type":"DESC"};

    _doDBQueryAndCount(q, reply);
  } else {
    console.log("------------------------_doQueryAllIntoMemory---------------");
    //can't get count from db incase search by Circle or Polygon, so need get all from DB
    //search for homepage
    if (q.limit==5) {
      q.dbLimit =  100; //4 are enough to filter later
      q.dbPageNo =  null;
    } else {
      q.dbLimit =  POLYGON_BATCH_SIZE; // limit 1000 results when search in a poylygon or circle
      q.dbPageNo =  1;
    }

    q.dbOrderBy = null; //no need orderBy, will do it in memory for only first 1000 result
    _doQueryAllIntoMemory(q, reply, []);
  }
};

internals.find = function (req, reply) {
  console.log("Find v2:", req.payload);
    internals.findAds(req.payload, (res) => {
      logUtil.info("Will response to client:" + res.length + " out of " + res.totalCount + ", res.errMsg=" +  res.errMsg );
      reply(res);
    })

};

internals.getProductPricing = function (req, reply) {
  console.log("Get Product Pricing:", req.payload);
  let q = req.payload;

  let box = geoUtil.getBoxOfCircle({lat:q.position.lat, lon:q.position.lon} , geoUtil.meter2degree(0.5));

  _mergeViewportWithBox(q, box);

  q.giaBETWEEN = [1.1, 9999999];
  q.duAnKhongDau = q.codeDuAn;
  if (q.codeDuAn){
    q.diaChinh= {duAnKhongDau: q.codeDuAn};
  }
  q.dbLimit = 500;
  q.dbPageNo =  1;
  q.dbOrderBy = q.orderBy || {"name": "ngayDangTin", "type":"DESC"};

  let inputLoaiNhaDat = q.loaiNhaDat[0];

  let loaiNhaDat = [q.loaiNhaDat];
  let giaTrungBinh = []

  if (q.loaiTin == 0) {
    q.loaiNhaDat = [1, 2, 3, 4];
    giaTrungBinh = [
      {loaiNhaDat: 1, loaiNhaDatVal: "Bán căn hộ chung cư", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 2, loaiNhaDatVal: "Bán nhà riêng", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 3, loaiNhaDatVal: "Bán biệt thự, liền kề", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 4, loaiNhaDatVal: "Bán nhà mặt phố", giaM2:0, giaM2TrungBinh: 0, count: 0}
    ]

  }
  else {
    q.loaiNhaDat = [1, 2, 3, 4, 5, 6];
    giaTrungBinh = [
      {loaiNhaDat: 1, loaiNhaDatVal: "Cho Thuê căn hộ chung cư", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 2, loaiNhaDatVal: "Cho Thuê nhà riêng", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 3, loaiNhaDatVal: "Cho Thuê nhà mặt phố", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 4, loaiNhaDatVal: "Cho Thuê nhà trọ, phòng trọ", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 5, loaiNhaDatVal: "Cho Thuê văn phòng", giaM2:0, giaM2TrungBinh: 0, count: 0},
      {loaiNhaDat: 6, loaiNhaDatVal: "Cho Thuê cửa hàng, ki-ốt", giaM2:0, giaM2TrungBinh: 0, count: 0}
    ]
  }

  dbCache.query(q, (err, listAds, count) => {
    if (err) {
      console.log("Error when query ADS:", err);
      reply({success: false, msg: err});
      return;
    }
    let giaM2 = 0;
    let giaM2TrungBinh = 0;
    let adsNgangGia = [];
    let giaTrungBinhKhac = [];
    let pricing = {}

    if (listAds && listAds.length>0){
      for( var i=0; i< listAds.length; i++){
        giaTrungBinh[listAds[i].loaiNhaDat-1].giaM2 += listAds[i].giaM2;
        giaTrungBinh[listAds[i].loaiNhaDat-1].count += 1;
      }

      for (var h=0; h< giaTrungBinh.length; h++){
        if (giaTrungBinh[h].count>=3){
          giaTrungBinh[h].giaM2TrungBinh = giaTrungBinh[h].giaM2/giaTrungBinh[h].count;
          giaTrungBinh[h].giaM2 = undefined; // remove giaM2
          if (giaTrungBinh[h].loaiNhaDat == inputLoaiNhaDat){
            pricing = giaTrungBinh[h];
          } else {
            giaTrungBinhKhac.push(giaTrungBinh[h]);
          }
        }
      }

      if (pricing != {}){
        let numOfReturnAds = 1;
        for( var i=0; i< listAds.length; i++){
          if (listAds[i].loaiNhaDat == inputLoaiNhaDat){
            adsNgangGia.push(listAds[i]);
            if (numOfReturnAds >= 5)
              break;
            numOfReturnAds = numOfReturnAds + 1;
          }
        }
      }
    }

    let res = {
      success: true,
      data: {
        radius: 500,
        giaTrungBinh: pricing.count && pricing.count>=3 ? pricing : undefined,
        giaTrungBinhKhac: giaTrungBinhKhac,
        bdsNgangGia: pricing != {} ? _transform(adsNgangGia) : undefined
      }
    }

    reply(res);
  });


};

internals.count = function (req, reply) {
  let q = req.payload;
  try {
    let needFilterInMemory = q.circle || q.polygon;

    _mergeViewportWithPolygonBox(q);
    _mergeViewportWithCircleBox(q);

    //can't get count from db incase search by Circle or Polygon, so need get all from DB
    if (needFilterInMemory) {
      q.dbLimit =  null;
      q.dbPageNo =  null;

      adsModel.query(q, (err, listAds) => {
        if (err) {
          reply(Boom.badImplementation());
        }
        let filtered = _handleDBFindResult(err, listAds, q);
        logUtil.info("There are " + filtered.length + " ads");
        reply({
          countResult : filtered.length
        });
      });
    } else {
      q.dbLimit = q.limit;
      q.dbPageNo =  q.pageNo;

      adsModel.count(q, (err, cnt) => {
        if (err) {
          logUtil.error("Error", err);
          reply(Boom.badImplementation());
          return;
        }

        reply({
          countResult : cnt,
        })
      });
    }
  } catch (e) {
    logUtil.error(e);
    reply(Boom.badImplementation());
  }
};

module.exports = internals;
