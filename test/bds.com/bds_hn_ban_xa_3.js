'use strict';

var BdsExtractor = require("../../src/lib/RealEstateExtractor");

var bdsEx = new BdsExtractor();


//others
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hoai-duc', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hoan-kiem', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hoang-mai', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-long-bien', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-me-linh', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-my-duc', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-nam-tu-liem', 1);
