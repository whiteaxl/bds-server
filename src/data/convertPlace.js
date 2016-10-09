'use strict';

var CommonService = require("../dbservices/Common");
var commonService = new CommonService;

var logUtil = require("../lib/logUtil");


function addTinhHuyenCode(callback) {
  let sql = "select t.* from default t where type='Place' ";
  let tinhHuyen = {};
  commonService.query(sql, (err, list) => {
    //build tinhHuyen dictionary
    list.forEach(e => {
      if (e.placeType=='H' || e.placeType=='T') {
        tinhHuyen[e.id] = e;
      }
    });
    //update
    list.forEach(e => {
      e.code = String(e.code);
      if (e.placeType=='H') {
        e.codeTinh = tinhHuyen[e.parentId].code;
        e.codeHuyen = e.code;
      }
      if (e.placeType=='X' || e.placeType=='A' ) {
        e.codeHuyen = String(tinhHuyen[e.parentId].code);
        e.codeTinh = tinhHuyen[tinhHuyen[e.parentId].parentId].code;
        if (e.placeType=='X') {
          e.codeXa = e.code;
        }
        if (e.placeType=='A') {
          e.codeDuAn = e.code;
        }
      }

      commonService.upsert(e, (err, res) => {
        if (err) {
          logUtil.error(err);
        }
      });
    });

    logUtil.info("Done ", list.length);
  });
}

addTinhHuyenCode();
