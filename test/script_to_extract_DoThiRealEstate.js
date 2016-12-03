'use strict';

var DoThiExtractor = require("../src/lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();

//bdsEx.extractWithLimit('http://dothi.net/ban-nha-rieng-duong-huynh-van-banh-phuong-7-3/ban-nha-hxh-4m-duong-huynh-van-banh-f-7-quan-3-1tr-2l-gia-5-3-ty-pr5373872.htm', 0);

bdsEx.extractWithLimit("http://dothi.net/nha-dat-ban-hoai-duc.htm", 0);
//bdsEx.extractWithLimit("http://dothi.net/nha-dat-cho-thue-ha-noi.htm", 2);

