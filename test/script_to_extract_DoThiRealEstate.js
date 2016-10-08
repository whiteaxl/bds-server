'use strict';

var DoThiExtractor = require("../src/lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();

bdsEx.extractWithLimit('http://dothi.net/nha-dat-ban-hoan-kiem.htm', 1);

//bdsEx.extractWithLimit("http://dothi.net/nha-dat-ban-ha-noi.htm", 2);
//bdsEx.extractWithLimit("http://dothi.net/nha-dat-cho-thue-ha-noi.htm", 2);

