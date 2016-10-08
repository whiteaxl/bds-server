'use strict';

var DoThiExtractor = require("../../src/lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();

//others
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-3a-53.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-54.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-56.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-59.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-66.htm', 1);

bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-10a-tran-nhat-duat.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-an-cu.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-khu-can-ho-contrexim-copac-square.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-an-gia-riverside.htm', 1);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-dai-phuc-river-view.htm', 1);

//it self
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-3a-53.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-54.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-56.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-59.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-duong-1-66.htm', 0);

bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-10a-tran-nhat-duat.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-chung-cu-an-cu.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-khu-can-ho-contrexim-copac-square.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-an-gia-riverside.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-dai-phuc-river-view.htm', 0);