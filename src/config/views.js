/**
 * # views.js
 *
 * Snowflake has only one view, reset password
 *
 * Using the module 'vision, establish the renderering engine,
 * in this case, handlebars, and where the views are located
 *
 * Since this reset password view needs a javascript file,
 * the location of this 'asset' is set.
 *
 */
 'use strict';

/**
 * ## Imports
 *
 */
// Hoek is similar to underscore
var Handlebars = require('handlebars'),
Hoek = require('hoek'),
internals = {},    
Inert = require('inert'),
Marked = require('marked'),
Path = require('path'),
Vision = require('vision');

var hapiReact = require('hapi-react-views');

/**
 * ### markdown view
 *
 * Use the GitHub Markdown css 
 */
 function MarkdownView() {

  this.compile = function (template) {
    return function (context) {
      var html = Marked(template, context);
      return `<link rel="stylesheet" href="/assets/github-markdown.css">
      <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
      }
      </style>
      <article class="markdown-body">
      ${html}
      </article>`;
    };
  };
}

/**
 * ## init
 *
 */
 internals.init = function (server) {

  /**
   * ### vision
   *
   * this establishes where the html is located
   * and the engine to parse it
   */
   server.register(Vision, (err) => {

    Hoek.assert(!err,err);
    
    server.views({
      defaultExtension: 'jsx',
      engines: {
        'html': Handlebars,
        'md': {
          module: new MarkdownView(),
          contentType: 'text/html',
          isCached: false
        }, 
        'jsx' : hapiReact, 
        'js' : hapiReact        
      },
      relativeTo: __dirname,
      path: [Path.join(__dirname, '../web')]
    });
    
  });
  /**
   * ### inert
   *
   * this says that any request for /assest/* will 
   * be served from the ../assests dir
   *
   * The resetpassword.js is located in ../assests
   *
   */
   server.register(Inert, (err) => {

    //Confirm no err
    Hoek.assert(!err,err);

    //Load files located in ../assets
    server.route([{
      method: 'GET',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../assets')          
        }
      }
    },
    {
      method: 'GET',
      path: '/web/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../web')          
        }
      }
    },
    // {
    //   method: 'GET',
    //   path: '/web/dist/{param*}',
    //   handler: {
    //     directory: {
    //       path: Path.join(__dirname, '../web/dist')          
    //     }
    //   }
    // },
    {
      method: 'GET',
      path: '/src/lib/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../lib/')          
        }
      }
    },
    {
      method: 'GET',
      path: '/bower/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../../bower_components')          
        }
      }
    }]
    );
  });



 };

 module.exports = internals;
