'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");

var geoHandlers = require("./geoHandlers");

var constants = require("../lib/constant");

var DBCache = require("../lib/DBCache");

var _ = require("lodash");

let helper = {
  getBdsImage(bds) {
    let image = {
      cover : bds.image.cover,
      images : bds.image.images
    };

    if (!image.cover || image.cover.indexOf("no-photo") > -1) {
      image.cover = undefined;
    }

    return image;
  },

  toRewayCode(code) {
    if (!code || code == "0" || code == "-1") {
      return undefined;
    }

    return code;
  },
  _standardizeGeoAndUpsert(ads, callback) {
    let done = (ads) => {
      commonService.upsert(ads, (subErr, subRes) => {
        if (subErr) {
          console.log("_standardizeGeoAndUpsert commonService.upsert Error:", subErr);
        }
        callback();
      });
    };

    if (ads.GEOvsDC < 0) {
      ads.status = constants.ADS_STATUS.KHONG_CO_DANH_MUC_DIA_CHINH_TUONG_UNG;
      done(ads);

      return;
    }

    if ((ads.GEOvsDC >= 0) && (ads.GEOvsDC_diff > constants.CONVERT.GEO_TOLERANCE
      || !ads.place.geo || !ads.place.geo.lat) ) {

      ads.place.geo.lat = null;
      ads.place.geo.lon = null;

      console.log("Search geo by google for :", ads.id, "ads.GEOvsDC_diff=", ads.GEOvsDC_diff);

      geoHandlers.getGeocodingByAddress(ads, (ads) => {
        done(ads);
      });
    } else {
      done(ads);
    }
  },
  upsertAdsIfChanged(ads, callback) {
    let that = this;
    DBCache.upsertAdsIfChanged(ads, (res) => {
      if (res == 0) { //same, no need any action
        callback(res);
        return;
      }
      that._standardizeGeoAndUpsert(ads, (wrongData) => {
        if (wrongData) {
          callback(3);
        } else {
          callback(res);
        }

      });
    });
  }
};

//-----------------------------------------------------------
module.exports = helper;
