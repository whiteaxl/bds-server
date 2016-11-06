'use strict';

var DoThiExtractor = require("../../lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();

//hcm thue
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-1.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-2.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-3.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-4.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-5.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-6.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-7.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-8.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-9.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-10.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-11.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-quan-12.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-binh-tan.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-binh-thanh.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-go-vap.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-phu-nhuan.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-tan-binh.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-tan-phu.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-thu-duc.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-nha-be.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-binh-chanh.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-can-gio.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-cu-chi.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-cho-thue-hoc-mon.htm', 0);

setTimeout(() => {
  process.exit();
}, 1*60*60*1000);
