'use strict';

var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;

/**
{
  category: string (viTri/trangChu/logo)
  name: string (dac Biet, Cao Cap...)
  fees:
  [{
    days : Number (1 Ngay, 7 ngay, ...),
    price : number
  }]
  validFrom: number (from 1970)
  validTo: number (from 1970)
  level : number (1:dacBiet, 2:capCap, 3:chuan) - only for ViTri and TrangChu
  logoPosition : number (1 : line 1, 2 : line 2)
  timeModified: number
}
*/

class ServiceModel {

}

module.exports = ServiceModel;