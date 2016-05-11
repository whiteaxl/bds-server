"use strict";

var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:5000");

describe("02.Find API testsuite",function(){

    it("Tra ve BadRequest - 400 khi Parameter sai ",function(done){
        server
            .post("/api/search")
            .send({})
            .expect("Content-type",/json/)
            .end(function(err,res){
                res.status.should.equal(400);
                done();
            });
    });

    var testGeoBox = function(done){
        var geoBox = [20.986007099732642,105.84372998042551,21.032107100267314,105.87777141957429];

        server
            .post("/api/search")
            .send({
                "loaiTin":0,
                "geoBox":geoBox
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestGeoBox, length:" + res.body.length);
                res.body.length.should.equal(68);

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
    var testGeoBox2 = function(done){
        var geoBox = [20.986007099732642,105.84372998042551,21.032107100267314,105.87777141957429];

        server
            .post("/api/search")
            .send({
                "loaiTin":1,
                "geoBox":geoBox
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
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
    var testCurrentLocation = function(done){

        server
            .post("/api/search")
            .send({
                "loaiTin":0,
                "place":{"fullName":"Current Location"
                    ,"currentLocation":{"lat":21.041705,"lon":105.760993},"radiusInKm":1}

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestCurrentLocation, length:" + res.body.length);

                res.body.length.should.equal(39); //TODO: ?40

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
            .post("/api/search")
            .send({"loaiTin":0
                ,"soPhongNguGREATER":"0","soTangGREATER":"0"
                ,"place":{"placeId":"ChIJiyiB48BUNDERGA0xeslhAzc"
                    ,"relandTypeName":"Dia diem","fullName":"Cau Dien Nursery School, Phú Diễn, Hanoi","radiusInKm":0.5}
                ,"limit":200
                })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestCurrentLocation, length:" + res.body.length);
                var list = res.body.list;

                res.body.length.should.equal(3);

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
            .post("/api/search")
            .send({
                "loaiTin":0
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc","relandTypeName":"Huyen"
                    ,"fullName":"Cầu Giấy, Hanoi","radiusInKm":0.5},
                "limit":200
                ,"ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log("\ntestDiaChinh, length:" + res.body.length);
                res.body.length.should.equal(82);

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
            .post("/api/search")
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
                res.body.length.should.equal(19);

                console.log("\ntestLoaiNhaDat 2, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo LoaiNhaDat",testLoaiNhaDat);

    //-----------------------------
    var testGia3000_4000 = function(done){
        server
            .post("/api/search")
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
                res.body.length.should.equal(5);

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
            .post("/api/search")
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
    var testSoPhongNgu = function(done){
        server
            .post("/api/search")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"soPhongNguGREATER":3
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,9999999]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":30
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.soPhongNgu + " -- " + one.adsID);
                }

                res.body.length.should.equal(14);

                console.log("\ntestSoPhongNgu, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo SoPhongNgu ",testSoPhongNgu);

    //-----------------------------
    var testSoPhongTam= function(done){
        server
            .post("/api/search")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"soPhongTamGREATER":3
                ,"giaBETWEEN":[0,9999999]
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,9999999]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"},
                "limit":200
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.soPhongNgu + " -- " + one.adsID);
                }

                res.body.length.should.equal(3);

                console.log("\ntestSoPhongTam, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo testSoPhongTam ",testSoPhongTam);

    //-----------------------------
    var testHuongNha= function(done){
        server
            .post("/api/search")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"huongNha":4
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,9999999]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"},
                "limit":200
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.huongNha + " -- " + one.adsID);
                }

                res.body.length.should.equal(2);

                console.log("\ntestHuongNha, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem theo testHuongNha ",testHuongNha);

    //-----------------------------
    var testTinBan= function(done){
        server
            .post("/api/search")
            .send({
                "loaiTin":0,"loaiNhaDat":1,"huongNha":4
                ,"soTangGREATER":0,"dienTichBETWEEN":[0,9999999]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"},
                "limit":200
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
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

    it("Tim kiem theo testTinBan ",testTinBan);

    //-----------------------------
    var testOrderDienTich = function(done){
        server
            .post("/api/search")
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

                console.log(res.body.list)

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
            .post("/api/search")
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

    it("Tim kiem - testSoPhongNgu",testSoPhongNgu);

    //-----------------------------
    var testngayDaDang = function(done){
        server
            .post("/api/search")
            .send({
                "loaiTin":0,"loaiNhaDat":2,"soPhongNguGREATER":0
                ,"giaBETWEEN":[0,9999999]
                ,"dienTichBETWEEN":[40,50]
                ,"place":{"placeId":"ChIJMxD5VlerNTER_UtnLUQXaVc"
                    ,"relandTypeName":"Huyen","fullName":"Cầu Giấy, Hanoi"
                    ,"radiusInKm":0.5},
                "limit":200,"ngayDaDang":7

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    console.log(one.ngayDangTin + " -- " + one.adsID);
                }

                res.body.length.should.equal(7);

                console.log("\n testngayDaDang, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testngayDaDang",testngayDaDang);



    //-----------------------------
    var testOrderGia = function(done){
        server
            .post("/api/search")
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
                res.body.list[0].gia.should.equal(4900);
                res.body.list[5].gia.should.equal(7800);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderGia ",testOrderGia);

    //-----------------------------
    var testOrderGiaDESC = function(done){
        server
            .post("/api/search")
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
                res.body.list[5].gia.should.equal(4900);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderGiaDESC ",testOrderGiaDESC);

    //-----------------------------
    var testOrderSoPhongNgu = function(done){
        server
            .post("/api/search")
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

                res.body.length.should.equal(5);
                res.body.list[3].soPhongNgu.should.equal(1);
                res.body.list[4].soPhongNgu.should.equal(2);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderSoPhongNgu ",testOrderSoPhongNgu);

    //-----------------------------
    var testOrderSoPhongNgu = function(done){
        server
            .post("/api/search")
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

                res.body.length.should.equal(5);
                res.body.list[0].soPhongNgu.should.equal(2);
                res.body.list[1].soPhongNgu.should.equal(1);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderSoPhongNgu DESC",testOrderSoPhongNgu);

    //-----------------------------
    var testOrderNgayDang = function(done){
        server
            .post("/api/search")
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

                res.body.length.should.equal(5);
                res.body.list[0].ngayDangTin.should.equal('25-04-2016');
                res.body.list[4].ngayDangTin.should.equal('19-04-2016');

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderNgayDang DESC ",testOrderNgayDang);


    //-----------------------------
    var testOrderGiaM2 = function(done){
        server
            .post("/api/search")
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

                res.body.length.should.equal(5);
                res.body.list[1].giaM2.should.equal(13.333);
                res.body.list[4].giaM2.should.equal(25);

                console.log("\ntestOrder, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testOrderGiaM2 ASC ",testOrderGiaM2);


    //-----------------------------
    var testImageMedium = function(done){
        server
            .post("/api/search")
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
                    //console.log(one.image);
                }

                res.body.length.should.equal(5);
                res.body.list[0].image.cover.indexOf("745x510").should.equal(36);
                res.body.list[0].image.images[1].indexOf("745x510").should.equal(38);

                console.log("\testImageMedium, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testImageMedium ",testImageMedium);

    //--- khi co' geoBox, ko dc truyen len radius

    var testHung = function(done){
        server
            .post("/api/search")
            .send({ loaiTin: 0,
                radiusInKm: 0.5,
                geoBox: [ 105.7974815, 20.9950991, 105.87644590000002, 21.0502942 ] }
            )
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){

                for (var e in res.body.list) {
                    let one =res.body.list[e];
                    //console.log(one.image);
                }

                res.body.length.should.equal(0);

                console.log("\testImageMedium, length:" + res.body.length);
                done();
            });
    };

    it("Tim kiem - testHung ",testHung);



});