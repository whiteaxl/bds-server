'use strict';

var DoThiExtractor = require("../src/lib/DoThiExtractor");

function extractDoThiRealEstateWithNgayDangTin(sub, from, to,ngayDangTin) {

var bdsEx = new DoThiExtractor();

    bdsEx.extractWithLimit(sub,from,to,ngayDangTin);

}


extractDoThiRealEstateWithNgayDangTin("http://dothi.net/nha-dat-ban-phuong-ben-nghe", 1, 10,null);

