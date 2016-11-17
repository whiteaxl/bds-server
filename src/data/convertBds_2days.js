'use strict';

var convertBds = require("./convertBds");
var m = require("moment");
var DBCache = require("../lib/DBCache");

var logUtil = require("../lib/logUtil");

let ngayDangFrom =m().subtract(1, 'day').format("YYYYMMDD");

logUtil.info("start from " + ngayDangFrom);

DBCache.init(() => {
  convertBds.convertAllBds(()=> {
    logUtil.info("DONE ALL");

    process.exit();
  }, ngayDangFrom, null);
}, true, " source = 'bds'");
