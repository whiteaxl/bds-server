"use strict";

var should = require("should");
var prepare = require("./prepareData");
var AdsService = require("../src/dbservices/Ads");

var adsService = new AdsService();
prepare.loadFromFile("ads.json");
//prepare.loadAds();

var times = 0;
var timer = setInterval(
    () => {
        adsService.countAllAds((cnt) => {
            console.log("Cnt = " + cnt);
        });
        times ++;
        console.log(times + ", " + timer);
        if (times > 2) {
            console.log("Clear...");
            clearInterval(timer);
        }
    }, 1000);

