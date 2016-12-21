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

//nhannc rao
/*
ChatHandler.addUser = function(user){
    console.log("------------addUser: ---------------" + data.userID);
	online_users[user.userID];
    console.log(online_users);
    console.log("----------------------------------");
  
}

ChatHandler.removeUser = function(user){
	online_users.remove(user);
}*/

function processSendMsg(data,socket){
  	var sendMsgResult = {
  		success: true,
  		offline: false
  	}
    console.log("--------------socket-----------");
    console.log(socket);
    console.log("-------------end-socket-----------");
    let toUserId = data.toUserID.trim();
    let fromUserId = data.fromUserID.trim();
    let userId;
    let userOnline = false;
    console.log("-------------------------processSendMsg: " + toUserId);
    for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
        userId = online_users[keys[i]].userID.trim();
        if(toUserId == userId){
            console.log("-------------------------------processSendMsg to  " + userId);
            online_users[online_users[keys[i]].sessionID].emit('new message', data);
            userOnline = true;
        }
        if((fromUserId == userId) && (socket.sessionID != online_users[keys[i]].sessionID)){
            console.log("-------------------------------processSendMsg to owner: " + userId);
            online_users[online_users[keys[i]].sessionID].emit('new message', data);
        }
    }
    sendMsgResult.offline = !userOnline;

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
  // console.log(JSON.stringify(server[0]));

	var io = require('socket.io')(server.listener);
	var ios = io.listen(server);
	ios.on('connection', function(socket){  
		console.log("socket.io on connection");
  	// creating new user if nickname doesn't exists
    var containsObject =  function(obj, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }
  	socket.on('new user', function(data, callback){
  		if(online_users[data.sessionID])
  		{
            console.log("------------da ton tai socket for user: ---------------" + data.userID + "--with sessionID: " + data.sessionID);
  			callback({success:false});
  		}else{
  			callback({success:true});
            console.log("------------chua ton tai socket for user: ---------------" + data.userID + "--with sessionID: " + data.sessionID);
  			console.log("socket.io got one new sessionID for user " + data.userID);
            socket.allPartner = [];
            if(data.username){
                socket.username = data.username;
            }
            if(data.username){
                socket.userAvatar = data.userAvatar;
            }
  			socket.userID = data.userID;
            socket.sessionID = data.sessionID
  			online_users[data.sessionID] = socket;

            chatModel.getUnreadMessages(data,function(err,res){
                if(!err)
                    online_users[data.sessionID].emit('unread-messages', res);
            });

            let fromUserId = data.userID.trim();
            data.fromUserID = fromUserId;
            let toUserId;
            chatModel.getInboxMsg( {userID: data.userID}, function(err, res){
                if (err != null){
                    console.log("Error when get Chat inbox for userID: " + data.userID);
                } else {
                    if(res && res.length > 0){
                        let allPartner = [];
                        let toUserId;
                        for(let i=0; i<res.length; i ++){
                            if(res[i].partner.userID) {
                                toUserId = res[i].partner.userID.trim();
                                if(!containsObject(toUserId, allPartner)){
                                    allPartner.push(toUserId);
                                }
                            }
                        }
                        console.log("-------------------------allpartner of: " + data.fromUserID);
                        console.log(allPartner);
                        console.log("-------------------------allpartner of: " + data.fromUserID);

                        var async = require("async");
                        async.forEach(allPartner,function(partner, callback){
                            data.toUserId = partner;
                            console.log("-------------------------inbox: " + toUserId);
                            for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
                                toUserId = online_users[keys[i]].userID.trim();
                                console.log("-------------------------------alert online--- user " + toUserId + "---with Session: " + online_users[keys[i]].sessionID);
                                if(partner == toUserId){
                                    online_users[online_users[keys[i]].sessionID].emit('alert user online', data);
                                }
                            }
                            callback();
                        }, function(err){
                            if(err)
                                console.log(err)
                            else{
                                console.log("processing all elements completed");
                            }
                        });
                        socket.allPartner = allPartner;
                        console.log("------------xem thong tin online_user---------------");
                        console.log(online_users);
                        console.log("---------------------------");
                    }
                }
            });

            /*
            for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
                toUserId = online_users[keys[i]].userID.trim();
                console.log("----------------------------------1--- user " + toUserId);
                if(fromUserId != toUserId){
                    console.log("----------------------------------online to user " + toUserId);
                    data.toUserId = toUserId;
                    online_users[toUserId].emit('alert user online', data);
                }
            }*/
  		}
  	});

    socket.on('alert user online', function(data){
        console.log("-----------------------alert user online by user " + data.fromUserID);
        if(!online_users[data.sessionID])
        {
            if(data.fromUsername){
                socket.username = data.fromUserName;
            }
            if(data.username){
                socket.userAvatar = data.userAvatar;
            }
            socket.userID = data.fromUserID;
            socket.sessionID = data.sessionID

            online_users[data.sessionID] = socket;

            chatModel.getInboxMsg( {userID: data.fromUserID}, function(err, res){
                if (err != null){
                    console.log("Error when get Chat inbox for userID: " + data.userID);
                } else {
                    if(res && res.length > 0){
                        let allPartner = [];
                        let toUserId;
                        for(let i=0; i<res.length; i ++){
                            if(res[i].partner.userID) {
                                toUserId = res[i].partner.userID.trim();
                                if(!containsObject(toUserId, allPartner)){
                                    allPartner.push(toUserId);
                                }
                            }
                        }
                        console.log("-------------------------allpartner of: " + data.fromUserID);
                        console.log(allPartner);
                        console.log("-------------------------");
                        var async = require("async");
                        async.forEach(allPartner,function(partner, callback){
                            data.toUserId = partner;
                            console.log("-------------------------inbox: " + toUserId);
                            for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
                                toUserId = online_users[keys[i]].userID.trim();
                                console.log("-------------------------------alert online--- user " + toUserId + "---with Session: " + online_users[keys[i]].sessionID);
                                if(partner == toUserId){
                                    online_users[online_users[keys[i]].sessionID].emit('alert user online', data);
                                }
                            }
                            callback();
                        }, function(err){
                            if(err)
                                console.log(err)
                            else{
                                console.log("processing all elements completed");
                            }
                        });
                        socket.allPartner = allPartner;
                        console.log("------------xem thong tin online_user---------------");
                        console.log(online_users);
                        console.log("---------------------------");
                    }
                }
            });
        }
    });

        /*
    socket.on('alert user offline', function(data){
        if(online_users[data.fromUserID])
        {
            delete online_users[data.fromUserID];
        }
        console.log("--------------------------alert user offline by user " + data.fromUserID);
        if(socket.allPartner){
            var async = require("async");
            async.forEach(socket.allPartner,function(partner, callback){
                let toUserId;
                data.toUserId = partner;
                for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
                    toUserId = online_users[keys[i]].userID.trim();
                    console.log("-------------------------------alert offline--- user " + toUserId + "---with Session: " + online_users[keys[i]].sessionID);
                    if(partner == toUserId){
                        online_users[online_users[keys[i]].sessionID].emit('alert user offline', data);
                    }
                }
                callback();
            }, function(err){
                if(err)
                    console.log(err)
                else{
                    console.log("processing all elements completed");

                }
            });
        }
    });*/

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
      console.log("--------------------------send-message----------------------");
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

      var sendMsgResult = processSendMsg(data,socket)
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
      if(socket.allPartner && data.toUserID){
          if(socket.allPartner.indexOf(data.toUserID.trim()) <= 0){
              socket.allPartner.push(data.toUserID.trim());
          }
      }

    //var sendMsgResult = processSendMsg(data);
    
  });
  
  // disconnect user handling 
  socket.on('disconnect', function (data, callback) { 
  	console.log('-------tim log this to prove disconnect called: ' + socket.userID + '  --------with session: ' + socket.sessionID);
    delete online_users[socket.sessionID];
    console.log(data);
    console.log(callback);
    //callback({success: true});
  });

  // disconnect user handling 
  socket.on('user leave', function (data, callback) { 
  	console.log('------------------ user leave called '  + socket.userID + '  --------with session: ' + socket.sessionID);
      if(socket.sessionID){
          if(socket.userID){
              let fromUserId = socket.userID.trim();
              data.fromUserID = fromUserId;
          }
          delete online_users[socket.sessionID];
          if(socket.allPartner){
              var async = require("async");
              async.forEach(socket.allPartner,function(partner, callback){
                  data.toUserId = partner;
                  let toUserId;
                  for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
                      toUserId = online_users[keys[i]].userID.trim();
                      console.log("-------------------------------alert online--- user " + toUserId + "---with Session: " + online_users[keys[i]].sessionID);
                      if(partner == toUserId){
                          online_users[online_users[keys[i]].sessionID].emit('alert user offline', data);
                      }
                  }
                  callback();
              }, function(err){
                  if(err)
                      console.log(err)
                  else{
                      console.log("processing all elements completed");

                  }
              });
          }

          console.log(data);
          console.log(callback);
          callback({success: true});
      }
  });

  //get unread message for an user
  socket.on('get-unread-message', function(data){
    chatModel.getUnreadMessages(data,function(err,res){
      if(!err)
        ios.sockets.emit('unread-messages', res);    
    });
  });

