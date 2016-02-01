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
var  GeneralRoutes = require('../routes/general/endpoints')
var  UserRoutes = require('../routes/user/endpoints')   
var  AdminRoutes = require('../routes/admin/endpoints')   

var internals = {};

//Concatentate the routes into one array
internals.routes = [].concat(AdminRoutes.endpoints,
                             GeneralRoutes.endpoints,
                             UserRoutes.endpoints
                             );

//set the routes for the server
internals.init = function (server) {
  server.route(internals.routes);
};

module.exports = internals;
