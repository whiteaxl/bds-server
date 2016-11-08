"use strict";

var supertest = require("supertest");
var should = require("should");
var constant = require("../src/lib/constant");

var esms = require("../src/lib/esms");

describe("05.esms api",function(){
    //---------------------------------------------------------

    var sendMultipleMessage = function(done){
      esms.sendMultipleMessage("Reland test 2", ["0983368824_1"])
        .then((res) => {
          console.log("Final res:", res);
          done();
        });
    };

    it("sendMultipleMessage test",sendMultipleMessage);
});