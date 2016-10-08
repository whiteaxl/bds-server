"use strict";

var should = require("should");
var prepare = require("./prepareData");
var CommonService = require("../src/dbservices/Common");

var commonService = new CommonService();


//prepare.loadFromFile("paymentBonus.json");
//prepare.loadFromFile("ads.json");

//prepare.loadTinhHuyenXa("tinhhuyenxa.json");
//prepare.loadViewport("tinhhuyenxa.json");


function load() {
  var fs = require('fs');
  var array = fs.readFileSync('./data/ads.json').toString().split("\n\r");

  let i = 0;

  let str = '{"adsID":"Ads_bds_10007502","adsUrl":"/ban-dat-nen-du-an-pho-sai-dong-prj-khu-do-thi-sai-dong/eco-house-long-bien-suat-ngoai-giao-gia-tu-34-rieu-m2-lh-0912-068-900-pr10007502","area_raw":"73.7mÂ²","chiTiet":"\r\n        FLC Eco House thuá»™c dá»± Ã¡n chiáº¿n lÆ°á»£c cá»§a FLC Group táº¡i Long BiÃªn. Láº¥y cáº£m há»©ng tá»« hÃ¬nh tÆ°á»£ng hoa NhÃ i TÃ¢y vá»›i sáº¯c tráº¯ng tinh khÃ´i vÃ  hÆ°Æ¡ng thÆ¡m thanh khiáº¿t, FLC Eco House má»Ÿ ra má»™t phong cÃ¡ch sá»‘ng má»›i mÃ  báº¡n háº±ng mong Æ°á»›c báº¥y lÃ¢u. Má»™t cuá»™c sá»‘ng trong lÃ nh, ngáº­p trÃ n nhá»¯ng xÃºc cáº£m tÆ°Æ¡i má»›i vÃ  tráº£i nghiá»‡m cÃ¢n báº±ng, thÆ° thÃ¡i.\n\rVá»‹ trÃ­, tiá»‡n Ã­ch:\n\rFLC Eco House cÃ¡ch Há»“ GÆ°Æ¡m chÆ°a Ä‘áº§y 5km, gáº§n cáº§u ChÆ°Æ¡ng DÆ°Æ¡ng, Long BiÃªn vÃ  káº¿t ná»‘i vá»›i cá»¥m c';

  array.forEach((e) => {
    console.log(e);

    let o = JSON.parse(e);
    console.log(e);
    i ++;
    if (i > 10) {
      return;
    }
  })
}


//prepare.addNameKhongDau();
load()

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

