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
var ChatModel = require("../dbservices/Chat");
var chatModel = new ChatModel();

var UserModel = require("../dbservices/User");
var userModel = new UserModel();

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
  	console.log("emit to user " + data.toUserID);
  	if (online_users[data.toUserID]) {
  		console.log("emit to online user " + data.toUserID);
  		online_users[data.toUserID].emit('new message', data);
  	}else{
  		sendMsgResult.offline = true;
  	}   
  	return sendMsgResult;
  }

ChatHandler.sendImage = function(data,callback){
	console.log("Chat service receive data " + data);
  var sendMsgResult = processSendMsg(data);
  data.read = !sendMsgResult.offline;
  chatModel.saveChat(data,function(){
    callback(sendMsgResult);  
  });
}


ChatHandler.init = function(server){
	var io = require('socket.io')(server.listener);
	var ios = io.listen(server);
	ios.on('connection', function(socket){  
		console.log("socket.io on connection");
  	// creating new user if nickname doesn't exists
  	socket.on('new user', function(data, callback){
  		if(online_users[data.userID])
  		{
  			callback({success:false});
  		}else{
  			callback({success:true});
  			console.log("socket.io got one new user " + data.userID);
  			socket.username = data.username;
  			socket.userID = data.userID;
  			socket.userAvatar = data.userAvatar;
  			online_users[data.userID] = socket;
        chatModel.getUnreadMessages(data,function(err,res){
          if(!err)
            online_users[data.userID].emit('unread-messages', res);
        });
  		}
  	});
    socket.on('read-messages', function(data, callback){
      for (var i = 0, len = data.length; i < len; i++) {
        var msg = data[i].default;
        chatModel.confirmRead(msg,function(err, res) {
          if (err) {
            console.log("ERROR:" + err);
            callback({sucess: false});
          }else
            callback({sucess: true});
        });
      }
      callback({success: true});
    });
    

  // sending new message
  socket.on('send-message', function(data, callback){
  	console.log("receive message "+ JSON.stringify(data));   
    var async = require("async");
    var updateUserID = function(data,callback){
      if(data.toUserID.indexOf("@")==-1){
        callback(null,data)
        return;
      }
      userModel.getUser({email:data.toUserID}, (err, res) => {
        if (err) {
          callback(err, data)
        } else {
          //console.log(res);
          if (res.length > 0) { //exists
            data.toUserID = res[0].id;
            callback(null,data);
          } else {
            callback(null,data)
          }
        }
      });      
    }
    var pMessage = function(data,callback){
      var sendMsgResult = processSendMsg(data)
      data.read = !sendMsgResult;
      callback(null,data);
    } 
    var fn = async.compose(pMessage, updateUserID);
    fn(data,function(err,result){
      console.log(JSON.stringify(result));
      chatModel.saveChat(result,function(){
        callback({success: true, offline: result.read});  
      });
    })

    //var sendMsgResult = processSendMsg(data);
    
  });
  
  // disconnect user handling 
  socket.on('disconnect', function (data, callback) { 
  	console.log('tim log this to prove disconnect called');
    delete online_users[socket.userID];
    console.log(data);
    console.log(callback);
    //callback({success: true});
  });

  // disconnect user handling 
  socket.on('user leave', function (data, callback) { 
  	console.log('tim log this to prove user leave called');
    delete online_users[socket.userID];
    console.log(data);
    console.log(callback);
    callback({success: true});
  });

  //get unread message for an user
  socket.on('get-unread-message', function(data){
    chatModel.getUnreadMessages(data,function(err,res){
      if(!err)
        ios.sockets.emit('unread-messages', res);    
    });
  });

  //emit user start typing
  socket.on('user-start-typing', function(data){
    if(online_users[data.toUserID]){
      online_users[data.toUserID].emit("user-start-typing",data);
    }
  });
  //emit user stop typing
  socket.on('user-stop-typing', function(data){
    if(online_users[data.toUserID]){
      online_users[data.toUserID].emit("user-stop-typing",data);
    }
  });


});

}

module.exports = ChatHandler;