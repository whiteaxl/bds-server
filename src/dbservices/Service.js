'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;
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


	initBucket() {
		bucket.enableN1ql(['127.0.0.1:8093']);
		bucket.operationTimeout = 60 * 1000;
		bucket = cluster.openBucket('default');
	}


}

module.exports = ServiceModel;