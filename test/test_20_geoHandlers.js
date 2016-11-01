"use strict";

var should = require("should");

var moment = require("moment");

var geoHandler = require("../src/data/geoHandlers");

describe("Test geoHandlers",function(){
  this.timeout(15000);

  /*
    it("Test update Huyen Geo to Tinh's Geo ",function(done){
      geoHandler.useParentViewport('Place_H_268', (status) => {
        status.should.equal(true);
        //should.fail();
        done();
      });
    });
*/

  //testXa
  it("Test update Xa Geo to Tinh's Geo ",function(done){
    let sql = `select t.* from default t where type='Place' and placeType='X' and ggMatched=false and codeTinh!='SG' and codeTinh!='HN' and fromParent is missing`;
    geoHandler.useParentViewportBySql(sql, (status) => {
      status.should.equal(true);
      //should.fail();
      done();
    });
  });


});