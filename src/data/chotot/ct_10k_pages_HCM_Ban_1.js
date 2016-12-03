'use strict';

var Extractor = require("../extractor/ChoTotExtractor");
var DBCache = require("../../lib/DBCache");

var bdsEx = new Extractor();

//bdsEx.extractWithLimit('http://dothi.net/ban-nha-rieng-duong-huynh-van-banh-phuong-7-3/ban-nha-hxh-4m-duong-huynh-van-banh-f-7-quan-3-1tr-2l-gia-5-3-ty-pr5373872.htm', 0);


DBCache.loadAdsRaw( " and source = 'chotot'", () => {
  console.log("Load done!");

  //https://m.chotot.com/ha-noi/mua-ban-bat-dong-san
  //https://m.chotot.com/tp-ho-chi-minh/mua-ban-bat-dong-san

  bdsEx.extractFromTo("https://m.chotot.com/tp-ho-chi-minh/mua-ban-bat-dong-san", 5000, 20000, () => {
    console.log("Completed!");
    process.exit(0);
  });

});





//bdsEx.extractWithLimit("http://dothi.net/nha-dat-cho-thue-ha-noi.htm", 2);

