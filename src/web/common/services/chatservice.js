(function () {
  'use strict';
  angular
  .module('bds')
  .factory('ChatService', function($http, $q, $rootScope,$compile, socket){
    //var urlPath = '/api/ads/getAllAds';
    //hash map with email as key and value as a joson object
    //{
    //	onMessageCallBack
    //}
    var chatBoxes = [];
    var email ="";
    var userName ="";
    var userAvatar="";
    var vm = this;
    
 //    socket.on("new message", function(data){
	// 	if(data.emailFrom == email){
	// 		data.ownMsg = true;	
	// 	}else{
	// 		data.ownMsg = false;
	// 	}
	// 	if(!chatBoxes.hasOwnProperty(data.emailFrom)){
	// 		//someone just start chat with you need to popup the chat box for that user
	// 		this.showChat({email: data.emailFrom});
	// 	}else if(chatBoxes[data.emailFrom].onMessageCallBack){
	// 		chatBoxes[data.emailFrom].onMessageCallBack(data);
	// 	}
	// 	// vm.messeges.push(data);
	// 	// $scope.$apply();
	// });

    return {
      listen: function(email, onMessage){
      	chatBoxes[email].onMessageCallBack  = onMessage;
      },
      loginChat: function(email,userID, userName, userAvatar){
      	socket.emit('new user',{email: email, userID:  userID, username : userName, userAvatar : userAvatar},function(data){
          vm.email = email;
          vm.userID = userID;
          vm.userName = userName;
          vm.userAvatar = userAvatar;
          console.log("register socket user " + userName);
        });
      },
      logoutChat: function(email){
      	//socket.
      },
      closeChat: function(email){
      	delete chatBoxes[email];
      	$('#' + email).fadeOut(300);
      },
      showChat: function(user,scope){
      	/*if(chatBoxes.hasOwnProperty(user.email)){
        
      	}else{
        	chatBoxes[user.email] = user;
        	var divElement = angular.element(document.querySelector('#chat-container'));
        	var appendHtml = $compile('<bds-chat visible="$root.chat_visible" useremail="email"></bds-chat>')(scope);
        	divElement.append(appendHtml);
      	}*/
      },
      sendMessage: function(msg,callBack){
      	socket.emit("send-message",msg, function(data){
			callBack(data.success);
		});
      }
    };
  });
})();
