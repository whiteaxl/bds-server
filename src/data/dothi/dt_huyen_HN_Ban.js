'use strict';

var DoThiExtractor = require("../../lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();

//HN ban
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-hoan-kiem.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-ba-dinh.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-dong-da.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-hai-ba-trung.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-thanh-xuan.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-tay-ho.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-cau-giay.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-hoang-mai.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-long-bien.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-dong-anh.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-gia-lam.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-soc-son.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-thanh-tri.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-nam-tu-liem.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-ha-dong.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-son-tay.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-me-linh.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-ba-vi.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-phuc-tho.htm', 0);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-bac-tu-liem.htm', 0);

setTimeout(() => {
  process.exit();
}, 2*60*60*1000);
