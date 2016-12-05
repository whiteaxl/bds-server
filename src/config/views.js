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
  HapiSwagger = require('hapi-swagger'),
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

  // server.register({
  //   register: require('hapi-require-https'),
  //   options: {}
  // })

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
      path: [Path.join(__dirname, '../web')],
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
      },
      config: { auth: false }
    },
    //Load files located in images
    {
      method: 'GET',
      path: '/images/{param*}',
      handler: {
        directory: {
          path: '/u01/images'
        }
      },
      config: { auth: false }
    },
    {
      method: 'GET',
      path: '/web/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../web')
        }
      },
      // handler: function (request, reply) {

      //   // let path = 'plain.txt';
      //   // if (request.headers['x-magic'] === 'sekret') {
      //   //     path = 'awesome.png';
      //   // }

      //   // return reply.file(request.url.path);
      //   if(request.url.protocol = "http"){
      //     console.log("tim log " + request.url.path);
      //     return reply.redirect("https://" +request.info.host +  request.url.path);
      //   }else{
      //     return reply.file("src/" + request.url.path);  
      //   }
        
      // },
      config: { auth: false }
    },
    {
      method: 'GET',
      path: '/web/mobile/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../web/mobile')          
        }
      }
    },
    {
      method: 'GET',
      path: '/src/lib/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../lib/')          
        }
      },
      config: { auth: false }
    },
    {
      method: 'GET',
      path: '/bower/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../../bower_components')          
        }
      },
      config: { auth: false }
    }]
    );
  });



/**
   * ### swagger
   *
   * Swagger documents the api
   * 
   * the /documentation endpoint displays the api docs
   * 
   */
  const swaggerOptions = {
    info: {
      'title': 'Reland - API Documentation',
      'version': '1.0.0'
    }
  };
  server.register({
    register: HapiSwagger,
    options: swaggerOptions
  }, (err) => {
    Hoek.assert(!err,err);
    
  });



 };

 module.exports = internals;
