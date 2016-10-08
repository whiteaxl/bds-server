'use strict';

var DoThiExtractor = require("../../src/lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();

let depth = 0;

bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-hoan-kiem.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-ba-dinh.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-dong-da.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-hai-ba-trung.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-thanh-xuan.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-tay-ho.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-cau-giay.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-hoang-mai.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-long-bien.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-dong-anh.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-gia-lam.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-soc-son.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-thanh-tri.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-nam-tu-liem.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-ha-dong.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-son-tay.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-me-linh.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-ba-vi.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-phuc-tho.htm', depth);
bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-bac-tu-liem.htm', depth);