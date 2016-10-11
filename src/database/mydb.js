var dbcfg = require("../config/db");

var couchbase = require('couchbase');
var cluster = new couchbase.Cluster(dbcfg.clusterUrl);
var bucket = cluster.openBucket(dbcfg.dbName);
bucket.enableN1ql([dbcfg.n1ql]);
bucket.operationTimeout = 240 * 1000;

console.log("Call import mydb", dbcfg.clusterUrl);

module.exports = bucket;