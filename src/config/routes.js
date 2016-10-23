/**
 * # routes.js
 *
 * All the routes available are defined here
 * The endpoints descripe the method (POST/GET...)
 * and the url ('account/login')
 * and the handler
 *
 *
 */
'use strict';
/**
 * ## All the routes are joined
 *
 */
// Accounts
//var AccountRoutes = require('../routes/account/endpoints'),
    //General like env & status
var  ApiRoutes = require('../routes/api/endpoints')
var  WebRoutes = require('../routes/web/endpoints')   


var internals = {};

//Concatentate the routes into one array
internals.routes = [].concat(ApiRoutes.endpoints,
                             WebRoutes.endpoints
                             );

//set the routes for the server
internals.init = function (server) {
  server.select('https').route(internals.routes);
};

module.exports = internals;
