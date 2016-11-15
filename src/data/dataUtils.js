'use strict';

var m = require("moment");
var DBCache = require("../lib/DBCache");

var logUtil = require("../lib/logUtil");

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var geoHandlers = require("./geoHandlers");

var utils = {
  checkWrongGeo(done) {
    let sql = "select t.* from default t where type='Ads' and GEOvsDC!=0";
    commonService.query(sql, (err, list) => {
      if (err) {
        console.log("Error:", err);

        return;
      }

      let match;

      list.forEach((ads) => {
        match = geoHandlers.notMatchDiaChinhAndGeo(ads.place);

        //if (match.inVP != 0 && (match.GEOvsDC_distance - match.DC_radius > 2500)) {
        if (match.inVP != 0) {
          console.log(ads.id, match.GEOvsDC_distance - match.DC_radius);
        }
      });

      done();
    });
  }
};

//----------------------------------------------------------------------------------
DBCache.reloadPlaces(() => {
  utils.checkWrongGeo(()=> {
    logUtil.info("DONE ALL");
    process.exit();
  });
});
