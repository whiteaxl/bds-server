'use strict';

var convertBds = require("./convertBds");
var m = require("moment");

var logUtil = require("../lib/logUtil");

let ngayDangFrom =m().subtract(1, 'day').format("YYYYMMDD");

logUtil.info("start from " + ngayDangFrom);

convertBds.loadPlaces(() => {
  convertBds.convertAllBds(()=> {
    logUtil.info("DONE ALL");

    process.exit();
  }, ngayDangFrom, null);
});
