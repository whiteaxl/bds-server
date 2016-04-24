var supertest = require("supertest");
var should = require("should");
var danhMuc = require("../src/lib/DanhMuc");

var server = supertest.agent("http://localhost:5000");

describe("03.Detail API testsuite",function(){

    it("Tra ve BadRequest - 400 khi Parameter sai ",function(done){
        server
            .post("/api/detail")
            .send({})
            .expect("Content-type",/json/)
            .end(function(err,res){
                res.status.should.equal(400);
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
            .send({adsID : '450TR/CĂN HỘ CAO CẤP CHỈ 1 THÁNG GIAO NHÀ VÀ SỔ HỒNG, VAY 90% LS 0%, CĐT CAM KẾT SINH LỜI 50%/NĂM'})
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
                res.body.ads.place.diaChi.should.equal('Dự án The Navita, Thủ Đức, Hồ Chí Minh');
                res.body.ads.loaiNhaDatFmt.should.equal(danhMuc.LoaiNhaDatBan[1]);
                res.body.ads.dienTichFmt.should.equal('80 m²');
                res.body.ads.soPhongNgu.should.equal(2);
                res.body.ads.soNgayDaDangTinFmt.should.equal('Tin đã đăng 9 ngày');
                res.body.ads.ngayDangTinFmt.should.equal('15/04/2016');
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
            .send({adsID : "BÁN NHÀ MỚI XÂY ĐÚC 2 TẤM(4X16M), GIÁ 1.350 TỶ KHU DÂN CƯ GẦN CHỢ, GẦN TRƯỜNG. LH: 0938384959"})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);

                console.log(res.body.ads);

                res.body.should.have.property('status');
                res.body.ads.loaiTin.should.equal(0);
                res.body.ads.loaiTinFmt.should.equal(danhMuc.LoaiTin[0]);
                res.body.ads.gia.should.equal(1350);
                res.body.ads.giaFmt.should.equal('1.35 TỶ');
                res.body.ads.giaM2.should.equal(21.094);
                res.body.ads.place.diaChi.should.equal('Đường Liên khu 4-5, Phường Bình Hưng Hòa B, Bình Tân, Hồ Chí Minh');
                res.body.ads.loaiNhaDatFmt.should.equal(danhMuc.LoaiNhaDatBan[2]);
                res.body.ads.dienTichFmt.should.equal('64 m²');
                res.body.ads.soPhongNgu.should.equal(2);
                res.body.ads.soNgayDaDangTinFmt.should.equal('Tin đã đăng 2 ngày');
                res.body.ads.ngayDangTinFmt.should.equal('22/04/2016');
                res.body.ads.should.have.property('chiTiet');
                res.body.ads.huongNha.should.equal(2);
                res.body.ads.should.have.property('luotXem');
                res.body.ads.should.have.property('moiGioiTuongTu');

                done();
            });
    };

    it("Tim detail ton tai HuongTay",testHasResultHuongTay);


    //---------------------------------------------------------
    var testTHUE = function(done){
        server
            .post("/api/detail")
            .send({adsID : "**PHÒNG CAO CẤP CHÍNH CHỦ VIP - 1’ RA SÂN BAY TÂN BÌNH, MT TIỀN GIANG 40M2/GIÁ TỪ 5.5TR/TH"})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log(res.body.ads);

                res.body.ads.loaiTin.should.equal(1);
                res.body.ads.loaiTinFmt.should.equal(danhMuc.LoaiTin[1]);
                res.body.ads.gia.should.equal(5.5);
                res.body.ads.giaFmt.should.equal('5.50 TRIỆU/THÁNG');
                res.body.ads.giaM2.should.equal(0.138);
                res.body.ads.place.diaChi.should.equal('Đường Tiền Giang, Tân Bình, Hồ Chí Minh');
                res.body.ads.loaiNhaDatFmt.should.equal(danhMuc.LoaiNhaDatThue[99]);
                res.body.ads.dienTichFmt.should.equal('40 m²');
                res.body.ads.soNgayDaDangTinFmt.should.equal('Tin đã đăng 5 ngày');

                done();
            });
    };

    it("Tim detail THUE",testTHUE);

    //---------------------------------------------------------
    var testSoTang = function(done){
        server
            .post("/api/detail")
            .send({adsID : "Biệt thự Trung Yên – Lô góc – 160m2 – Xây 110m2 x 5 tầng - LH 0988996338"})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                console.log(res.body.ads);

                res.body.ads.loaiTin.should.equal(1);
                res.body.ads.loaiTinFmt.should.equal(danhMuc.LoaiTin[1]);
                res.body.ads.gia.should.equal(50);
                res.body.ads.giaFmt.should.equal('50.00 TRIỆU/THÁNG');
                res.body.ads.giaM2.should.equal(0.313);
                res.body.ads.loaiNhaDatFmt.should.equal(danhMuc.LoaiNhaDatThue[2]);
                res.body.ads.dienTichFmt.should.equal('160 m²');
                res.body.ads.soNgayDaDangTinFmt.should.equal('Tin đã đăng 4 ngày');
                res.body.ads.soTang.should.equal(5);

                done();
            });
    };

    it("Tim detail testSoTang",testSoTang);







});