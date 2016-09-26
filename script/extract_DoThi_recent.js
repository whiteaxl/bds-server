'use strict';

var DoThiExtractor = require("../src/lib/DoThiExtractor");

var bdsEx = new DoThiExtractor();
//tam thoi dang harded code trong Request cua os... EXTRACT_HOST
bdsEx.extractWithLimit("http://dothi.net/nha-dat-ban.htm",0);
