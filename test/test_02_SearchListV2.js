"use strict";

var supertest = require("supertest");
var should = require("should");
var moment = require('moment');
var constant = require('../src/lib/constant');

var server = supertest.agent("http://localhost:5000");


/**
 *  Co' 3 loai search:
 *      Tim kiem theo GeoBox, polygon : phuc vu MAP
 *      Tim kiem theo Dia Chinh : search text
 *      Tim kiem theo Dia Diem  + Ban Kinh: search text
 *  Thu tu uu tien khi tim kiem: GeoBox > Dia Chinh/Dia Diem
 *  Su dung tim theo BanKinh cho: DiaDiem (ko phai Tinh/Huyen/Xa), Current Location
 * Request json: {
 *  loaiTin: bat buoc Number, 0=BAN, 1 = THUE
 *  loaiNhaDat: Number, eg: 1,2,... (tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js)
 *  giaBETWEEN: Array, eg [0,85] : <from,to>, don vi la` TRIEU (voi THUE la trieu/thang)
 *  dienTichBETWEEN: Array: [from,to] , don vi la` m2
 *  ngayDangTinGREATER: greater or equals
 *  soPhongNguGREATER: greater or equals
 *  soPhongTamGREATER: greater or equals
 *  huongNha: Number, 1.... (tham khao trong https://github.com/reway/bds/blob/master/src/assets/DanhMuc.js)
 *  viewport: {southwest:{lat, lon}, northeast: {lat, lon}}
 *		eg: {southwest:{20.986007099732642,105.84372998042551},northeast:{21.032107100267314,105.87777141957429}}
 *  polygon : [{lat, lon}, {}]
 *  circle { //Object
 *      center: {lat, lon}
 *      radius : number in km
 *  }
 *  diaChinh { tinh huyen xa co' dau
 *       tinh, huyen, xa, duAn, duong
 *  }
 *  orderBy: string, eg: ngayDangTinDESC/giaASC/giaDESC/dienTichASC, soPhongTamASC, soPhongNguASC
 *  limit : Number, eg: 25
 *  pageNo : 1,2, 3
 *  isIncludeCountInResponse : true/false
 *}
 *Response : xem chi tiet trong file sample_find.js
 *  {
 *       length: Number, so bai dang thoa man (theo page)
         list: [] Danh sach cac bai dang thoa man
         totalCount : total count (when isIncludeCountInResponse=true)
 *  }
 */

