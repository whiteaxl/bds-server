'use strict';

var DoThiExtractor = require("../../src/lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();


//by this current duan-street
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-toa-nha-101-lang-ha.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-to-hop-108-nguyen-trai.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-113-trung-kinh.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-bo-tong-tham-muu.htm', 0);

bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-pho-an-trach-3.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-bui-xuong-trach-5.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-800a-7.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-41-1-14.htm', 0);


// By others duAn-street
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-toa-nha-101-lang-ha.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-to-hop-108-nguyen-trai.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-113-trung-kinh.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-bo-tong-tham-muu.htm', 1);

bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-pho-an-trach-3.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-bui-xuong-trach-5.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-800a-7.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-41-1-14.htm', 1);