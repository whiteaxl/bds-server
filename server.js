'use strict';
/**
 *  Hapi will be the NodeJS server.
 *  I figure if WalMart, the largest retailer in the world, uses it,
 *  it will work for me.  
 *
 * From the command line, run ```npm start``` 
 *
 *  Hapi is configured in this import
 */
var HapiServer = require('./src/config/hapi');

/**
* The mongodb will be used to store all the users
*/
require('./src/database/mongodb');


require('babel-core/register')({
    presets: ['react', 'es2015']
});

/**
 * When hapi starts up, some info is displayed
 */
HapiServer.start(function () {
  console.log('Server is running: ' + HapiServer.info.uri);
});

