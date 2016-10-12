'use strict';

var BdsExtractor = require("../../src/lib/RealEstateExtractor");

var bdsEx = new BdsExtractor();


//Xa
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-binh-chanh', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-binh-tan', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-binh-thanh', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-can-gio', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-cu-chi', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-go-vap', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hoc-mon', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-nha-be', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-phu-nhuan', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-tan-binh', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-tan-phu', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-thu-duc', 1);
