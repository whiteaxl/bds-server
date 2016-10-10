'use strict';

var BdsExtractor = require("../../src/lib/RealEstateExtractor");

var bdsEx = new BdsExtractor();


//others
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-dong-da', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-gia-lam', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ha-dong', 1);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-hai-ba-trung', 1);
