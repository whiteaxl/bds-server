var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

module.exports = bucket;