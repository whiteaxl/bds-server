'use strict';

var CommonService = require("../src/dbservices/Common");
var commonService = new CommonService;
var placeUtil = require("../src/lib/placeUtil");
var geoUtil = require("../src/lib/geoUtil");
var rp = require("request-promise");

function loadViewportFromGG(list, idx, geoUrl) {
  if (list.length == idx) {
    console.log("DONE!!!!!");
    return;
  }

  var dc = list[idx];

  var url = null;

  if (!geoUrl) {
    let keyword = dc.fullName;
    keyword = keyword.replace("Thị xã ", "");
    //keyword = keyword.replace("Quận ", "");
    keyword = keyword.replace("Huyện ", "");
    keyword = keyword.replace("Thành phố ", "");

    if (dc.placeType =='T') {
      keyword = "Tinh " + keyword;
    }

    url = "https://maps.googleapis.com/maps/api/geocode/json?" +
      "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
      "&address=" + encodeURIComponent(keyword);
  } else {
    url = geoUrl;
  }

  console.log(url);

  var options = {
    uri: url,
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then((res) => {
      if (dc.fullName == 'Quận Cầu Giấy, Hà Nội') {
        console.log("here" + res.results.length, url)
      }

      mapWithGoogle(dc, res.results);

      if (dc.placeType=='X' && (res.results.length == 0 || dc.ggMatched == false)) {
        console.log("Can't find geoCode, will try by remove Huyen:" + dc.fullName);

        if (!geoUrl && dc.placeType == 'X') {
          let xaTinh  =dc.xa + "," + dc.tinh;

          let url2 = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
            "&address=" + encodeURIComponent(xaTinh);

          console.log("Will try geoCode for :" + xaTinh);

          loadViewportFromGG(list, idx, url2);
          return;
        }
      }

      //console.log("dc:", dc.ggMatched, dc.id, dc.fullName);
      //console.log("OK:", res.results);

      if (!dc.ggMatched) {
        console.log("can't find:", dc.fullName);
      }
      upsert(dc);

      loadViewportFromGG(list, idx+1, null);
    })
    .catch((err) => {
      console.log("ERROR:", err);
    })
}

var mapCapDiaChinh = {
  "H": placeUtil.typeName.HUYEN,
  "X": placeUtil.typeName.XA,
  "T": placeUtil.typeName.TINH,
};

function match(ggPlace, diaChinhType) {
  let t1 = placeUtil.getTypeName(ggPlace);

  let t2 = mapCapDiaChinh[diaChinhType];

  return t1 == t2;
}

function assignGeoCode(diaChinh, geocode) {
  diaChinh.gg_formatted_address = geocode.formatted_address ;

  let geo = geocode.geometry;
  let ne = geo.viewport.northeast;
  let sw = geo.viewport.southwest;

  diaChinh.geometry = {
    location : {
      lat : Number(((ne.lat + sw.lat)/2).toFixed(7)),
      lon : Number(((ne.lng + sw.lng)/2).toFixed(7)),
    },
    viewport : {
      northeast : {
        lat: ne.lat,
        lon: ne.lng,
      },
      southwest : {
        lat: sw.lat,
        lon: sw.lng,
      }
    }
  };
}

function mapWithGoogle(diaChinh, geocodes) {
  diaChinh.ggMatched = false;

  geocodes.forEach((geocode) => {
    let first = geocode.address_components[0];
    if (match(geocode, diaChinh.placeType)) {
      diaChinh.ggMatched = true;

      assignGeoCode(diaChinh, geocode);
    }
  });

  if (!diaChinh.ggMatched && geocodes.length > 0) {
    assignGeoCode(diaChinh, geocodes[0]);
  }
}

function useGoogleToAddMissingViewportInDB() {
  //let sql = `select t.* from default t where type='Place' and ggMatched=false and (placeType = 'T' or placeType = 'H' or placeType = 'X')`;
  let sql = `select t.* from default t where type='Place' and ggMatched=false  and tinhKhongDau='ho-chi-minh' limit 3000`;

  commonService.query(sql, (err, res) => {
    console.log("COUNT=", res.length);
    if (err) {
      console.log("Error:", err);
      return;
    }

    var idx = 0;
    loadViewportFromGG(res, idx, null);
  });
}

function useBCAToAddMissingViewportInDB(limit) {
  let sql = `select t.* from default t where type='Place' and ggMatched=false and geometry is missing and (placeType = 'T' or placeType = 'H' or placeType = 'X') limit ${limit}`;
  commonService.query(sql, (err, res) => {
    if (err) {
      console.log("Error:", err);
      return;
    }

    res.forEach((dc) => {
      loadViewportFromDB(dc);
    })
  });
}


function loadViewportFromDB(dc) {

  let sql = `select t.* from default t where type='Place_BCA' and ggMatched=true and tinhKhongDau = '${dc.tinhKhongDau}'`;
  if (dc.huyenKhongDau) {
    sql = `${sql} and huyenKhongDau = '${dc.huyenKhongDau}'`;

    if (dc.xaKhongDau) {
      sql = `${sql} and xaKhongDau = '${dc.xaKhongDau}'`;
    }
  }

  commonService.query(sql, (err, res) => {
    if (err) {
      console.log("Error:", err);
      return;
    }

    if (res.length == 0) {
      console.log("Warn, No matching!", sql);

      loadViewportFromGG(dc, null);

      //upsert(dc);

      return;
    }

    let geo = res[0].geometry;
    let ne = geo.viewport.northeast;
    let sw = geo.viewport.southwest;

    dc.geometry = {
      location : {
        lat : Number(((ne.lat + sw.lat)/2).toFixed(7)),
        lon : Number(((ne.lng + sw.lng)/2).toFixed(7)),
      },
      viewport : {
        northeast : {
          lat: ne.lat,
          lon: ne.lng,
        },
        southwest : {
          lat: sw.lat,
          lon: sw.lng,
        }
      }
    };
    dc.ggMatched = true;

    upsert(dc);
  })
}

function upsert(obj) {
  commonService.upsert(obj, (err, res) => {
    if (err) {
      console.log("error when update viewport");
    }
  });
}


function insert(obj, success) {
  commonService.insert(obj, (err, res) => {
    if (err) {
      console.log("error when insert", err);
    } else {
      if (success) {
        success(res);
      }
    }
  });
}


function loadViewport(dc) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
    "key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
    "&address=" + encodeURIComponent(dc.fullName);

  console.log(url);

  var options = {
    uri: url,
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then((res) => {
      //return res.results;
      dc.geocodes = res.results;

      mapWithGoogle(dc, res.results);

      //console.log(data[i]);
      //console.log("dc:", dc.ggMatched, dc.id, dc.fullName);
      if (res.results.length == 0) {
        console.log("NULL:", res)
      } else {
        //console.log("OK:", res.results);
      }
      commonService.upsert(dc, () => {
      });
    })
    .catch((err) => {
      console.log("ERROR:", err);
    })
}

function processDuAn(projects, huyenObj) {
  projects.forEach((p) => {
    let projectKhongDau = placeUtil.chuanHoaAndLocDau(p.name);

    let radiusInKm = 1.5;//default to 3km square
    let geoBox = geoUtil.getBox({lat:p.lat, lon:p.lng} , geoUtil.meter2degree(radiusInKm));

    let projectObj = {
      "fullName": p.name + ", " + huyenObj.fullName,
      "ggMatched": false,
      "huyen": huyenObj.placeName,
      "huyenKhongDau": huyenObj.huyenKhongDau,
      "id": "Place_A_" + p.id,
      "nameKhongDau": projectKhongDau,
      "placeName": p.name,
      "placeType": "A",
      "tinh": huyenObj.tinh,
      "tinhKhongDau": huyenObj.tinhKhongDau,
      "type": "Place",
      "duAn": p.name,
      "duAnKhongDau": projectKhongDau,
      "parentId" : huyenObj.id,
      geometry : {
        location : {
          lat : p.lat,
          lon : p.lng,
        },
        viewport : {
          northeast : {
            lat: geoBox[2],
            lon: geoBox[3],
          },
          southwest : {
            lat: geoBox[0],
            lon: geoBox[1],
          }
        }
      }
    };

    upsert(projectObj);
  });
}

function processXa(wards, huyenObj) {
  //Insert list of wards
  wards.forEach((ward) => {
    let xaNameWithPrefix = (ward.pre + " " + ward.name).trim();
    let xaKhongDau = placeUtil.chuanHoaAndLocDau(ward.name);
    console.log(xaNameWithPrefix);

    let xaObj = {
      "fullName": xaNameWithPrefix + ", " + huyenObj.fullName,
      "ggMatched": false,
      "huyen": huyenObj.placeName,
      "huyenKhongDau": huyenObj.huyenKhongDau,
      "id": "Place_X_" + ward.id,
      "nameKhongDau": xaKhongDau,
      "placeName": ward.name,
      "placeType": "X",
      "tinh": huyenObj.tinh,
      "tinhKhongDau": huyenObj.tinhKhongDau,
      "type": "Place",
      "xa": ward.name,
      "xaKhongDau": xaKhongDau,
      "parentId" : huyenObj.id,
      "pre" : ward.pre,
      "code" : ward.id
    };

    upsert(xaObj);
    //loadViewportFromDB(xaObj);

  });
}

function processStreet(streets) {
  streets.forEach((p) => {
    let streetKhongDau = placeUtil.chuanHoaAndLocDau(p.name);

    let name = (p.pre + " " + p.name).trim();

    let streetObj = {
      "fullName": name + ", " + d.name + ", " + tinh.name,
      "ggMatched": false,
      "huyen": d.name,
      "huyenKhongDau": huyenKhongDau,
      "id": "Place_" + p.id,
      "nameKhongDau": streetKhongDau,
      "placeName": p.name,
      "placeType": "D",
      "tinh": tinh.name,
      "tinhKhongDau": tinhNameKhongDau,
      "type": "Place",
      "duong": p.name,
      "duongKhongDau": streetKhongDau,
      "parentId" : huyenId,
      "pre" : p.pre
    };

    upsert(streetObj);
  })
}

function processHuyen(districts, tinhObj) {
  districts.forEach((d) => {
    console.log("     " + d.id
      + ", name:" + d.name
      + ", pre:" + d.pre
      + ", project:" + d.project.length
      + ", street:" + d.street.length
      + ", ward:" + d.ward.length);

    let huyenName = (d.pre + " " + d.name).trim();
    let huyenKhongDau  = placeUtil.chuanHoaAndLocDau(d.name);
    let huyenId = "Place_H_" +  d.id;

    let huyenObj = {
      "fullName": huyenName + ", " + tinhObj.placeName,
      "ggMatched": false,
      "huyen": d.name,
      "huyenKhongDau": huyenKhongDau,
      "id": huyenId,
      "nameKhongDau": huyenKhongDau,
      "placeName": d.name,
      "placeType": "H",
      "tinh": tinhObj.placeName,
      "tinhKhongDau": tinhObj.tinhKhongDau,
      "type": "Place",
      "pre" : d.pre,
      "parentId" : tinhObj.id,
      "code" : d.id
    };

    //insert(huyenObj, (res) => {console.log("Success", res);});


    //processXa(d.ward, huyenObj);
    processDuAn(d.project, huyenObj);
    //processStreet(d.street);
  });
}

function load(fn) {
  var data = require('./data/' + fn);
  console.log("data.length = " + data.length);
  data.forEach((tinh) => {
    //console.log(data[i]);
    console.log("Tinh:",tinh.code, tinh.name);

    var tinhNameKhongDau  = placeUtil.chuanHoaAndLocDau(tinh.name);
    let tinhId = "Place_T_" + tinh.code;

    var tinhObj = {
      "id" : tinhId,
      "fullName": tinh.name,
      "ggMatched": false,
      "nameKhongDau": tinhNameKhongDau,
      "placeName": tinh.name,
      "placeType": "T",
      "tinh": tinh.name,
      "tinhKhongDau": tinhNameKhongDau,
      "type": "Place",
      "code" : tinh.code,
    };

    //insert(tinhObj, (res) => {console.log("Success", res);});

    processHuyen(tinh.district, tinhObj);
  });
}
load("city1.json");
load("city2.json");
load("city3.json");
load("city4.json");

//useGoogleToAddMissingViewportInDB();