describe("01.Find API testsuite", function () {

  var testGeoBox = function (done) {
    var geoBox = [20.986007099732642, 105.84372998042551, 21.032107100267314, 105.87777141957429];

    server
      .post("/api/find")
      .send({
        loaiTin: 0,
        loaiNhaDat:1,
        giaBETWEEN: [100, 1000],
        dienTichBETWEEN : [20, 100],
        ngayDangTinGREATER : "20160601",
        soPhongNguGREATER : 2,
        soPhongTamGREATER : 1,
        huongNha : 1,
        viewport : {
          "northeast" : {
            "lat" : 21.385027,
            "lng" : 106.0198859
          },
          "southwest" : {
            "lat" : 20.562323,
            "lng" : 105.2854659
          }
        },
        polygon: [{ lat: 20.949542591015966, lon: 105.74858287472355 },
          { lat: 20.949703499103194, lon: 105.74851416616939 },
          { lat: 20.950057499546798, lon: 105.74841110412443 },
          { lat: 20.954627316625018, lon: 105.74696823549515 },
          { lat: 20.957620225314752, lon: 105.74617809419892 },
          { lat: 20.958360407524772, lon: 105.74617809419892 },
          { lat: 20.96157858842053, lon: 105.74600632359981 },
          { lat: 20.9656013156451, lon: 105.74600632359981 },
          { lat: 20.966341497855122, lon: 105.74600632359981 },
          { lat: 20.970171132723316, lon: 105.74676211140525 },
          { lat: 20.975255859805536, lon: 105.74841110412443 },
          { lat: 20.978152223053666, lon: 105.74964784866383 },
          { lat: 20.9786671315845, lon: 105.75002574335285 },
          { lat: 20.981885313953423, lon: 105.75239617038669 },
          { lat: 20.98423458587474, lon: 105.75497272151043 },
          { lat: 20.98468513175995, lon: 105.75565980233429 },
          { lat: 20.986583857796056, lon: 105.76081290458177 },
          { lat: 20.98684131279806, lon: 105.76263366632749 },
          { lat: 20.986970039562475, lon: 105.77249326915187 },
          { lat: 20.985714948821617, lon: 105.77812732813331 },
          { lat: 20.983204767339906, lon: 105.780806941302 },
          { lat: 20.982593313367467, lon: 105.78108177237347 },
          { lat: 20.977701677168458, lon: 105.78173449970654 },
          { lat: 20.97715458731481, lon: 105.78173449970654 },
          { lat: 20.972359496557406, lon: 105.78190626873307 },
          { lat: 20.971458406260155, lon: 105.78190626873307 },
          { lat: 20.964828952112263, lon: 105.78077258623863 },
          { lat: 20.958263862083168, lon: 105.78046340010377 },
          { lat: 20.951956227056073, lon: 105.7801885690323 },
          { lat: 20.94696804541546, lon: 105.77768072489013 },
          { lat: 20.946517499530252, lon: 105.77719976972877 },
          { lat: 20.94500495526056, lon: 105.7740391998261 },
          { lat: 20.94523022746658, lon: 105.76685921017042 },
          { lat: 20.94674277320944, lon: 105.75861424657445 },
          { lat: 20.947708227625483, lon: 105.75538496969023 },
          { lat: 20.947997863950295, lon: 105.75528190764528 }]
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestGeoBox, length:" + res.body.length);
        res.body.length.should.equal(69);

        //check viewport
        var viewport = res.body.viewport;
        viewport.southwest.lat.should.equal(geoBox[0]);
        viewport.southwest.lon.should.equal(geoBox[1]);
        viewport.northeast.lat.should.equal(geoBox[2]);
        viewport.northeast.lon.should.equal(geoBox[3]);

        done();
      });
  };

  it("Tim kiem theo geoBox", testGeoBox);


  //-----------------------------
  var testGeoBox2 = function (done) {
    var geoBox = [20.986007099732642, 105.84372998042551, 21.032107100267314, 105.87777141957429];

    server
      .post("/api/find")
      .send({
        "loaiTin": 1,
        "geoBox": geoBox
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestGeoBox, length:" + res.body.length);
        res.body.length.should.equal(69);

        //check viewport
        var viewport = res.body.viewport;
        viewport.southwest.lat.should.equal(geoBox[0]);
        viewport.southwest.lon.should.equal(geoBox[1]);
        viewport.northeast.lat.should.equal(geoBox[2]);
        viewport.northeast.lon.should.equal(geoBox[3]);

        done();
      });
  };
  //-----------------------------
  var testCurrentLocation = function (done) {

    server
      .post("/api/find")
      .send({
        "loaiTin": 0,
        "place": {
          "fullName": "Current Location"
          , "currentLocation": {"lat": 21.041705, "lon": 105.760993}, "radiusInKm": 1
        }

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestCurrentLocation, length:" + res.body.length);

        res.body.length.should.equal(40); //TODO: ?40

        //check viewport
        var viewport = res.body.viewport;

        viewport.southwest.should.have.property('lat');
        viewport.southwest.should.have.property('lon');
        viewport.northeast.should.have.property('lat');
        viewport.northeast.should.have.property('lon');
        viewport.northeast.should.not.have.property('lng');
        done();
      });
  };

  it("Tim kiem theo CurrentLoc", testCurrentLocation);

  //-----------------------------
  var testDiaDiem = function (done) {

    server
      .post("/api/find")
      .send({
        "loaiTin": 0
        , "soPhongNguGREATER": 0, "soTangGREATER": 0
        , "place": {
          "placeId": "ChIJiyiB48BUNDERGA0xeslhAzc"
          , "relandTypeName": "Dia diem"
          , "fullName": "Cau Dien Nursery School, Phú Diễn, Hanoi"
          , "radiusInKm": 0.5
        }
        , "limit": 200
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestCurrentLocation, length:" + res.body.length);
        var list = res.body.list;

        res.body.length.should.equal(5);

        //check viewport
        var viewport = res.body.viewport;

        viewport.southwest.should.have.property('lat');
        viewport.southwest.should.have.property('lon');
        viewport.northeast.should.have.property('lat');
        viewport.northeast.should.have.property('lon');
        viewport.northeast.should.not.have.property('lng');
        done();
      });
  };

  it("Tim kiem theo testDiaDiem", testDiaDiem);


  //-----------------------------
  var testDiaChinh = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc", "relandTypeName": "Huyen"
          , "fullName": "Cầu Giấy, Hanoi", "radiusInKm": 0.5
        },
        "limit": 200
        , "ngayDaDang": 300

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log("\ntestDiaChinh, length:" + res.body.length);
        res.body.length.should.equal(85);

        //check viewport
        var viewport = res.body.viewport;
        viewport.southwest.should.have.property('lat');
        viewport.southwest.should.have.property('lon');
        viewport.northeast.should.have.property('lat');
        viewport.northeast.should.have.property('lon');
        viewport.northeast.should.not.have.property('lng');

        done();
      });
  };

  it("Tim kiem theo DiaChinh", testDiaChinh);

  //-----------------------------
  var testLoaiNhaDat = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 9999999]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200, "ngayDaDang": 300

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.body.length.should.equal(21);

        console.log("\ntestLoaiNhaDat 2, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem theo LoaiNhaDat", testLoaiNhaDat);

  //-----------------------------
  var testGia3000_4000 = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "giaBETWEEN": [3000, 4000]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 9999999]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.body.length.should.equal(6);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.gia + " -- " + one.adsID);
        }

        console.log("\ntestGia500_1000, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem theo gia", testGia3000_4000);

  //-----------------------------
  var testDienTich40_50 = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [40, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.body.length.should.equal(7);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.dienTich + " -- " + one.adsID);
        }

        console.log("\ntestDienTich40_50, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem theo DienTich ", testDienTich40_50);

  //-----------------------------
  var testSoPhongNgu = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongNguGREATER": 3
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 9999999]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.soPhongNgu + " -- " + one.adsID);
        }

        res.body.length.should.equal(14);

        console.log("\ntestSoPhongNgu, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem theo SoPhongNgu ", testSoPhongNgu);

  //-----------------------------
  var testSoPhongTam = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongTamGREATER": 3
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 9999999]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
        },
        "limit": 200
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.soPhongNgu + " -- " + one.adsID);
        }

        res.body.length.should.equal(3);

        console.log("\ntestSoPhongTam, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem theo testSoPhongTam ", testSoPhongTam);

  //-----------------------------
  var testHuongNha = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "huongNha": 4
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 9999999]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
        },
        "limit": 200
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.huongNha + " -- " + one.adsID);
        }

        res.body.length.should.equal(2);

        console.log("\ntestHuongNha, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem theo testHuongNha ", testHuongNha);

  //-----------------------------
  var testTinBan = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "huongNha": 4
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 9999999]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
        },
        "limit": 200
      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
        }

        res.body.length.should.equal(2);
        let one = res.body.list[0];
        console.log(one);

        one.giaFmt.should.equal("5.50 TỶ");
        one.dienTichFmt.should.equal("152m²");
        one.soPhongNguFmt.should.equal("3pn");
        one.diaChi.should.equal('Dự án N05 Trần Duy Hưng, Cầu Giấy, Hà Nội');

        console.log("\n testTinBan, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem theo testTinBan ", testTinBan);

  //-----------------------------
  var testOrderDienTich = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [40, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'dienTichASC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        console.log(res.body.list)

        res.body.list[0].dienTich.should.equal(41);
        res.body.list[5].dienTich.should.equal(48);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.dienTich + " -- " + one.adsID);
        }

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testOrderDienTich ", testOrderDienTich);

  //-----------------------------
  var testSoPhongNgu = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [40, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.body.length.should.equal(7);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.dienTich + " -- " + one.adsID);
        }

        console.log("\ntestDienTich40_50, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testSoPhongNgu", testSoPhongNgu);

  //-----------------------------
  var testngayDaDang = function (done) {
    const ngayDangTinDate = moment('20160415', constant.FORMAT.DATE_IN_DB);
    const soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');

    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "dienTichBETWEEN": [40, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "ngayDaDang": soNgayDaDangTin

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.ngayDangTin + " -- " + one.adsID);
        }

        res.body.length.should.equal(5);

        console.log("\n testngayDaDang, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testngayDaDang", testngayDaDang);


  //-----------------------------
  var testOrderGia = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [40, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'giaASC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.gia + " -- " + one.adsID);
        }

        res.body.list[0].gia.should.equal(3850);
        res.body.list[5].gia.should.equal(5950);

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testOrderGia ", testOrderGia);

  //-----------------------------
  var testOrderGiaDESC = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 2, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [40, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'giaDESC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.gia + " -- " + one.adsID);
        }

        res.body.list[0].gia.should.equal(7800);
        res.body.list[5].gia.should.equal(4900);

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testOrderGiaDESC ", testOrderGiaDESC);

  //-----------------------------
  var testOrderSoPhongNgu = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'soPhongNguASC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.soPhongNgu + " -- " + one.adsID);
        }

        res.body.length.should.equal(5);
        res.body.list[3].soPhongNgu.should.equal(1);
        res.body.list[4].soPhongNgu.should.equal(2);

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testOrderSoPhongNgu ", testOrderSoPhongNgu);

  //-----------------------------
  var testOrderSoPhongNgu = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'soPhongNguDESC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.soPhongNgu + " -- " + one.adsID);
        }

        res.body.length.should.equal(5);
        res.body.list[0].soPhongNgu.should.equal(2);
        res.body.list[1].soPhongNgu.should.equal(1);

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testOrderSoPhongNgu DESC", testOrderSoPhongNgu);

  //-----------------------------
  var testOrderNgayDang = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'ngayDangTinDESC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.ngayDangTin + " -- " + one.adsID);
        }

        res.body.list[0].ngayDangTin.should.equal('20160425');
        res.body.list[4].ngayDangTin.should.equal('20160419');

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testOrderNgayDang DESC ", testOrderNgayDang);


  //-----------------------------
  var testOrderGiaM2 = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'giaM2ASC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          console.log(one.giaM2 + " -- " + one.adsID);
        }

        res.body.length.should.equal(5);
        res.body.list[1].giaM2.should.equal(13.333);
        res.body.list[4].giaM2.should.equal(25);

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testOrderGiaM2 ASC ", testOrderGiaM2);


  //-----------------------------
  var testPaging = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 2
        , "orderBy": 'giaM2ASC'
        , "page": 2

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          //console.log(one.giaM2 + " -- " + one.adsID);
        }

        res.body.length.should.equal(2);

        console.log("\ntestOrder, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testPaging ASC ", testPaging);

  //-----------------------------
  var testImageMedium = function (done) {
    server
      .post("/api/find")
      .send({
        "loaiTin": 0, "loaiNhaDat": 1, "soPhongNguGREATER": 0
        , "giaBETWEEN": [0, 9999999]
        , "soTangGREATER": 0, "dienTichBETWEEN": [0, 50]
        , "place": {
          "placeId": "ChIJMxD5VlerNTER_UtnLUQXaVc"
          , "relandTypeName": "Huyen", "fullName": "Cầu Giấy, Hanoi"
          , "radiusInKm": 0.5
        },
        "limit": 200
        , "orderBy": 'giaM2ASC'

      })
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        for (var e in res.body.list) {
          let one = res.body.list[e];
          //console.log(one.image);
        }

        res.body.length.should.equal(5);
        res.body.list[0].image.cover.indexOf("745x510").should.equal(36);
        res.body.list[0].image.images[1].indexOf("745x510").should.equal(38);

        console.log("\testImageMedium, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testImageMedium ", testImageMedium);

  //--- khi co' geoBox, ko dc truyen len radius
  var testReturnBoxTitle = function (done) {
    server
      .post("/api/find")
      .send({
          loaiTin: 0,
          geoBox: [20.986007099732642, 105.84372998042551, 21.032107100267314, 105.87777141957429]
        }
      )
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        console.log(res.body.viewport);
        console.log(res.body.length);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          //console.log(one.image);
        }

        res.body.viewport.center.formatted_address.should.equal('251 Trần Khát Chân, Thanh Nhàn, Hai Bà Trưng, Hà Nội, Vietnam');
        res.body.viewport.center.name.should.equal('Hai Bà Trưng, Hà Nội');

        console.log("\n testReturnBoxTitle, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testReturnBoxTitle ", testReturnBoxTitle);

  //polygon

  var testPolygon = function (done) {
    server
      .post("/api/find")
      .send({
          loaiTin: 0,
          polygon: [
            {lat: 20.986007099732642, lon: 105.84372998042551},
            {lat: 21.032107100267314, lon: 105.84372998042551},
            {lat: 21.032107100267314, lon: 105.87777141957429},
            {lat: 20.986007099732642, lon: 105.87777141957429}]
        }
      )
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        console.log(res.body.viewport);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          //console.log(one.image);
        }

        res.body.viewport.center.formatted_address.should.equal('251 Trần Khát Chân, Thanh Nhàn, Hai Bà Trưng, Hà Nội, Vietnam');
        res.body.length.should.equal(69);

        console.log("\n testPolygon, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testPolygon ", testPolygon);

  var testPolygon1 = function (done) {
    server
      .post("/api/find")
      .send({
          loaiTin: 0,
          polygon: [
            {lat: 20.986007099732642, lon: 105.84372998042551},
            {lat: 21.032107100267314, lon: 105.84372998042551},
            {lat: 21.032107100267314, lon: 105.87777141957429}]
        }
      )
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        console.log(res.body.viewport);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          //console.log(one.image);
        }

        res.body.viewport.center.formatted_address.should.equal('2 Lê Ngọc Hân, Ngô Thì Nhậm, Hai Bà Trưng, Hà Nội, Vietnam');
        res.body.length.should.equal(14);

        console.log("\n testPolygon, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testPolygon1 ", testPolygon1);


  var testPolygon2 = function (done) {
    server
      .post("/api/find")
      .send({
          loaiTin: 0,
          polygon: [
            {lat: 20.986007099732642, lon: 105.84372998042551},
            {lat: 21.032107100267314, lon: 105.87777141957429},
            {lat: 20.986007099732642, lon: 105.87777141957429}]
        }
      )
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {

        console.log(res.body.viewport);

        for (var e in res.body.list) {
          let one = res.body.list[e];
          //console.log(one.image);
        }

        res.body.viewport.center.formatted_address.should.equal('1 Lạc Trung, Vĩnh Tuy, Hai Bà Trưng, Hà Nội, Vietnam');
        res.body.length.should.equal(55);

        console.log("\n testPolygon, length:" + res.body.length);
        done();
      });
  };

  it("Tim kiem - testPolygon2 ", testPolygon2);


});