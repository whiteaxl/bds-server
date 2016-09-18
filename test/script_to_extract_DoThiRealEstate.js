'use strict';

var DoThiExtractor = require("../src/lib/DoThiExtractor");

function extractDoThiRealEstateWithNgayDangTin(sub, from, to,ngayDangTin) {

var bdsEx = new DoThiExtractor();

    bdsEx.extractWithLimit(sub,from,to,ngayDangTin);

}


//extractDoThiRealEstateWithNgayDangTin("http://dothi.net/nha-dat-ban.htm", 1, 1,null);
extractDoThiRealEstateWithNgayDangTin("http://dothi.net/nha-dat-ban-can-tho.htm", 1, 1,null);
