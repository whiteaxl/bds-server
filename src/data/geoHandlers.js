'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");


var g_cachePlaces = {};

function loadPlaces(callback) {
  let sql = "select t.* from default t where type='Place' ";
  commonService.query(sql, (err, list) => {
    if (err) {
      logUtil.error(err);
      return;
    }
    list.forEach(e => {
      g_cachePlaces[e.id] = e;
    });

    logUtil.info("Done load Places", list.length);

    callback();
  });
}


let geoHanders = {
  _notMatchDiaChinhAndGeo : function(myPlace) {
    let dc = myPlace.diaChinh;
    let id;
    if (dc.codeXa) {
      id = "Place_X_" + dc.codeXa;
    } else if (dc.codeDuAn) {
      id = "Place_A_" + dc.codeDuAn;
    } else {
      id = "Place_H_" + dc.codeHuyen;
    }

    let place = g_cachePlaces[id];

    if (!place) {
      logUtil.warn("No place:", id);

      return true;
    }

    if (!place.geometry) {
      logUtil.warn("Place no geometry:", place);
      return true;
    }

    if (!place.geometry.viewport) {
      logUtil.warn("Place no viewport:", place);
      return true;
    }

    let inVP = true;

    if (place && place.geometry && place.geometry.viewport) {
      let ne = place.geometry.viewport.northeast;
      let sw = place.geometry.viewport.southwest;
      inVP = (sw.lon <= myPlace.geo.lon <= ne.lon) && (sw.lat <= myPlace.geo.lat <= ne.lat);
    }

    return !inVP;
  },

  getDiaChinhNotMatchGeo : function(callback, from) {
    let start = new Date().getTime();
    let sql = "select t.place from default t where type='Ads' ";

    if (from) {
      sql = `${sql} and ngayDangTin >= '${from}'`;
    }


    commonService.query(sql, (err, list) => {
      if (err) {
        logUtil.error(err);
        return;
      }

      let count = 0;
      list.forEach(e => {
        if (this._notMatchDiaChinhAndGeo(e.place)) {
          logUtil.warn(e.id);
          count++;
        }
      });

      let end = new Date().getTime();
      logUtil.info("Done " + list.length + " in " + (end-start) + "ms" + ", mismatch:" + count);

      callback();
    });
  }

};

//----------------------------------------------------------------------
loadPlaces(() => {
  geoHanders.getDiaChinhNotMatchGeo(() => {
    logUtil.info("DONE ALL");
    process.exit(0);
  })
});

