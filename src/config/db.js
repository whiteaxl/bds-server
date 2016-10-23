var shareIP = process.env.DB_IP || process.env.IP || '127.0.0.1';//'203.162.13.177'; //'203.162.13.40';

var cfg = {
  n1ql: `${shareIP}:8093`,
  clusterUrl: `couchbase://${shareIP}:8091`,
  syncGW : `http://${shareIP}:4985/default/`,
  dbName: 'default'
};

module.exports = cfg;