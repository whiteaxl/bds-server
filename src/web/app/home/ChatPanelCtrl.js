(function() {
	'use strict';
	var controllerId = 'ChatPanelCtrl';
	angular.module('bds').controller(controllerId,function (socket,$compile,$rootScope,$http, $scope,$state,HouseService,NgMap,$window){
		var vm = this;		
		vm.boxPositions = [];
		vm.chatBoxes = [];

		/**
		Handle in comming message
		*/
		socket.on("new message", function(data){
			if(data.emailFrom == $rootScope.userEmail){
				data.ownMsg = true;	
			}else{
				data.ownMsg = false;
			}
			if(vm.chatBoxes.hasOwnProperty(data.emailFrom) == false){
				//someone just start chat with you need to popup the chat box for that user
				vm.addNewChat({email: data.emailFrom});
			}
			vm.chatBoxes[data.emailFrom].messages.push(data);
			$scope.$apply();
			//$('#' + data.emailFrom + ' ' + '.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
			$('#' + vm.chatBoxes[data.emailFrom].position + '_chat-history').scrollTop($('#' + vm.chatBoxes[data.emailFrom].position + '_chat-history')[0].scrollHeight);
		});

		vm.addNewChat = function(user){
			if(vm.chatBoxes.hasOwnProperty(user.email)){
        
	      	}else{
	      		var count = Object.keys(vm.chatBoxes).length;
				var rightPos = (24 + Math.min(2,count)*300);
	        	vm.chatBoxes[user.email] = {
	        		user: user,
	        		onlineClass: "online",
	        		position: rightPos,
	        		messages: []
	        	};
	        	var count = Object.keys(vm.chatBoxes).length-1;
				var rightPos = (24 + Math.min(2,count)*300);
	        	var divElement = angular.element(document.querySelector('#chat-container'));
	        	var appendHtml = $compile('<bds-chat chatbox="cp.chatBoxes[\'' + user.email  +  '\']" visible="$root.chat_visible" right="' + rightPos + '" useremail="\''+ user.email+'\'"></bds-chat>')($scope);
	        	divElement.append(appendHtml);
	      	}
		}
		vm.reOrderChat = function(){
			var id = 0;
			for (var email in vm.chatBoxes){
				var rightPos = (24 + Math.min(2,id)*300);
				vm.chatBoxes[email].position = rightPos;
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