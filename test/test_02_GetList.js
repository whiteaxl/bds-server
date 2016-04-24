"use strict";

var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:5000");

describe("02.Find API testsuite",function(){

    it("Tra ve BadRequest - 400 khi Parameter sai ",function(done){
        server
            .post("/api/find")
            .send({})
            .expect("Content-type",/json/)
            .end(function(err,res){
                res.status.should.equal(400);
                done();
            });
    });

    var testGeoBox = function(done){
        var geoBox = [105.84372998042551,20.986007099732642,105.87777141957429,21.032107100267314];

        server
            .post("/api/find")
            .send({
                "loaiTin":0,"orderBy":"giaDESC",
                "geoBox":geoBox
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestGeoBox, length:" + res.body.length);
                res.body.length.should.equal(86);

                //check viewport
                var viewport = res.body.viewport;
                viewport.southwest.lat.should.equal(geoBox[0]);
                viewport.southwest.lon.should.equal(geoBox[1]);
                viewport.northeast.lat.should.equal(geoBox[2]);
                viewport.northeast.lon.should.equal(geoBox[3]);

                done();
            });
    };

    it("Tim kiem theo geoBox",testGeoBox);


    //-----------------------------
    var testCurrentLocation = function(done){

        server
            .post("/api/find")
            .send({
                "loaiTin":0,"giaBETWEEN":[0,9999999],"soPhongNguGREATER":"0"
                ,"soTangGREATER":"0","dienTichBETWEEN":[0,9999999],
                "place":{"fullName":"Current Location"
                    ,"currentLocation":{"lat":21.041705,"lon":105.760993},"radiusInKm":1},
                "limit":200,
                "ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestCurrentLocation, length:" + res.body.length);

                res.body.length.should.equal(46);

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

    it("Tim kiem theo CurrentLoc",testCurrentLocation);

    //-----------------------------
    var testDiaDiem = function(done){

        server
            .post("/api/find")
            .send({"loaiTin":0,"giaBETWEEN":[0,9999999],"soPhongNguGREATER":"0","soTangGREATER":"0"
                ,"dienTichBETWEEN":[0,9999999],"place":{"placeId":"ChIJiyiB48BUNDERGA0xeslhAzc"
                    ,"relandTypeName":"Dia diem","fullName":"Cau Dien Nursery School, Phú Diễn, Hanoi","radiusInKm":0.5}
                ,"limit":200,"ngayDaDang":30})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestCurrentLocation, length:" + res.body.length);
                var list = res.body.list;
                for (var i in list) {
                    console.log(i + " - " + list[i].place.geo.lat + "," + list[i].place.geo.lon  + " - " + list[i].adsID);
                }

                res.body.length.should.equal(7);

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

    it("Tim kiem theo testDiaDiem",testDiaDiem);




    //-----------------------------
    var testDiaChinh = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"giaBETWEEN":[0,9999999],"soPhongNguGREATER":"0","soTangGREATER":0,"dienTichBETWEEN":[0,9999999]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc","relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi","radiusInKm":0.5},
                "limit":200,"ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestDiaChinh, length:" + res.body.length);
                res.body.length.should.equal(89);

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

    it("Tim kiem theo DiaChinh",testDiaChinh);

    //-----------------------------
    var testLoaiNhaDat = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,9999999]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.body.length.should.equal(25);

                console.log("\ntestLoaiNhaDat 2, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo LoaiNhaDat",testLoaiNhaDat);

    //-----------------------------
    var testGia3000_4000 = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"giaBETWEEN":[3000,4000]
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,9999999]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.body.length.should.equal(7);

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.gia + " -- " + one.adsID);
                }

                console.log("\ntestGia500_1000, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo gia",testGia3000_4000);

    //-----------------------------
    var testDienTich40_50 = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[40,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.body.length.should.equal(6);

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.dienTich + " -- " + one.adsID);
                }

                console.log("\ntestDienTich40_50, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo DienTich ",testDienTich40_50);

    //-----------------------------
    var testOrderDienTich = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[40,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
                ,"orderBy" :'dienTichASC'

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.body.length.should.equal(6);
                res.body.list[0].dienTich.should.equal(41);
                res.body.list[5].dienTich.should.equal(50);

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.dienTich + " -- " + one.adsID);
                }

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderDienTich ",testOrderDienTich);

    //-----------------------------
    var testSoPhongNgu = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[40,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.body.length.should.equal(6);

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.dienTich + " -- " + one.adsID);
                }

                console.log("\ntestDienTich40_50, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo DienTich ",testSoPhongNgu);

    //-----------------------------
    var testOrderGia = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[40,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
                ,"orderBy" :'giaASC'

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.gia + " -- " + one.adsID);
                }

                res.body.length.should.equal(6);
                res.body.list[0].gia.should.equal(3850);
                res.body.list[5].gia.should.equal(7800);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderGia ",testOrderGia);

    //-----------------------------
    var testOrderGiaDESC = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[40,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
                ,"orderBy" :'giaDESC'

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.gia + " -- " + one.adsID);
                }

                res.body.length.should.equal(6);
                res.body.list[0].gia.should.equal(7800);
                res.body.list[5].gia.should.equal(3850);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderGiaDESC ",testOrderGiaDESC);

    //-----------------------------
    var testOrderSoPhongNgu = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
                ,"orderBy" :'soPhongNguASC'

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.soPhongNgu + " -- " + one.adsID);
                }

                res.body.length.should.equal(8);
                res.body.list[0].soPhongNgu.should.equal(1);
                res.body.list[4].soPhongNgu.should.equal(2);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderSoPhongNgu ",testOrderSoPhongNgu);

    //-----------------------------
    var testOrderSoPhongNgu = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
                ,"orderBy" :'soPhongNguDESC'

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.soPhongNgu + " -- " + one.adsID);
                }

                res.body.length.should.equal(8);
                res.body.list[0].soPhongNgu.should.equal(2);
                res.body.list[4].soPhongNgu.should.equal(1);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderSoPhongNgu DESC",testOrderSoPhongNgu);

    //-----------------------------
    var testOrderNgayDang = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
                ,"orderBy" :'ngayDangTinDESC'

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.ngayDangTin + " -- " + one.adsID);
                }

                res.body.length.should.equal(8);
                res.body.list[0].ngayDangTin.should.equal('23-04-2016');
                res.body.list[7].ngayDangTin.should.equal('15-04-2016');

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderNgayDang DESC ",testOrderNgayDang);


    //-----------------------------
    var testOrderGiaM2 = function(done){
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
                ,"orderBy" :'giaM2ASC'

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.giaM2 + " -- " + one.adsID);
                }

                res.body.length.should.equal(8);
                res.body.list[0].giaM2.should.equal(13.333);
                res.body.list[3].giaM2.should.equal(32.751);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderGiaM2 ASC ",testOrderGiaM2);


});