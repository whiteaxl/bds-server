var supertest = require("supertest");
var should = require("should");
var danhMuc = require("../src/lib/DanhMuc");
var constant = require("../src/lib/constant");

var server = supertest.agent("http://192.168.0.109:5000");

var moment = require("moment");

var onepayHandler = require("../src/routes/api/onepayHandlers");

/*
 Mobifone  Serial:   35971000000474  Pin:  594040024773
 Viettel Serial:   22421403328  Pin:  0225454621949
 Vinaphone Serial:   36049300149469  Pin:  9401795067780
 Gate Serial:   PB00734776  Pin:  3834057812
 Vcoin Serial:   ID0325572537  Pin:  522619441407
 */

describe("05.Onepay api",function(){
    //---------------------------------------------------------

    var testScatchTopup = function(done){
        server
            .post("/api/1pay/scratchTopup")
            .send({
              "type": "Mobifone",
              "pin": "594040024773",
              "serial": "35971000000474",
              "userID": "User_0",
              "clientInfor": "ip5",
              "clientType": "app",
              "startDateTime": new Date().getTime()
            })
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
              console.log(res.statusCode);
              console.log(res.error);
              console.log(res.body);

              res.status.should.equal(200);

                res.body.should.have.property('status');

                done();
            });
    };

    it("Scratch topup success",testScatchTopup);


  var testScatchTopupFail = function(done){
    server
      .post("/api/1pay/scratchTopup")
      .send({
        "type": "Mobifone",
        "pin": "01123",
        "serial": "1012",
        "userID": "User_1",
        "clientInfor": "ip5",
        "clientType": "app",
        "startDateTime": new Date().getTime()
      })
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        console.log(res.statusCode);
        console.log(res.error);
        console.log(res.body);

        res.status.should.equal(200);

        res.body.should.have.property('status');

        done();
      });
  };

  it("Scratch topup fail",testScatchTopupFail);


  var testScatchTopupTimeout = function(done){
    this.timeout(90000);

    server
      .post("/api/1pay/scratchTopup")
      .send({
        "type": "Mobifone",
        "pin": "05123", //must be 05xxx
        "serial": "1012",
        "userID": "User_1",
        "clientInfor": "ip5",
        "clientType": "app",
        "startDateTime": new Date().getTime()
      })
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        console.log(res.statusCode);
        console.log(res.error);
        console.log(res.body);

        res.status.should.equal(200);

        res.body.should.have.property('status');

        done();
      });
  };

  it("Scratch topup timeout",testScatchTopupTimeout);

  /*
  //-------- printQueryScratchTopup --------
  txn = {
    type : ""
  };

  queryScratchTopup(txn)
    .then((res) => {
      log.info("printQueryScratchTopup, res:", res);
    })
    .catch((e) => {
      log.error("printQueryScratchTopup, error:", e);
    })

   b3ea20c296373ff16ab787e527d7fcbdff5ba51084259529c1bf3446da9791b6
   b3ea20c296373ff16ab787e527d7fcbdff5ba51084259529c1bf3446da9791b6
*/

  //Test SmsplusCharging

  var testSmsplusCharging = function(done){
    var fullUrl = "/api/1pay/SmsplusCharging" +
      "?access_key=89drdkir1hsi8uie7uuq" +
      "&amount=10000&command_code=RL&error_code=WCG-0000" +
      "&error_message=thanhcong&mo_message=RL%20NAP%20abcmsg" +
      "&msisdn=8498001&request_id=1234&request_time=2016-08-16T22%3A54%3A50Z" +
      "&signature=910c9b9919afaf042ea52cf442d7626a90af49fe806f192484777fd0f42aef84";
    server
      .get(fullUrl)
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        console.log(res.body);

        res.status.should.equal(200);

        res.body.should.have.property('status');

        done();
      });
  };
  it("testSmsplusCharging",testSmsplusCharging);

  var testSmsplusChargingFail = function(done){
    var fullUrl = "/api/1pay/SmsplusCharging" +
      "?access_key=89drdkir1hsi8uie7uuq" +
      "&amount=10000&command_code=RL&error_code=WCG-0000" +
      "&error_message=thanhcong&mo_message=RL%20NAP%20abcmsg" +
      "&msisdn=84983091602&request_id=001&request_time=2016-08-16T22%3A54%3A50Z" +
      "&signature=123";
    server
      .get(fullUrl)
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        console.log(res.body);

        res.status.should.equal(200);

        res.body.should.have.property('status');

        done();
      });
  };
  it("testSmsplusChargingFail",testSmsplusChargingFail);
});