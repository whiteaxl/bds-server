'use strict';

var BdsExtractor = require("../../lib/RealEstateExtractor");

var bdsEx = new BdsExtractor();

//HCM Thue
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-1', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-2', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-3', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-4', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-5', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-6', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-7', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-8', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-9', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-10', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-11', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-quan-12', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-binh-chanh', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-binh-tan', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-binh-thanh', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-can-gio', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-cu-chi', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-go-vap', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-hoc-mon', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-nha-be', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-phu-nhuan', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-tan-binh', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-tan-phu', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-thu-duc', 0);

setTimeout(() => {
  process.exit();
}, 1*60*60*1000);
