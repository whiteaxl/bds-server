var internals = {};

var AdsService = require("../src/dbservices/Ads");
var adsService = new AdsService;

var UserService = require("../src/dbservices/User");
var userService = new UserService;

var CommonService = require("../src/dbservices/Common");
var commonService = new CommonService;

internals.loadAds = function() {
    var data = require('./data/ads.json');
    console.log("data.length = " + data.length);
    for (var i in data) {
        adsService.upsert(data[i].default);
    }
};

internals.loadFromFile = function(fn) {
    var data = require('./data/' + fn);
    console.log("data.length = " + data.length);
    for (var i in data) {
        console.log(data[i]);
        commonService.upsert(data[i].default, () => {});
    }
};

internals.loadUserFromFile = function(fn) {
    var data = require('./data/' + fn);
    console.log("data.length = " + data.length);
    for (var i in data) {
        console.log(data[i]);
        userService.upsert(data[i].default);
    }
};

module.exports = internals;
