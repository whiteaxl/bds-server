'use strict';

var constant = require('../lib/constant');
var log = require('../lib/logUtil');

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;

class Payment {

  initBucket() {
    cluster = new couchbase.Cluster('couchbase://localhost:8091');
    bucket.enableN1ql(['127.0.0.1:8093']);
    bucket.operationTimeout = 120 * 1000;
    bucket = cluster.openBucket('default');
  }

  upsert(dto, callback) {
    this.initBucket();
    bucket.upsert(dto.id, dto, callback)
  }

  getAllPaymentBonus(callback) {
    this.initBucket();
    var sql = `select default.* from default where type='PaymentBonus'`;
    var query = N1qlQuery.fromString(sql);
    bucket.query(query, callback);
  }
}

module.exports = Payment;