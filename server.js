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

var HapiServers = require('./src/config/hapi');
console.log("Done require HapiServers");
var https = HapiServers.server;
var http = HapiServers.http;

require('babel-core/register')({
    presets: ['react', 'es2015']
});

var chatHandler = require('./src/lib/ChatHandler');
chatHandler.init(https);
chatHandler.init(http);

console.log("Done chatHandler.init(https)");

// var dbChangeHandler = require('./src/lib/dbChangeHandler');

var DBCache = require("./src/lib/DBCache");

//inti cache
DBCache.init();

// var io = require('socket.io')(HapiServer.listener);

// var ios = io.listen(HapiServer);
// var nickname = [];
// // var i =0;

// // Initializing Variables
// // var nickname = [];
// var i = [];
// var x = [];
// var online_member = [];
// var temp1;
// var socket_id;
// var socket_data;
// var files_array  = [];
// var expiryTime = 8;
// var routineTime = 1;



// ios.on('connection', function(socket){  
//   // creating new user if nickname doesn't exists
//   socket.on('new user', function(data, callback){
//     if(nickname[data.username])
//       {
//         callback({success:false});
//       }else{
//         callback({success:true});
//         socket.username = data.username;
//         socket.userAvatar = data.userAvatar;
//         nickname[data.username] = socket;
//       }
//   });

//   // sending online members list
//   socket.on('get-online-members', function(data){
//     var online_member = [];
//     i = Object.keys(nickname);
//     for(var j=0;j<i.length;j++ )
//     {
//       socket_id = i[j];
//       socket_data = nickname[socket_id];
//       temp1 = {"username": socket_data.username, "userAvatar":socket_data.userAvatar};
//       online_member.push(temp1);
//     }
//     ios.sockets.emit('online-members', online_member);    
//   });

//   // sending new message
//   socket.on('send-message', function(data, callback){
//     console.log("receive message "+ data.username + ", " + data.hasMsg);
//     console.log("receive a message "+ data.username + ", " + nickname[data.username] + ", and msg: " + data.msg + " and callback is " + callback);
//     if (nickname[data.username]) {
//       if(data.hasMsg){

//          ios.sockets.emit('new message', data);
         
//         callback({success:true}); 
//       }else if(data.hasFile){
//         if(data.istype == "image"){
//           socket.emit('new message image', data);
//           callback({success:true});
//         } else if(data.istype == "music"){
//           socket.emit('new message music', data);
//           callback({success:true});
//         } else if(data.istype == "PDF"){
//           socket.emit('new message PDF', data);
//           callback({success:true});
//         }
//       }else{
//         console.log("fail callback");
//         callback({ success:false});
//       }
//     }   
//   });
  
//   // disconnect user handling 
//   socket.on('disconnect', function () { 
//     /*delete nickname[socket.username];
//     online_member = [];
//     x = Object.keys(nickname);
//     for(var k=0;k<x.length;k++ )
//       {
//           socket_id = x[k];
//           socket_data = nickname[socket_id];
//           temp1 = {"username": socket_data.username, "userAvatar":socket_data.userAvatar};
//             online_member.push(temp1);
//       }
//     ios.sockets.emit('online-members', online_member);*/              
//     });
// });


/**
 * When hapi starts up, some info is displayed
 */
https.start(function () {
  // dbChangeHandler.initAPN(this);
  // dbChangeHandler.init(this);

  //console.log('Server is running: ' + HapiServer.info.uri);

    console.log("Done https.start", `Server started at ${ https.info.uri }`);
});



http.start(() => {
    console.log("Done http.start");
    console.log("Done https.start", `Server started at ${ http.info.uri }`);
});

