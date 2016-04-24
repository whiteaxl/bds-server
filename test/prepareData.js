var internals = {};

var AdsService = require("../src/dbservices/Ads");
var adsService = new AdsService;

internals.loadAds = function() {
    var data = require('./data/ads.json');
    console.log("data.list = " + data.length);
    for (var i in data) {
        adsService.upsert(data[i].default);
    }
};

module.exports = internals;
