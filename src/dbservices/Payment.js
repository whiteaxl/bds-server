'use strict';

var constant = require('../lib/constant');
var log = require('../lib/logUtil');

var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;

class Payment {
  
  upsert(dto, callback) {
   
    bucket.upsert(dto.id, dto, callback)
  }

  getAllPaymentBonus(callback) {
   
    var sql = `select default.* from default where type='PaymentBonus'`;
    var query = N1qlQuery.fromString(sql);
    bucket.query(query, callback);
  }
}

module.exports = Payment;