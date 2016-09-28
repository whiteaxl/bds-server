'use strict';

var Boom = require('boom');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");

var AdsModel = require('../../dbservices/Ads');
var adsModel = new AdsModel();

var placeUtil = require("../../lib/placeUtil");

var constant = require("../../lib/constant");
var moment = require("moment");
var geoUtil = require("../../lib/geoUtil");

var UserService = require('../../dbservices/User');
var userService = new UserService();

var cfg = require('../../config');
var _ = require("lodash");

var internals = {};

function _handleDBFindResult(error, allAds, q) {
  let transformeds = [];

  allAds.forEach((ads) => {
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
        cover: ads.image.cover ? ads.image.cover.replace("80x60", targetSize).replace("120x90", targetSize) : cfg.noCoverUrl,
        images: ads.image.images ? ads.image.images.map((e) => {
          return e.replace("80x60", targetSize);
        }) : [cfg.noCoverUrl]
      },
      diaChi: ads.place.diaChi,
      ngayDangTin: ads.ngayDangTin && !isNaN(ads.ngayDangTin) ? ads.ngayDangTin.toString() : "",
      giaM2: ads.giaM2,
      loaiNhaDat: ads.loaiNhaDat,
      loaiTin: ads.loaiTin,
      huongNha: ads.huongNha && !isNaN(ads.huongNha) ? ads.huongNha : Number(0)
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

    let place = ads.place;
    tmp.place = ads.place;
    let valid = true;

    //filter by radius
    if (q.circle) {
      let center = q.circle.center;
      tmp.distance = geoUtil.measure(center.lat, center.lon, place.geo.lat, place.geo.lon);
      if (tmp.distance > q.circle.radius * 1000) {
        valid = false;
      }
    }

    //filter by polygon
    if (valid && q.polygonCoords) {
      if (!geoUtil.isPointInside(place.geo, q.polygonCoords)) {
        valid = false;
      }
    }

    if (valid) {
      transformeds.push(tmp);
    }
  });

  return transformeds;
}

function _updateLastSearch(q) {
  userService.getUserByID(q.userID, function (err, res) {
    if (err || res.length == 0)
      console.log(err);
    else {
      console.log(JSON.stringify(res));
      var user = res[0];
      if(!user.lastSearch){
        user.lastSearch = [];
      }else if (user.lastSearch.length==2){
        user.lastSearch =  _(user.lastSearch).slice(1,user.lastSearch.length);                
      }
      user.lastSearch.push({
        time: moment().format('YYYYMMDD hh:mm:ss'),
        query: q        
        }        
      );
      console.log("tim log " + JSON.stringify(user.lastSearch));
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

internals.findAds = function (q, reply) {
  if (q.userID && q.updateLastSearch) {
    //console.log(JSON.stringify(q));
    _updateLastSearch(q);
  }
  let needFilterInMemory = q.circle || q.polygon;

  _mergeViewportWithPolygonBox(q);
  _mergeViewportWithCircleBox(q);

  //can't get count from db incase search by Circle or Polygon, so need get all from DB
  if (needFilterInMemory) {
    q.dbLimit =  null;
    q.dbPageNo =  null;
  } else {
    q.dbLimit = q.limit;
    q.dbPageNo =  q.pageNo;
  }

  adsModel.query(q, (err, listAds) => {
    if (err) {
      console.log("Error when query ADS:", err);

      reply(Boom.badImplementation());
      return;
    }
    let filtered = _handleDBFindResult(err, listAds, q);

    logUtil.info("There are " + filtered.length + " ads");
    let totalCount = filtered.length;

    if (needFilterInMemory) {
      filtered = filtered.slice((q.pageNo-1)*q.limit, q.pageNo*q.limit);
    } else { //need perform count stmt
      if (q.isIncludeCountInResponse) {
        adsModel.count(q, (err, cnt) => {
          if (err) {
            logUtil.error("Error", err);
            reply(Boom.badImplementation());
            return;
          }

          reply({
            length: filtered.length,
            list: filtered,
            totalCount : cnt,
          });
        });

        return;
      }
    }

    reply({
      length: filtered.length,
      list: filtered,
      totalCount : q.isIncludeCountInResponse ? totalCount : null
    });
  });
};

internals.find = function (req, reply) {
  console.log("Find v2:", req.payload);
    internals.findAds(req.payload, (res) => {
      //logUtil.info("Will resonse:", res);
      reply(res);
    })

};

internals.count = function (req, reply) {
  let q = req.query;
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
