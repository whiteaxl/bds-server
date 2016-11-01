var cluster = require('cluster');

var numCPUs = require('os').cpus().length;


if (numCPUs > 2) {
  numCPUs = numCPUs / 2
}

if (process.argv[2]) {
  numCPUs = process.argv[2];
}

global.numCPUs = numCPUs;

if (process.argv[3]) {
  global.delayLoadTime = process.argv[3]*1000;
}

if (cluster.isMaster) {

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  global.loadCluster = true;

  //change this line to Your Node.js app entry point.
  require("./server.js");
}