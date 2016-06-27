'use strict';

var DoThiExtractor = require("../src/lib/DoThiExtractor");

function extractDoThiRealEstateWithNgayDangTin(sub, from, to,ngayDangTin) {

var bdsEx = new DoThiExtractor();

    bdsEx.extractWithLimit(sub,from,to,ngayDangTin);

}


extractDoThiRealEstateWithNgayDangTin("http://dothi.net/ban-nha-biet-thu-lien-ke.htm", 1, 1,"20160607");

