'use strict';

var DoThiExtractor = require("../src/lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();

bdsEx.extractWithLimit('http://dothi.net/ban-can-ho-chung-cu-mulberry-lane.htm', 0);

//bdsEx.extractWithLimit("http://dothi.net/nha-dat-ban-ha-noi.htm", 2);
//bdsEx.extractWithLimit("http://dothi.net/nha-dat-cho-thue-ha-noi.htm", 2);

