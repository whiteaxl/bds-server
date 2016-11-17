'use strict';
var convertBds = require("./convertBds");
var m = require("moment");
var logUtil = require("../lib/logUtil");
var DBCache = require("../lib/DBCache");

let ngayDangFrom, ngayDangTo;
if (process.argv.length > 2) {
  ngayDangFrom = process.argv[2]
}
if (process.argv.length > 3) {
  ngayDangTo = process.argv[3]
}


DBCache.init(() => {
  convertBds.convertAllBds(()=> {
    logUtil.info("DONE ALL");
    process.exit(0);
  }, ngayDangFrom, ngayDangTo);
}, true, " source = 'bds'");


