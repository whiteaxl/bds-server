console.log("Call import mydb");

var dbcfg = require("../config/db");

var couchbase = require('couchbase');
var cluster = new couchbase.Cluster(dbcfg.clusterUrl);
var bucket = cluster.openBucket(dbcfg.dbName);
bucket.enableN1ql([dbcfg.n1ql]);
bucket.operationTimeout = 120 * 1000;


module.exports = bucket;