'use strict';

var BdsExtractor = require("../../src/lib/RealEstateExtractor");

var bdsEx = new BdsExtractor();


//others
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ba-dinh', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ba-vi', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-bac-tu-liem', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-cau-giay', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-chuong-my', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-dan-phuong', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-dong-anh', 1);

