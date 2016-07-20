'use strict';

var couchbase = require('couchbase');

var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);
bucket.operationTimeout = 120 * 1000;

var data = require('./data/services.json');
console.log("data.length = " + data.length);
for (var i in data) {
  console.log(data[i]);
  bucket.upsert(data[i].id, data[i], function (err, res) {
    if (err) {
      console.log("ERROR:" + err);
    }
  });
}
