var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:5000");

// UNIT test begin

describe("Detail API testsuite",function(){

    // #1 should return error 500

    it("Tra ve BadRequest - 400 khi Parameter sai ",function(done){

        // calling home page api
        server
            .post("/api/detail")
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

    //---------------------------------------------------------
    var testNoResult = function(done){
        server
            .post("/api/detail")
            .send({adsID : 'TestABC'})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);

                res.body.should.have.property('status');
                res.body.should.not.have.property('ads');


                // Error key should be false.
                //res.body.error.should.equal(false);
                done();
            });
    };

    it("Tim detail ko co",testNoResult);

    //---------------------------------------------------------
    var testHasResult = function(done){
        server
            .post("/api/detail")
            .send({adsID : '450TR/CĂN HỘ CAO CẤP CHỈ 1 THÁNG GIAO NHÀ VÀ SỔ HỒNG, VAY 90% LS 0%, CĐT CAM KẾT SINH LỜI 50%/NĂM'})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);

                console.log(res.body.ads);

                res.body.should.have.property('status');
                res.body.ads.should.have.property('loaiTin');
                res.body.ads.should.have.property('loaiTinFmt');
                res.body.ads.should.have.property('gia');
                res.body.ads.should.have.property('giaFmt');
                res.body.ads.place.should.have.property('diaChi');
                res.body.ads.should.have.property('loaiNhaDatFmt');
                res.body.ads.should.have.property('dienTichFmt');
                res.body.ads.should.have.property('soPhongNgu');
                res.body.ads.should.have.property('soNgayDaDangTinFmt');
                res.body.ads.should.have.property('ngayDangTinFmt');
                res.body.ads.should.have.property('chiTiet');
                //res.body.ads.should.have.property('huongNha');
                //res.body.ads.should.have.property('khoangCach');
                res.body.ads.should.have.property('luotXem');
                res.body.ads.should.have.property('moiGioiTuongTu');


                // Error key should be false.
                //res.body.error.should.equal(false);
                done();
            });
    };

    it("Tim detail ton tai",testHasResult);



});