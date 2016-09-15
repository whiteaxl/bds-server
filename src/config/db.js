var shareIP = '203.162.13.177';

var cfg = {
  n1ql: `${shareIP}:8093`,
  clusterUrl: `couchbase://${shareIP}:8091`,
  syncGW : `http://${shareIP}:4985/default/`,
  dbName: 'default'
};

module.exports = cfg;