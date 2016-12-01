'use strict';

var m = require("moment");
var DBCache = require("../lib/DBCache");

var logUtil = require("../lib/logUtil");

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var geoHandlers = require("./geoHandlers");

var services = require("../lib/services");

var utils = {
  checkWrongGeo(done) {
    let that = this;
    DBCache.reloadPlaces(() => {
      that.checkWrongGeo(done);
    });
  },
  _checkWrongGeo(done) {
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
  },

  checkDuplicate(done) {
    DBCache.loadDoc("Ads", null, () => {
      let all = global.rwcache.Ads.asArray;
      let grp = {};

      let key = null;

      all.forEach((ads) => {
        key = "loaiTin="+ads.loaiTin + " and loaiNhaDat=" + ads.loaiNhaDat
            + " and dienTich=" + ads.dienTich + " and  dangBoi.phone='"
            + ads.dangBoi.phone + "'" + ` and place.diaChi='${ads.place.diaChi}'`;
        if (grp[key]) {
          grp[key].push(ads)
        } else {
          grp[key] = [ads];
        }
      });

      //
      let cnt = 0;

      for (let att in grp) {
        if (grp[att].length > 1) {
          console.log("Cnt:" + grp[att].length, "Same:" + att);
          cnt = cnt +  grp[att].length - 1;
        }
      }

      console.log("Total duplicate:", cnt);

      done();
    });
  },

  //add google name to place
  addGoogleName() {
    let sql = "select default.* from default where type='Place' and placeType = 'T'  ";
    commonService.query(sql, (err, res) => {
      if (err) {
        console.error(err);

        return;
      }

      if (res.length > 0) {
        res.forEach((one) => {
          services.getGeocodingByAddress(one.gg_formatted_address, (places) => {
            if (!places || places.length==0) {
              return null
            }



            let ggPlace = places[0];
            if (places.length > 1) {
              if (places[1].address_components < ggPlace.address_components) {
                ggPlace = places[1];
              }
            }

            let loc = ggPlace.address_components.length - 2;
            if (one.placeType == 'H') {
              loc = loc - 1;
            }

            one.ggName = ggPlace.address_components[loc].short_name;

            one.ggMappedName = true;
            commonService.upsert(one, (err, res) => {
              if (err) {
                console.log("ERROR:", err);
              }
            });

          });
        })
      }
    })
  }
};

//----------------------------------------------------------------------------------

/*
utils.checkWrongGeo(()=> {
  logUtil.info("DONE ALL");
  process.exit();
});
*/

/*
utils.checkDuplicate(()=> {
  logUtil.info("DONE ALL, pls use: " + "select * from default where type='Ads' and ");
  process.exit();
});

*/

utils.addGoogleName();