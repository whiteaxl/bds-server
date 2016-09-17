"use strict";

var supertest = require("supertest");
var should = require("should");
var moment = require('moment');
var constant = require('../src/lib/constant');
var url  =`http://${process.env.IP}:${process.env.PORT}`;

console.log("Server URL:", url);

var server = supertest.agent(url);

describe("01.Find API testsuite", function () {
  this.timeout(15000);

  var testFind = function (done) {
    server
      .post("/api/v2/find")
      .send({
        "loaiTin": 0,
        "loaiNhaDat":[1],
        "giaBETWEEN": [100, 1000],
        "dienTichBETWEEN" : [20, 100],
        "ngayDangTinGREATER" : "20160601",
        "soPhongNguGREATER" : 2,
        "soPhongTamGREATER" : 1,
        "huongNha" : [1],
        "viewport" : {
          "northeast" : {
            "lat" : 21.385027,
            "lon" : 106.0198859
          },
          "southwest" : {
            "lat" : 20.562323,
            "lon" : 105.2854659
          }
        },
        "polygon": [{ "lat": 20.949542591015966, "lon": 105.74858287472355 },
          { "lat": 20.949703499103194, "lon": 105.74851416616939 },
          { "lat": 20.950057499546798, "lon": 105.74841110412443 },
          { "lat": 20.954627316625018, "lon": 105.74696823549515 },
          { "lat": 20.957620225314752, "lon": 105.74617809419892 },
          { "lat": 20.958360407524772, "lon": 105.74617809419892 },
          { "lat": 20.96157858842053, "lon": 105.74600632359981 },
          { "lat": 20.9656013156451, "lon": 105.74600632359981 },
          { "lat": 20.966341497855122, "lon": 105.74600632359981 },
          { "lat": 20.970171132723316, "lon": 105.74676211140525 },
          { "lat": 20.975255859805536, "lon": 105.74841110412443 },
          { "lat": 20.978152223053666, "lon": 105.74964784866383 },
          { "lat": 20.9786671315845, "lon": 105.75002574335285 },
          { "lat": 20.981885313953423, "lon": 105.75239617038669 },
          { "lat": 20.98423458587474, "lon": 105.75497272151043 },
          { "lat": 20.98468513175995, "lon": 105.75565980233429 },
          { "lat": 20.986583857796056, "lon": 105.76081290458177 },
          { "lat": 20.98684131279806, "lon": 105.76263366632749 },
          { "lat": 20.986970039562475, "lon": 105.77249326915187 },
          { "lat": 20.985714948821617, "lon": 105.77812732813331 },
          { "lat": 20.983204767339906, "lon": 105.780806941302 },
          { "lat": 20.982593313367467, "lon": 105.78108177237347 },
          { "lat": 20.977701677168458, "lon": 105.78173449970654 },
          { "lat": 20.97715458731481, "lon": 105.78173449970654 },
          { "lat": 20.972359496557406, "lon": 105.78190626873307 },
          { "lat": 20.971458406260155, "lon": 105.78190626873307 },
          { "lat": 20.964828952112263, "lon": 105.78077258623863 },
          { "lat": 20.958263862083168, "lon": 105.78046340010377 },
          { "lat": 20.951956227056073, "lon": 105.7801885690323 },
          { "lat": 20.94696804541546, "lon": 105.77768072489013 },
          { "lat": 20.946517499530252, "lon": 105.77719976972877 },
          { "lat": 20.94500495526056, "lon": 105.7740391998261 },
          { "lat": 20.94523022746658, "lon": 105.76685921017042 },
          { "lat": 20.94674277320944, "lon": 105.75861424657445 },
          { "lat": 20.947708227625483, "lon": 105.75538496969023 },
          { "lat": 20.947997863950295, "lon": 105.75528190764528 }],
        "circle": {
          "center" : {"lat": 20.964828952112263, "lon": 105.78077258623863},
          "radius" : 2
        },
        "diaChinh" : {
          "tinhKhongDau" : "ha-noi",
          "huyenKhongDau" : "cau-giay"
        },
        "orderBy" : {"name": "ngayDangTin", "type":"ASC"},
        "limit" : 25,
        "pageNo" : 1,
        "isIncludeCountInResponse" : true
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestFind, length:" + res.body.length);

        done();
      });
  };

  it("Tim kiem theo geoBox",testFind);

  //---------------------
  var testFind_02 = function (done) {
    server
      .post("/api/v2/find")
      .send({
        "loaiTin": 0,
        "giaBETWEEN": [0, 3000],
        "dienTichBETWEEN" : [20, 100],
        "ngayDangTinGREATER" : "20150601",
        "viewport" : {
          "northeast" : {
            "lat" : 21.385027,
            "lon" : 106.0198859
          },
          "southwest" : {
            "lat" : 20.562323,
            "lon" : 105.2854659
          }
        },
        "diaChinh" : {
          "tinhKhongDau" : "ha-noi",
          "huyenKhongDau" : "cau-giay"
        },
        "orderBy" : {"name": "ngayDangTin", "type":"ASC"},
        "limit" : 25,
        "pageNo" : 1,
        "isIncludeCountInResponse" : true
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestFind, length:" + res.body.length);

        done();
      });
  };

  it("Tim kiem theo testFind_02",testFind_02);
  //------------
  var testFind_03 = function (done) {
    server
      .post("/api/v2/find")
      .send({
        "loaiTin": 0,
        "giaBETWEEN": [0, 3000],
        "dienTichBETWEEN" : [20, 100],
        "ngayDangTinGREATER" : "20150601",
        "viewport" : {
          "northeast" : {
            "lat" : 21.385027,
            "lon" : 106.0198859
          },
          "southwest" : {
            "lat" : 20.562323,
            "lon" : 105.2854659
          }
        },
        "diaChinh" : {
          "tinhKhongDau" : "ha-noi",
          "huyenKhongDau" : "cau-giay"
        },
        "orderBy" : {"name": "ngayDangTin", "type":"ASC"},
        "limit" : 25,
        "pageNo" : 1,
        "isIncludeCountInResponse" : false
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestFind, length:", res.body);

        done();
      });
  };

  it("Tim kiem theo NO Count",testFind_03);
});