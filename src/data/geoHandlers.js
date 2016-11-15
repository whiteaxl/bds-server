'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");
var geoUtil = require("../lib/geoUtil");
var services = require("../lib/services");

var DBCache = require("../lib/DBCache");

var constants = require("../lib/constant");

var _ = require("lodash");

let geoHanders = {
  notMatchDiaChinhAndGeo : function(myPlace) {
    let ret = 0;

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

    let place = DBCache.placeById(id);

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
  },

  _assignGeoFromDiaChinh(ads) {
    //will assign center of Place.diaChinh to ads.geo
    let dc = ads.place.diaChinh;
    let id;
    if (dc.codeXa) {
      id = "Place_X_" + dc.codeXa;
    } else if (dc.codeDuAn) {
      id = "Place_A_" + dc.codeDuAn;
    } else {
      id = "Place_H_" + dc.codeHuyen;
    }

    let placeFromDB = DBCache.placeById(id);
    if (placeFromDB) {
      ads.place.geo = placeFromDB.geometry && placeFromDB.geometry.location;
      ads.getGeoBy = "diaChinh";
    }
  },

  getGeocodingByAddress(ads, callback) {
    let that = this;
    services.getGeocodingByAddress(ads.place.diaChi, (places) => {
      if (!places || places.length==0) {
        //console.error("Can not get geo by google!");
        that._assignGeoFromDiaChinh(ads);
        callback(ads);
        return null
      }

      let geo = ads.place.geo;

      for (let i = 0; i < places.length; i++) {
        let p = places[i];
        //console.log("found place by google:" , p);
        geo.lat = p.geometry.location.lat;
        geo.lon = p.geometry.location.lng;

        let checkGeo = that.notMatchDiaChinhAndGeo(ads.place);
        if (checkGeo.inVP == 0
          || checkGeo.GEOvsDC_distance - checkGeo.DC_radius < constants.CONVERT.GEO_TOLERANCE) {

          geo.ggPlaceID = p.place_id;
          geo.ggFormatted_address = p.formatted_address;
          ads.getGeoBy = "google";

          callback(ads);

          return;
        }
      }

      //reset and get from diaChinh
      geo.lat = null; geo.lon = null;
      that._assignGeoFromDiaChinh(ads);

      callback(ads);
    });
  }

};

//----------------------------------------------------------------------
module.exports = geoHanders;