//emit user start typing
  socket.on('check user online', function(data){

      let userId;
      let userCheckId = data.toUserID.trim();
      data.toUserIsOnline = false;
      console.log("-------------------------check user online : " + userCheckId);
      for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
          userId = online_users[keys[i]].userID.trim();
          if(userCheckId == userId){
              console.log("-------------------------------alert online--- user " + userId);
              data.toUserIsOnline = true;
              break;
          }
      }
      let fromUser = data.fromUserID.trim();
      for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
          userId = online_users[keys[i]].userID.trim();
          if(fromUser == userId){
              console.log("-------------------------------response check online--- user " + userId);
              online_users[online_users[keys[i]].sessionID].emit('check user online', data);
          }
      }
  });
  //emit user start typing
  socket.on('user-start-typing', function(data){
      let toUserId = data.toUserID;
      let userId;
      for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
          userId = online_users[keys[i]].userID.trim();
          if(toUserId == userId){
              console.log("-------------------------------user-start-typing--- user " + userId);
              online_users[online_users[keys[i]].sessionID].emit('user-start-typing', data);
          }
      }
  });
  //emit user stop typing
  socket.on('user-stop-typing', function(data){
      let toUserId = data.toUserID;
      let userId;
      for (var i = 0, keys = Object.keys(online_users), ii = keys.length; i < ii; i++) {
          userId = online_users[keys[i]].userID.trim();
          if(toUserId == userId){
              console.log("-------------------------------user-stop-typin--- user " + userId);
              online_users[online_users[keys[i]].sessionID].emit('user-stop-typing', data);
          }
      }
  });


});

}

module.exports = ChatHandler;