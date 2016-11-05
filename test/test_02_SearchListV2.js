"use strict";

var supertest = require("supertest");
var should = require("should");
var moment = require('moment');
var constant = require('../src/lib/constant');
var url  =`http://${process.env.IP || '203.162.13.170'|| '127.0.0.1' }:${process.env.PORT || 5000}`;

console.log("Server URL:", url);

var server = supertest.agent(url);

describe("01.Find API testsuite", function () {
  this.timeout(15000);

  var testFind = function (done) {
    server
      .post("/api/v2/find")
      .send({
        loaiTin: 0,
        viewport:
        { southwest: { lat: 21.00788690844453, lon: 105.82188297047948 },
          northeast: { lat: 21.032189565113654, lon: 105.83934842206385 } },
        limit: 10,
        huongNha: [ 0 ],
        polygon:
          [ { lat: 21.010895110828983, lon: 105.82660858522243 },
            { lat: 21.01124843944973, lon: 105.82579623885017 },
            { lat: 21.01171048456917, lon: 105.82524500381186 },
            { lat: 21.01241714181067, lon: 105.82454870692136 },
            { lat: 21.013232515550857, lon: 105.82382339766042 },
            { lat: 21.01423814316376, lon: 105.82321413788124 },
            { lat: 21.01551556202339, lon: 105.82283697706555 },
            { lat: 21.017037593005075, lon: 105.82266290284292 },
            { lat: 21.01855962398676, lon: 105.82263389047249 },
            { lat: 21.020000117594428, lon: 105.82263389047249 },
            { lat: 21.02138625295275, lon: 105.82263389047249 },
            { lat: 21.02266367181238, lon: 105.82260487810204 },
            { lat: 21.023995448921358, lon: 105.82260487810204 },
            { lat: 21.02532722603033, lon: 105.82260487810204 },
            { lat: 21.026360032767904, lon: 105.82280796469512 },
            { lat: 21.027718989001553, lon: 105.82338821210386 },
            { lat: 21.028996407861182, lon: 105.82431660795787 },
            { lat: 21.030029214598756, lon: 105.82541907803449 },
            { lat: 21.03076305096493, lon: 105.82660858522243 },
            { lat: 21.03144252908175, lon: 105.82863945115305 },
            { lat: 21.03152406645577, lon: 105.83058327997237 },
            { lat: 21.03141534995708, lon: 105.83197587375338 },
            { lat: 21.030953304837638, lon: 105.83342649227525 },
            { lat: 21.029838960726046, lon: 105.83548637057632 },
            { lat: 21.028914870487164, lon: 105.83676291487556 },
            { lat: 21.027066690009402, lon: 105.83830057050875 },
            { lat: 21.0257620920251, lon: 105.83899686739926 },
            { lat: 21.023152896056494, lon: 105.8398092137715 },
            { lat: 21.021685223324152, lon: 105.83998328799413 },
            { lat: 21.02019037146714, lon: 105.84007032510544 },
            { lat: 21.01779860849592, lon: 105.84007032510544 },
            { lat: 21.01627657751423, lon: 105.83975118903064 },
            { lat: 21.014210964039084, lon: 105.839112916881 },
            { lat: 21.011955096691228, lon: 105.8378653849522 },
            { lat: 21.011085364701692, lon: 105.83719810043213 },
            { lat: 21.01024281183683, lon: 105.83641476643031 },
            { lat: 21.009590512844678, lon: 105.83557340768763 },
            { lat: 21.009264363348603, lon: 105.83484809842669 },
            { lat: 21.009155646849912, lon: 105.8342388386475 },
            { lat: 21.009155646849912, lon: 105.83302031908913 },
            { lat: 21.009074109475893, lon: 105.83151167582638 },
            { lat: 21.009074109475893, lon: 105.83046723049063 },
            { lat: 21.009074109475893, lon: 105.82942278515488 },
            { lat: 21.00923718422393, lon: 105.82861043878262 },
            { lat: 21.009753587592716, lon: 105.82747895633555 },
            { lat: 21.01048742395889, lon: 105.82655056048155 },
            { lat: 21.011112543826364, lon: 105.82582525122062 },
            { lat: 21.011302797699077, lon: 105.82568018936843 } ],
        pageNo: 1,
        isIncludeCountInResponse: true,
        giaBETWEEN: [ -1, 9999999 ],
        dienTichBETWEEN: [ -1, 9999999 ]
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestFind, length:" + res.body.length);

        console.log("\ntestFind, 1:", res.body.list[0].image);
        console.log("\ntestFind, 1:", res.body.list[1].image);
        console.log("\ntestFind, 1:", res.body.list[2].image);

        done();
      });
  };

  it("Tim kiem theo geoBox",testFind);

  //---------------------
  var testFind_02 = function (done) {
    server
      .post("/api/v2/find")
      .send(
        {
        "loaiTin": 0,
        "ngayDangTinGREATER" : "20150601",
        "diaChinh" : {
          "tinhKhongDau" : "HN",
          "huyenKhongDau" : "7"
        },
        "orderBy" : {"name": "ngayDangTin", "type":"DESC"},
        "limit" : 50,
        "pageNo" : 1,
        "isIncludeCountInResponse" : true
      }
      )
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestFind, length:" + res.body.length);

        res.body.list.forEach((e) => {
          console.log("\n", e.image);
        });

        done();
      });
  };

  it("Tim kiem theo testFind_02",testFind_02);
  //------------
  var testFind_03 = function (done) {
    server
      .post("/api/v2/find")
      .send(

        {
          "loaiTin": 0,
          "diaChinh": {
            "tinhKhongDau": "HN",
            "huyenKhongDau": "13",
            "fullName": "Huyện Thanh Trì, Hà Nội"
          },
          "viewport": {
            "northeast": {
              "lat": 21.003782,
              "lon": 105.90903
            },
            "southwest": {
              "lat": 20.986124,
              "lon": 105.875885
            }
          },
          "limit": 25,
          "huongNha": [
            -1
          ],
          "pageNo": 1,
          "isIncludeCountInResponse": true,
          "userID": "User_1",
          "updateLastSearch": true,
          "giaBETWEEN": [
            -1,
            9999999
          ],
          "dienTichBETWEEN": [
            -1,
            9999999
          ]
        }

      )
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestFind, length:", res.body);
        done();
      });
  };

  it("Tim kiem theo NO Count",testFind_03);
});