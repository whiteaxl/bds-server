"use strict";

var CommonService = require("../dbservices/Common");
var logUtil = require("../lib/logUtil");

var commonService = new CommonService();

var loadFromFile = function(fn) {
  var data = require(fn);
  console.log("data.length = " + data.length);
  for (let i in data) {
    let tmp = data[i].default || data[i];
    console.log(tmp.id);

    commonService.upsert(tmp, (err, res) => {
      if (err) {
        logUtil.error(err);
      } else {
        logUtil.info("Done 1");
      }

    });
  }
};

//------------------------------------------------------------
//loadFromFile("./danhMuc/place_1.json");
//loadFromFile("./danhMuc/place_2.json");
//loadFromFile("./danhMuc/place_3.json");
loadFromFile("./danhMuc/tinh.json");
loadFromFile("./danhMuc/huyen.json");
loadFromFile("./danhMuc/xa_hn_hcm.json");

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

