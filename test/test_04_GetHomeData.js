"use strict";

var supertest = require("supertest");
var should = require("should");
var danhMuc = require("../src/lib/DanhMuc");
var constant = require("../src/lib/constant");

var homeDataHandler = require("../src/routes/api/homeDataHandlers");

var server = supertest.agent("http://localhost:5000");

var moment = require("moment");

describe("04.HomeData API testsuite",function(){
  var testHasResult = function(done){
    let req = {
      query: {
        soPhongNguGREATER : 1,
        loaiTin : undefined
      },
      timeModified : new Date().getTime(),
      currentLocation : {
        lat : 21.012916,
        lon : 105.831900
      }
    };

    homeDataHandler.homeData4App({
      payload: req
    }, (e) => {
      console.log("Reply ", e);
      done();
    });
  };

  it("Tim detail ton tai",testHasResult);

    //---------------------------------------------------------
  /*
    var testHasResult = function(done){
        server
            .post("/api/homeData4app")
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
*/

});