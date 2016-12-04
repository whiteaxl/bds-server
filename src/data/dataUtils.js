'use strict';

var m = require("moment");
var DBCache = require("../lib/DBCache");

var logUtil = require("../lib/logUtil");

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var geoHandlers = require("./geoHandlers");

var services = require("../lib/services");

var request = require("request");
var fs = require("fs");
var mkdirp = require("mkdirp");
var async = require("async");



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
  },

  //downloadImage, callback(err)
  downloadImage(dir, imgUrl, callback) {
    logUtil.info("Downloading... " + imgUrl);

    let idx = imgUrl.lastIndexOf("/");
    let idx2 = imgUrl.lastIndexOf("//");
    let imageName = imgUrl.substring(idx+1);
    let imagePath = imgUrl.substring(idx2+1, idx);

    let fullDir = dir + imagePath;
    let filename = fullDir + "/" + imageName;

    mkdirp(fullDir, function (err) {
      if (err) {
        console.error(err);
        return;
      }
/*
      request(imgUrl, (err, response, body) => {
        fs.writeFile(fullDir + "/" + imageName, body, 'binary', callback);
      });
*/
      request(imgUrl).pipe(
        fs.createWriteStream(filename)
          .on('error', function(err){
            callback(err);
          })
        )
        .on('close', function() {
          callback(null);
        });

    });
  },


  downloadAllAdsImage(baseDir) {
    let that = this;
    var targetSize = "745x510";

    commonService.query("select default.image.images, id from default where type='Ads' " +
      "and meta.downloadedImage is missing " +
      "limit 10000"
      , (err, res) => {
        if (err) {
          return console.log("Err when load:" + err);
        }

        if (res) { //list of ads images

          async.eachOfLimit(res, 50, (ads, doneAds) => {
            logUtil.info("Starting with " + ads.id + ", ads.images.length=" + ads.images.length);

            async.each(ads.images, (img, callback) => {
                let large = img.replace("80x60", targetSize).replace("120x90", targetSize).replace("200x200", targetSize);
                that.downloadImage(baseDir, large, callback);
            }, function(err) {
              if (err) {
                console.error('A file failed to download!' + err + ", for " + ads.id);
              }

              //update flag
              commonService.query(`update default set meta.downloadedImage = true where id = '${ads.id}'`
                , (err, res) => {
                  if (err) {
                    logUtil.error("Can't mark ads as downloaded image!" + err);
                  }

                  doneAds();
              });
            });
          }, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log("All DONE successfully!");
            }
          });

        }
      }
    );
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

//utils.addGoogleName();

/*

utils.downloadImage("/Users/supermac/Projects/tmp/images"
  , "http://file4.batdongsan.com.vn/resize/745x510/2016/12/03/20161203104340-d843.jpg"
  , (err) => {
    if (err) {
      console.error(err);
    } else {
      process.exit(0);
    }
  });

*/


utils.downloadAllAdsImage("/u01/images");
