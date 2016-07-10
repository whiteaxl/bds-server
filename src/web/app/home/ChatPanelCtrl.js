(function() {
	'use strict';
	var controllerId = 'ChatPanelCtrl';
	angular.module('bds').controller(controllerId,function (socket,$compile,$rootScope,$http, $scope,$state,HouseService,NgMap,$window){
		var vm = this;		
		vm.boxPositions = [];
		vm.chatBoxes = [];

		vm.isSameDate


		/**
		Handle in comming message
		*/
		socket.on("new message", function(data){
			if(vm.chatBoxes.hasOwnProperty(data.fromUserID) == false){
				//someone just start chat with you need to popup the chat box for that user
				vm.addNewChat({userID: data.fromUserID,name: data.fromFullName,avatar: data.fromUserAvatar});
				vm.chatBoxes[data.fromUserID].hidden == true;	
			}
			
			// vm.chatBoxes[data.fromUserID].messages.push(data);
			data.date = new Date(data.date);
			window.RewayClientUtils.addChatMessage(vm.chatBoxes[data.fromUserID],data);

			/*socket.emit("confirm read",msg, function(data){
				console.log("mark message as read");				
			});*/

			$scope.$apply();
			//$('#' + data.emailFrom + ' ' + '.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
			$('#' + vm.chatBoxes[data.fromUserID].position + '_chat-history').scrollTop($('#' + vm.chatBoxes[data.fromUserID].position + '_chat-history')[0].scrollHeight);
		});

		socket.on("user-start-typing",function(data){
			if(vm.chatBoxes.hasOwnProperty(data.fromUserID) == true){
				vm.chatBoxes[data.fromUserID].status = vm.chatBoxes[data.fromUserID].user.name + " is typing...";
				$scope.$apply();
			}
		});

		socket.on("user-stop-typing",function(data){
			if(vm.chatBoxes.hasOwnProperty(data.fromUserID) == true){
				vm.chatBoxes[data.fromUserID].status = "";
				$scope.$apply();
			}
		});

		socket.on("unread-messages", function(data){
			for (var i = 0, len = data.length; i < len; i++) {
			  var msg = data[i].default;
			  msg.date = new Date(msg.date);
			  vm.addNewChat({userID:msg.fromUserID, name:msg.fromFullName,avatar: msg.fromUserAvatar});
			  vm.chatBoxes[msg.fromUserID].hidden = true;
			  window.RewayClientUtils.addChatMessage(vm.chatBoxes[msg.fromUserID],msg);
			  console.log("msg["+i+"] "  + msg);
			}
			socket.emit("read-messages",data, function(res){
				console.log("mark messages as read " + res);				
			});
		});

		

		vm.addNewChat = function(user){
			if(vm.chatBoxes.hasOwnProperty(user.userID)){
        
	      	}else{
	      		var count = Object.keys(vm.chatBoxes).length;
				var rightPos = (24 + Math.min(2,count)*300);
	        	vm.chatBoxes[user.userID] = {
	        		user: user,
	        		onlineClass: "online",
	        		hidden: false,
	        		ads: user.ads,
	        		status: "",
	        		position: rightPos,
	        		messages: []
	        	};
	        	var count = Object.keys(vm.chatBoxes).length-1;
				var rightPos = (24 + Math.min(2,count)*300);
	        	var divElement = angular.element(document.querySelector('#chat-container'));
	        	var appendHtml = $compile('<bds-chat chatbox="cp.chatBoxes[\'' + user.userID  +  '\']" visible="$root.chat_visible" right="' + rightPos + '" useremail="\''+ user.email+'\'"></bds-chat>')($scope);
	        	divElement.append(appendHtml);
	      	}
		}
		vm.reOrderChat = function(){
			var id = 0;
			for (var userID in vm.chatBoxes){
				var rightPos = (24 + Math.min(2,id)*300);
				vm.chatBoxes[userID].position = rightPos;
				id = id +1;
			}
		}
		
		$scope.$bus.subscribe({
            channel: 'chat',
            topic: 'new user',
            callback: function(data, envelope) {
                console.log('add new chat box', data, envelope);
                vm.addNewChat(data);                
            }
        });
        $scope.$bus.subscribe({
            channel: 'chat',
            topic: 'close chat',
            callback: function(data, envelope) {
                console.log('close chat', data, envelope);
                delete vm.chatBoxes[data];
                vm.reOrderChat();
            }
        });

        $scope.$bus.subscribe({
            channel: 'chat',
            topic: 'new message',
            callback: function(data, envelope) {
                console.log('new message arrive', data, envelope);
                //vm.addNewChat(data);
            }
        });

        

	});

})();