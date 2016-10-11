'use strict';
var convert = require("./convertDoThi");
var m = require("moment");

let ngayDangFrom, ngayDangTo;
if (process.argv.length > 2) {
  ngayDangFrom = process.argv[2]
}
if (process.argv.length > 3) {
  ngayDangTo = process.argv[3]
}


convert.loadPlaces(() => {
  convert.convertAllBds(()=> {
    logUtil.info("DONE ALL");
  }, ngayDangFrom, ngayDangTo);
});


