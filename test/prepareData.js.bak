var internals = {};

var AdsService = require("../src/dbservices/Ads");
var adsService = new AdsService;

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
        adsService.upsert(data[i].default);
    }
};

module.exports = internals;
