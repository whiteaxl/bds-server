"use strict";

var should = require("should");
var prepare = require("./prepareData");
var CommonService = require("../src/dbservices/Common");

var commonService = new CommonService();


//prepare.loadFromFile("paymentBonus.json");
//prepare.loadFromFile("ads.json");

//prepare.loadTinhHuyenXa("tinhhuyenxa.json");
//prepare.loadViewport("tinhhuyenxa.json");

prepare.loadFromFile("ads.json");

//prepare.addNameKhongDau();


var times = 0;
var timer = setInterval(
    () => {
      commonService.countByType("Place", (cnt) => {
            console.log("Cnt = " + cnt);
        });
        times ++;
        console.log(times + ", " + timer);
        if (times > 2) {
            console.log("Clear...");
            clearInterval(timer);
        }
    }, 1000);

