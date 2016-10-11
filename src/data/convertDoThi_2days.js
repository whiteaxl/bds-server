'use strict';

var convert = require("./convertDoThi");
var m = require("moment");

var logUtil = require("../lib/logUtil");

let ngayDangFrom =m().subtract(1, 'day').format("YYYYMMDD");

logUtil.info("start from " + ngayDangFrom);

convert.loadPlaces(() => {
  convert.convertAllBds(()=> {
    logUtil.info("DONE ALL");
  }, ngayDangFrom, null);
});
