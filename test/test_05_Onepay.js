var supertest = require("supertest");
var should = require("should");
var danhMuc = require("../src/lib/DanhMuc");
var constant = require("../src/lib/constant");

var server = supertest.agent("http://localhost:5000");

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
              "userID": "User_1",
              "deviceInfor": "ip5",
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
                res.body.should.not.have.property('ads');

                done();
            });
    };

    it("Scratch topup",testScatchTopup);

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
});