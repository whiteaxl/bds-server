'use strict';

var request = require("request");
var rp = require("request-promise");
var placeUtil = require("./placeUtil");


var API_KEYS = {
  "admin"    : "AIzaSyA3qw4-XzLRLEHrnU7nMchAaEF6O8Y7q3U",
  "dev"      : "AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU",
  "contact"  : "AIzaSyD66Z6anH6xnoyOjJCYhxFdwaxd_QQxbzM",
  "hoai0906" : "AIzaSyDZdgl7aeF_jL8AR10-ppk_f8H8GtfU3h0",
  "hoailt"   : "AIzaSyASnKXHf751xhC2GV5rhJtmShKm9vSxynA",
  "reway"    : "AIzaSyAe99wwketosXpqK8cAp-uWuq4ksPvHJBk",
  "hungdq"   : "AIzaSyDNEVTwuBikQFB3qhx94QM7KllFhXRkGRk",
  "phunt"    : "AIzaSyAJzNe_pgIGYBhzTKkAbhkBv81ldY-MZ0c",
  "jan5902"  : "AIzaSyAuExyOomfbrjJTJxc6VkiHg3RC-Xim9hw",
  "dennis"   : "AIzaSyDwjm1ugHlt0w3ENxjHFSzUq3mLNUO37A0",
  "jan5903"  : "AIzaSyA4udHKUzAohMGZzL2gh24tW3u5J8u6t0o",
  "jan5904"  : "AIzaSyA_WK-aZDRyqLiFZSHALZkZRy2bESoYHfg",
  "jan5906"  : "AIzaSyD4GoTDQVeE_TFGNgplECW_ywGogGiifdE",
  "jan5907"  : "AIzaSyBG6kKb2dZ1WLOtipuYPRkjrG5M0qp-mBQ",
  "jan5908"  : "AIzaSyDhHrIMB8tbetv2gVgrmF6pTU2IRZqVu2Q",
  "jan5909"  : "AIzaSyB5HteLwuWlOInAnGEBTPjOW863fnTvqSU",
  "jan5910"  : "AIzaSyC5Kn7XypVJBGL7th3pVkpCo6mqyaHhpyo",
  "jan5911"  : "AIzaSyDfCFabqOlTxx9IH455NEvMSLaHiXjz28w",
  "jan5912"  : "AIzaSyA9fH5u_D20Tq0O5ac1fv2ZAvveeCbwgYU",
  "jan5913"  : "AIzaSyDQCqwj-P3h5kOOSPaM0kS895RMSMwAVPs",
  "jan5914"  : "AIzaSyBBQzYWZ1Tw1VApsyUPw015Wp0dtkH2S7o",
  "jan5915"  : "AIzaSyAtg5jy6NIeWBNwFWLBIzVlcD_QNAawbz0",
  "jan5916"  : "AIzaSyA7e8HOkRzw2WLwjVThy41b3jGxvV3Z95M",
  "jan5917"  : "AIzaSyDfCPEPOVWwqIp6u_oWW04dDEEcSE7LmVo",
  "jan5918"  : "AIzaSyDvtDuoKCT-hsyZrrNyuxi3EAEYhH_tBYQ"
};

let API_KEYS_Array = [];
for (let e in API_KEYS) {
  API_KEYS_Array.push(API_KEYS[e]);
}

var services = {};

services.getPlaceDetail = function(placeId, callback, callbackError) {
    var url = "https://maps.googleapis.com/maps/api/place/details/json?" +
        "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
        "&placeid=" + placeId;

    console.log(url);

    request({url: url,json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body.result);
        } else {
            console.log("Error when getPlaceDetail" + error);
            callbackError(error);
        }
    })
};

services.getGeocoding = function(lat, lon, callback, callbackError) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
      "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
      "&latlng=" + lat + ',' + lon;

    console.log(url);

    request({url: url,json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body.results && body.results[0])
                callback(body.results[0]);
            else
                callback(null);
        } else {
            console.log("Error when getGeocoding" + error);
            callbackError(error);
        }
    })
};

services.getGeocodingAsPromise = function(lat, lon) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
    "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
    "&latlng=" + lat + ',' + lon;

  console.log(url);

  var options = {
    uri: url,
    json: true // Automatically parses the JSON string in the response
  };

  return rp(options)
    .then((res) => {
      return res.results;
    })
};

var usingKeyIdx = 0;
services.getGeocodingByAddress = function(address, callback) {
  var geoCodeURL  = "https://maps.googleapis.com/maps/api/geocode/json";

  let key = API_KEYS_Array[usingKeyIdx++ % API_KEYS_Array.length];

  var myurl = `${geoCodeURL}?key=${key}&address=${encodeURIComponent(address)}`;

  console.log(myurl);

  request({url: myurl,json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      if (body.results && body.results[0])
        callback(body.results);
      else {
        if (body.results) {
          console.error("Can not get GEO by google! No Results:", body, myurl);
        } else {
          console.error("Can not get GEO by google!", myurl);
        }

          callback(null);
      }
    } else {
      console.log("Error when getGeocodingByAddress" + error);
      callback(null);
    }
  });
};


//return {tinh, huyen, xa} khong dau
services.getDiaChinhKhongDauByGeocode = function(lat, lon) {
  return services.getGeocodingAsPromise(lat, lon)
    .then((places) => {
      if (!places || places.length==0) {
        return null
      }

      let place = places[0];
      let diaChinh = placeUtil.getDiaChinhFromGooglePlace(place);

      return diaChinh;
    });
};

module.exports = services;