var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:5000");

// UNIT test begin

describe("Find API testsuite",function(){

    // #1 should return error 500

    it("Tra ve BadRequest - 400 khi Parameter sai ",function(done){

        // calling home page api
        server
            .post("/api/find")
            .send({})
            .expect("Content-type",/json/)
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(400);
                // Error key should be false.
                //res.body.error.should.equal(true);
                done();
            });
    });

    var testGeoBox = function(done){

        var geoBox = [105.84372998042551,20.986007099732642,105.87777141957429,21.032107100267314];

        // calling home page api
        server
            .post("/api/find")
            .send({
                "loaiTin":0,"orderBy":"giaDESC",
                "geoBox":geoBox
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);

                //check viewport
                var viewport = res.body.viewport;
                viewport.southwest.lat.should.equal(geoBox[0]);
                viewport.southwest.lon.should.equal(geoBox[1]);
                viewport.northeast.lat.should.equal(geoBox[2]);
                viewport.northeast.lon.should.equal(geoBox[3]);

                // Error key should be false.
                //res.body.error.should.equal(false);
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
                    ,"currentLocation":{"lat":21.041705,"lon":105.760993},"radiusInKm":0.5},
                "limit":200,
                "ngayDaDang":30

            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);

                //check viewport
                var viewport = res.body.viewport;

                viewport.southwest.should.have.property('lat');
                viewport.southwest.should.have.property('lon');
                viewport.northeast.should.have.property('lat');
                viewport.northeast.should.have.property('lon');
                viewport.northeast.should.not.have.property('lng');

                // Error key should be false.
                //res.body.error.should.equal(false);
                done();
            });
    };

    it("Tim kiem theo CurrentLoc",testCurrentLocation);

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
                // HTTP status should be 200
                res.status.should.equal(200);
                console.log("All by diaChinh, so kq:" + res.body.length);

                //check viewport
                var viewport = res.body.viewport;
                viewport.southwest.should.have.property('lat');
                viewport.southwest.should.have.property('lon');
                viewport.northeast.should.have.property('lat');
                viewport.northeast.should.have.property('lon');
                viewport.northeast.should.not.have.property('lng');

                // Error key should be false.
                //res.body.error.should.equal(false);
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
                // HTTP status should be 200
                res.status.should.equal(200);

                console.log("\nAll by diaChinh, loaiNhaDat 2, so kq:" + res.body.length);

                // Error key should be false.
                //res.body.error.should.equal(false);
                done();
            });
    };

    it("Tim kiem theo LoaiNhaDat",testLoaiNhaDat);


});