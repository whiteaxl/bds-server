var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
var bucket = cluster.openBucket('default');

//var N1qlQuery = require('couchbase').N1qlQuery; // get query object
//
//bucket.enableN1ql(['127.0.0.1:8093']); // enable n1ql as per documentation (http://docs.couchbase.com/developer/node-2.0/n1ql-queries.html) - I also tried :8091, same result
//var query = N1qlQuery.fromString('SELECT * FROM `default` LIMIT 2');
//
//setTimeout(function() {
//    bucket.query(query, function(err, res) {
//        if (err) {
//            console.log('query failed'.red, err);
//            return;
//        }
//        console.log('success!', res);
//    });
//}, 2000); // just in case connecting takes a second or something?


module.exports = bucket