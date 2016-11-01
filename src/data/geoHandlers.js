'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");
var geoUtil = require("../lib/geoUtil");

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
  notMatchDiaChinhAndGeo : function(myPlace, cachePlace) {
    let ret = 0;
    if (!cachePlace) {
      cachePlace = g_cachePlaces;
    }

    let dc = myPlace.diaChinh;
    let id;
    if (dc.codeXa) {
      id = "Place_X_" + dc.codeXa;
      ret = 1;
    } else if (dc.codeDuAn) {
      id = "Place_A_" + dc.codeDuAn;
      ret = 2;
    } else {
      id = "Place_H_" + dc.codeHuyen;
      ret = 3;
    }

    let place = cachePlace[id];

    if (!place) {
      logUtil.warn("No place:", id);

      return {inVP:-1};
    }

    if (!place.geometry) {
      logUtil.warn("Place no geometry:", place);
      return {inVP:-2};
    }

    if (!place.geometry.viewport) {
      logUtil.warn("Place no viewport:", place);
      return {inVP:-3};
    }

    let inVP = true;

    if (place && place.geometry && place.geometry.viewport) {
      let ne = place.geometry.viewport.northeast;
      let sw = place.geometry.viewport.southwest;
      inVP = (sw.lon <= myPlace.geo.lon) && (myPlace.geo.lon <= ne.lon)
        && (sw.lat <= myPlace.geo.lat) && (myPlace.geo.lat <= ne.lat);
    }

    if (!inVP) {
      //get distance when not match
      let c = place.geometry;
      let GEOvsDC_distance = geoUtil.measure(myPlace.geo.lat, myPlace.geo.lon, c.location.lat, c.location.lon);
      let DC_radius = geoUtil.measure(c.viewport.northeast.lat, c.viewport.northeast.lon, c.location.lat, c.location.lon);

      return {inVP: ret, GEOvsDC_distance:GEOvsDC_distance, DC_radius:DC_radius};
    }

    return {inVP: 0};
  },

  getDiaChinhNotMatchGeo : function(callback, from) {
    let start = new Date().getTime();
    let sql = "select t.id,t.place from default t where type='Ads' ";

    if (from) {
      sql = `${sql} and ngayDangTin >= '${from}'`;
    }


    commonService.query(sql, (err, list) => {
      if (err) {
        logUtil.error(err);
        return;
      }

      let count = 0, cntXa=0, cntDuAn = 0, cntHuyen=0;
      list.forEach(e => {
        if (this.notMatchDiaChinhAndGeo(e.place)) {
          let dc = e.place.diaChinh;

          if (dc.codeXa) {
            cntXa++;
          } else if (dc.codeDuAn) {
            cntDuAn++;
          } else {
            cntHuyen++;
          }

          logUtil.warn("Wrong:", e.id, "codeXa="+e.place.diaChinh.codeXa);

          count++;
        }
      });

      let end = new Date().getTime();
      logUtil.info("Done " + list.length + " in " + (end-start) + "ms" + ", mismatch:" + count + ", cntXa:"+cntXa +", cntDuAn:"+cntDuAn);

      callback();
    });
  },

  useParentViewportBySql(sql, done) {
    //let sql = `select t.* from default t where id='${id}' `;
    commonService.query(sql, (err, list) => {
      if (err) {
        logUtil.error("Error:", err);
        done(false);
        return;
      }

      let count = 0;
      let oneDone = () => {
        count++;
        logUtil.info("Done "  + count + " out of " + list.length);

        if (count == list.length) {
          logUtil.info("Done "  + list.length);
          done(true);
        }
      };

      list.forEach((place) => {
        commonService.byId(place.parentId, (err1, parent) => {
          if (!parent) {
            logUtil.error("No parent : " + place.parentId);
            oneDone(false);
            return;
          }

          place.fromParent = true;

          place.geometry = parent.geometry;

          commonService.upsert(place, (err, res) => {
            if (err) {
              logUtil.error("Error when update to parent viewport:", place.id);
              oneDone(false);
            } else {
              oneDone(true);
            }
          })
        })
      });
    });
  },

  useParentViewport(id, done) {
    let sql = `select t.* from default t where id='${id}' `;
    this.useParentViewportBySql(sql, done);
  },

  useParentViewportXa(done) {
    let sql = `select t.* from default t where type='Place' and placeType='X' and ggMatched=false and codeTinh='HCM'`;
    this.useParentViewportBySql(sql, done);
  }
};

//----------------------------------------------------------------------
/*
loadPlaces(() => {
  geoHanders.getDiaChinhNotMatchGeo(() => {
    logUtil.info("DONE ALL");
    process.exit(0);
  })
});

*/

module.exports = geoHanders;