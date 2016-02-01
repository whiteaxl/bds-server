/**
 * # plugins.js
 *
 * Plugins are like middleware, they get used 'automagically'
 *
 */
'use strict';


var internals = {};

/**
* ## plugins
*
* the good module prints out messages
*/
internals.plugins = function () {
  return [
    {
      register: require('vision'),
      options: {}
    },
    {
      register: require('good'),
      options: {
        opsInterval: 1000,
        reporters: [{
          reporter: require('good-console'),
          events: { log: '*', response: '*', request: '*' }
        }]
      }
    }
  ];
};

module.exports.get = internals.plugins;
