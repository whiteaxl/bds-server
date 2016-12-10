/**
 * # Hapi.js
 *
 * This is a configuration for Hapi
 * 
 * Note that Hapi is configuration over coding 
 * 
 * There's no coding here!!
 */
'use strict';

/**
* ## Imports
*
*/
var Hapi = require('hapi');
    // kind of like underscore, but specific to Hapi

var Hoek = require('hoek');
    // some additional services
var Plugins = require('./plugins');
    // the routes we'll support
var Routes = require('./routes');
    // the view, mainly for admin
var Views = require('./views');
const Fs = require('fs');

var JWT    = require('jsonwebtoken');
  
var internals = {};

// //The real Hapi server! 
internals.server = new Hapi.Server();
console.log("Done internals.server = new Hapi.Server()");

internals.http = new Hapi.Server();
console.log("Done internals.http = new Hapi.Server()");

// var http = new Hapi.Server();
// // Setup the connection for the environment
internals.http.connection({
  port: process.env.PORT || 5000,
  address: process.env.IP || '127.0.0.1',
    routes: {
    cors: {
      origin: ['http://localhost/','http://203.162.13.40:3000','https://localhost/']
    }
  },
  labels: 'http'
});
console.log("Done internals.http.connection");


internals.server.connection({
  port: 4432,
  address: process.env.IP || '127.0.0.1',
  tls: {
      key: Fs.readFileSync('key.pem'),
      cert: Fs.readFileSync('cert.pem')
  },
  routes: {
    cors: {
      origin: ['http://localhost/','http://203.162.13.40:3000','https://localhost/']
    }
  },
  labels: 'https'
});

console.log("Done internals.server.connection");


var validate = function (decoded, request, callback) {

    //return callback(null, false);
    
    // console.log(request.headers);
  var token = request.headers["authorization"];  
  // console.log(token);
    // var mydecoded = JWT.verify(token, 'shhhhh');
    console.log(decoded);
    /*var testToken = JWT.sign({
      uid: '11111',
      exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60,
      userName: '2222222'
    }, 'Cexk6azogyew7DoTOYKgAXtTOP+18VLDQ1MzYoEWxr6Gqbhg+CeK33MuBPdhyz1dlW4VOKE/ce4TTkfI0yGLlTc+kC74BA8WNoySWmmNsBTEgt83f+9WKYNUgYoGUvml3rRlzvNG71bFqcfJa7U+AuCECq8JnPTeMQ4MSuFBZb4i/q91ZPoI/8SDmcvfai1ofyaHc4xauqhq2hrED5zuZsFbiRDY9bo4d4hHPXdBQaUCm/vklx/BxaAL3OLvvNGhULYmbV/v9Yj0xSAqhZMd7b0TJcDYZ+FHrTX7ZCG15M/Sj/amI/auUEKRNYfwL67/Y7zZxgUWLPsZQ48zPBxgeA==');

    var mydecoded = JWT.decode(testToken,{complete: true});
    console.log(mydecoded);
    */
    return callback(null, true);
    
};

// register plugins
internals.server.register(Plugins.get(), (err) => {
  Hoek.assert(!err,err);
  internals.server.auth.strategy('jwt', 'jwt',
    { key: 'Cexk6azogyew7DoTOYKgAXtTOP+18VLDQ1MzYoEWxr6Gqbhg+CeK33MuBPdhyz1dlW4VOKE/ce4TTkfI0yGLlTc+kC74BA8WNoySWmmNsBTEgt83f+9WKYNUgYoGUvml3rRlzvNG71bFqcfJa7U+AuCECq8JnPTeMQ4MSuFBZb4i/q91ZPoI/8SDmcvfai1ofyaHc4xauqhq2hrED5zuZsFbiRDY9bo4d4hHPXdBQaUCm/vklx/BxaAL3OLvvNGhULYmbV/v9Yj0xSAqhZMd7b0TJcDYZ+FHrTX7ZCG15M/Sj/amI/auUEKRNYfwL67/Y7zZxgUWLPsZQ48zPBxgeA==',// Never Share your secret key
      validateFunc: validate,            // validate function defined above
      verifyOptions: { algorithms: [ 'HS256' ] }, // pick a strong algorithm.
      complete: true
  });
  //internals.server.auth.default('jwt');

});

console.log("Done register plugins");

// var redirect = function () {
//     console.log(JSON.stringify(this));
//     console.log('aaaaaaaaaaaa' + this.params.path);

//     this.reply.redirect('https://localhost/' + this.params.path);
// };

// internals.http.route({ method: '*', path: '/{path*}', handler: redirect });

//setup views for resetpassword
Views.init(internals.server);
// Views.init(internals.http);
// set routes
console.log("Done Views.init(internals.server)");

const Url = require('url');

internals.http.route({
    method: '*',
    path: '/{p*}',
    handler: function (request, reply) {

        // redirect all http traffic to https
        // credit to Matt for the URL.format
        var newURL = Url.format({
            protocol: 'https',
            port: 4432,
            hostname: request.info.hostname,
            pathname: request.url.path
        });
        console.log('tim log ' + newURL);
        return reply.redirect(newURL);
    },
    config: {
        description: 'Http catch route. Will redirect every http call to https'
    }
});

Routes.init(internals.server);

console.log("Done Routes.init(internals.server)");


// internals.http.register(Plugins.get(), (err) => {
//   Hoek.assert(!err,err);
//   internals.http.auth.strategy('jwt', 'jwt',
//     { key: 'Cexk6azogyew7DoTOYKgAXtTOP+18VLDQ1MzYoEWxr6Gqbhg+CeK33MuBPdhyz1dlW4VOKE/ce4TTkfI0yGLlTc+kC74BA8WNoySWmmNsBTEgt83f+9WKYNUgYoGUvml3rRlzvNG71bFqcfJa7U+AuCECq8JnPTeMQ4MSuFBZb4i/q91ZPoI/8SDmcvfai1ofyaHc4xauqhq2hrED5zuZsFbiRDY9bo4d4hHPXdBQaUCm/vklx/BxaAL3OLvvNGhULYmbV/v9Yj0xSAqhZMd7b0TJcDYZ+FHrTX7ZCG15M/Sj/amI/auUEKRNYfwL67/Y7zZxgUWLPsZQ48zPBxgeA==',// Never Share your secret key
//       validateFunc: validate,            // validate function defined above
//       verifyOptions: { algorithms: [ 'HS256' ] }, // pick a strong algorithm.
//       complete: true
//   });
//   //internals.server.auth.default('jwt');

// });
// Routes.init(internals.http);


// internals.server.views({
//     engines: {
//         html: require('handlebars')
//     },
//     relativeTo: __dirname,
//     path: '../../src'
// });








module.exports = internals;
