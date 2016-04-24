"use strict";

var should = require("should");
var prepare = require("./prepareData");
var AdsService = require("../src/dbservices/Ads");

var adsService = new AdsService();

describe("01.LoadData testsuite",function(){
    let expectedLength;

    it("Test load data",function(done){
        adsService.countAllAds((cnt) => {
            console.log("Cnt = " + cnt);
            if (cnt < 2563) {
                //prepare.loadAdsFromFile("testAds.json");
                prepare.loadAds();

                var times = 0;
                var timer = setInterval(
                    () => {
                        adsService.countAllAds((cnt) => {
                            console.log("Cnt = " + cnt);
                        });
                        times ++;
                        console.log(times + ", " + timer);
                        if (times > 3) {
                            console.log("Clear...");
                            clearInterval(timer);
                            done();
                        }
                    }, 1000);
            } else {
                done();
            }
        });

    });

});