'use strict';

var BdsExtractor = require("../../lib/RealEstateExtractor");

var bdsEx = new BdsExtractor();

//Hanoi ban
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ba-dinh', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ba-vi', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-bac-tu-liem', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-cau-giay', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-chuong-my', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-dan-phuong', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-dong-anh', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-dong-da', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-gia-lam', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ha-dong', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hai-ba-trung', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hoai-duc', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hoan-kiem', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hoang-mai', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-long-bien', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-me-linh', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-my-duc', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-nam-tu-liem', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-phu-xuyen', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-phuc-tho', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-quoc-oai', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-soc-son', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-son-tay', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-tay-ho', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thach-that', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thanh-oai', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thanh-tri', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thanh-xuan', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thuong-tin', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ung-hoa', 0);

setTimeout(() => {
  process.exit();
}, 2*60*60*1000);
