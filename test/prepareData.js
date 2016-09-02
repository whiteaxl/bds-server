"use strict";

var internals = {};

var AdsService = require("../src/dbservices/Ads");
var adsService = new AdsService;

var UserService = require("../src/dbservices/User");
var userService = new UserService;

var CommonService = require("../src/dbservices/Common");
var commonService = new CommonService;

var Place = require("../src/dbservices/Place");
var placeService = new Place;

var placeUtils = require("../src/lib/placeUtil");

var rp = require("request-promise");


internals.loadAds = function () {
  var data = require('./data/ads.json');
  console.log("data.length = " + data.length);
  for (var i in data) {
    adsService.upsert(data[i].default);
  }
};

internals.loadFromFile = function (fn) {
  var data = require('./data/' + fn);
  console.log("data.length = " + data.length);
  for (var i in data) {
    console.log(data[i]);
    var tmp = data[i].default || data[i];

    commonService.upsert(tmp, () => {

    });
  }
};

internals.loadTinhHuyenXa = function (fn) {
  var data = require('./data/' + fn);
  console.log("data.length = " + data.length);
  for (var i in data) {
    //console.log(data[i]);
    data[i].type = "Place";
    data[i].id = String(data[i].id);

    commonService.upsert(data[i], () => {
    });
  }
};

var mapCapDiaChinh = {
  "Q": placeUtils.typeName.HUYEN,
  "P": placeUtils.typeName.XA,
  "T": placeUtils.typeName.TINH,
};

function match(ggPlace, diaChinhType) {
  let t1 = placeUtils.getTypeName(ggPlace);

  let t2 = mapCapDiaChinh[diaChinhType];

  return t1 == t2;
}

function mapWithGoogle(diaChinh, geocodes) {
  diaChinh.ggMatched = false;

  geocodes.forEach((geocode) => {
    let first = geocode.address_components[0];
    if (match(first, diaChinh.placeType)) {
      diaChinh.gg = geocode;
      diaChinh.ggMatched = true;
      diaChinh.geometry = geocode.geometry;
    }
  })


}

function loadViewportByPage(data, from, page) {
  var cnt = 0;
  var to = from + page;

  if (to > data.length) {
    to = data.length;
  }

  for (var i = from; i < to; i++) {
    let dc = data[i];
    dc.type = "Place";
    dc.id = String(dc.id);

    cnt++;
    if (cnt > 1000) return;

    var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
      "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
      "&address=" + encodeURIComponent(dc.fullName);

    console.log(url);

    var options = {
      uri: url,
      json: true // Automatically parses the JSON string in the response
    };

    rp(options)
      .then((res) => {
        //return res.results;
        dc.geocodes = res.results;

        mapWithGoogle(dc, res.results);

        //console.log(data[i]);
        //console.log("dc:", dc.ggMatched, dc.id, dc.fullName);
        if (res.results.length == 0) {
          console.log("NULL:", res)
        } else {
          //console.log("OK:", res.results);
        }
        commonService.upsert(dc, () => {
        });
      })
      .catch((err) => {
        console.log("ERROR:", err);
      })
  }
}

internals.loadViewport = function (fn, from, to) {
  var data = require('./data/' + fn);
  console.log("data.length = " + data.length);
  var l = data.length;
  //var l = 13000;

  var from=2000, page = 50;

  var itv = setInterval(() => {
    loadViewportByPage(data, from , page);
    console.log("FROM:", from);
    from = from + page;
    if (from > l) {
      clearInterval(itv);
    }
  }, 3000);
};


internals.addNameKhongDau = function () {
  placeService.patchDataInDB();
};



internals.loadUserFromFile = function (fn) {
  var data = require('./data/' + fn);
  console.log("data.length = " + data.length);
  for (var i in data) {
    console.log(data[i]);
    userService.upsert(data[i].default);
  }
};

module.exports = internals;
