'use strict';

var BdsExtractor = require("../../src/lib/RealEstateExtractor");

var bdsEx = new BdsExtractor();


//others
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-phu-xuyen', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-phuc-tho', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-quoc-oai', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-soc-son', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-son-tay', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-tay-ho', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thach-that', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thanh-oai', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thanh-tri', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thanh-xuan', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thuong-tin', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ung-hoa', 1);
