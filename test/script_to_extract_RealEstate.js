'use strict';

var RealEstateExtractor = require("../src/lib/RealEstateExtractor");

function extractRealEstateWithNgayDangTin(sub, from, to,ngayDangTin) {

var bdsEx = new RealEstateExtractor();

    bdsEx.extractRealEstateWithLimit(sub,from,to,ngayDangTin);

}


extractRealEstateWithNgayDangTin("http://batdongsan.com.vn/ban-can-ho-chung-cu", 1, 1,"20160604");

