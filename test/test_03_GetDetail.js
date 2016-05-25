var supertest = require("supertest");
var should = require("should");
var danhMuc = require("../src/lib/DanhMuc");
var constant = require("../src/lib/constant");

var server = supertest.agent("http://localhost:5000");

var moment = require("moment");

describe("03.Detail API testsuite",function(){

    it("Tra ve BadRequest - 400 khi Parameter sai ",function(done){
        server
            .post("/api/detail")
            .send({adsID:"adsID_not_found"})
            .expect("Content-type",/json/)
            .end(function(err,res){
                res.status.should.equal(200);
                res.should.not.have.property('ads');
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
                res.status.should.equal(200);

                res.body.should.have.property('status');
                res.body.should.not.have.property('ads');

                done();
            });
    };

    it("Tim detail ko co",testNoResult);

    //---------------------------------------------------------
    var testHasResult = function(done){
        server
            .post("/api/detail")
            .send({adsID : 'Ads_bds_3491653'})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.status.should.equal(200);

                console.log(res.body.ads);

                res.body.should.have.property('status');
                res.body.ads.loaiTin.should.equal(0);
                res.body.ads.loaiTinFmt.should.equal(danhMuc.LoaiTin[0]);
                res.body.ads.should.have.property('gia');
                res.body.ads.should.have.property('giaFmt');
                res.body.ads.place.diaChi.should.equal('Đường Lê Thị Riêng, Quận 12, Hồ Chí Minh');
                res.body.ads.loaiNhaDatFmt.should.equal(danhMuc.LoaiNhaDatBan[2]);
                res.body.ads.dienTichFmt.should.equal('38.5m²');
                res.body.ads.soPhongNgu.should.equal(2);

                const ngayDangTinDate= moment(res.body.ads.ngayDangTin, constant.FORMAT.DATE_IN_DB);
                const soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');

                res.body.ads.soNgayDaDangTinFmt.should.equal('Tin đã đăng ' + soNgayDaDangTin +' ngày');
                

                res.body.ads.ngayDangTinFmt.should.equal('29/03/2016');
                res.body.ads.should.have.property('chiTiet');
                res.body.ads.should.have.property('luotXem');
                res.body.ads.should.have.property('moiGioiTuongTu');

                done();
            });
    };

    it("Tim detail ton tai",testHasResult);

    //---------------------------------------------------------
    var testHasResultHuongTay = function(done){
        server
            .post("/api/detail")
            .send({adsID : "Ads_bds_6543382"})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);

                console.log(res.body.ads);

                res.body.should.have.property('status');
                res.body.ads.loaiTin.should.equal(0);
                res.body.ads.loaiTinFmt.should.equal(danhMuc.LoaiTin[0]);
                res.body.ads.gia.should.equal(2100);
                res.body.ads.giaFmt.should.equal('2.10 TỶ');
                res.body.ads.giaM2.should.equal(32.813);
                res.body.ads.loaiNhaDatFmt.should.equal(danhMuc.LoaiNhaDatBan[2]);
                res.body.ads.dienTichFmt.should.equal('64m²');
                res.body.ads.should.have.property('chiTiet');
                res.body.ads.huongNha.should.equal(2);
                res.body.ads.should.have.property('luotXem');
                res.body.ads.should.have.property('moiGioiTuongTu');
                //image
                res.body.ads.image.images[0].indexOf("745x510").should.not.equal(-1);

                done();
            });
    };

    it("Tim detail ton tai HuongTay",testHasResultHuongTay);


    //---------------------------------------------------------
    var testSoTang = function(done){
        server
            .post("/api/detail")
            .send({adsID : "Ads_bds_6895612"})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log(res.body);
                console.log(res.body.ads);

                res.body.ads.loaiTin.should.equal(1);
                res.body.ads.loaiTinFmt.should.equal(danhMuc.LoaiTin[1]);
                res.body.ads.loaiNhaDatFmt.should.equal(danhMuc.LoaiNhaDatThue[2]);
                res.body.ads.soTang.should.equal(5);

                done();
            });
    };

    it("Tim detail testSoTang",testSoTang);


});