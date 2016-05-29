'use strict';


var ChatHandler = {};

var i = [];
var x = [];
var online_member = [];
var temp1;
var socket_id;
var socket_data;
var files_array  = [];
var expiryTime = 8;
var routineTime = 1;
var online_users =[];
var nickname = [];
var ios = undefined;

ChatHandler.addUser = function(user){
	online_users[user.userID];
}

ChatHandler.removeUser = function(user){
	online_users.remove(user);
}

function processSendMsg(data){
  	var sendMsgResult = {
  		success: true,
  		offline: false
  	}
  	console.log("emit to user " + data.emailTo);
  	if (online_users[data.emailTo]) {
  		console.log("emit to onlin user " + data.emailTo);
  		online_users[data.emailTo].emit('new message', data);
  	}else{
  		sendMsgResult.offline = true;
  	}   
  	return sendMsgResult;
  }

ChatHandler.sendImage = function(data,callback){
	console.log("Chat service receive data " + data);
	callback(processSendMsg(data));

	// ios.sockets.emit('new message image', data);
}

ChatHandler.init = function(server){
	var io = require('socket.io')(server.listener);
	var ios = io.listen(server);
	ios.on('connection', function(socket){  
		console.log("socket.io on connection");
  	// creating new user if nickname doesn't exists
  	socket.on('new user', function(data, callback){
  		if(online_users[data.email])
  		{
  			callback({success:false});
  		}else{
  			callback({success:true});
  			console.log("socket.io got one new user " + data.email);
  			socket.username = data.username;
  			socket.userID = data.userID;
  			socket.email = data.email;
  			socket.userAvatar = data.userAvatar;
  			online_users[data.email] = socket;
  		}
  	});

  // sending new message
  socket.on('send-message', function(data, callback){
  	console.log("receive message "+ JSON.stringify(data));
  	callback(processSendMsg(data));
  });
  
  // disconnect user handling 
  socket.on('disconnect', function () { 
    /*delete nickname[socket.username];
    online_member = [];
    x = Object.keys(nickname);
    for(var k=0;k<x.length;k++ )
      {
          socket_id = x[k];
          socket_data = nickname[socket_id];
          temp1 = {"username": socket_data.username, "userAvatar":socket_data.userAvatar};
            online_member.push(temp1);
      }
      ios.sockets.emit('online-members', online_member);*/              
  });
});

}

module.exports = ChatHandler;