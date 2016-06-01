angular.module('bds').controller('ChatCtrl', function ($scope, $rootScope, socket, $location, $http, Upload, $timeout){		// Chat Page Controller
	// Varialbles Initialization.
	var vm = this;
	vm.isMsgBoxEmpty = false;
	vm.isFileSelected = false;
	vm.isMsg = false;
	vm.setFocus = true;
	vm.chatMsg = "";
	vm.users = [];
	vm.messeges = [];
	vm.status_message = "";
	var count = Object.keys($rootScope.chatBoxes).length-1;
	vm.rightPos = (24 + Math.min(2,count)*300) + "px";
	//vm.user = chatBoxes[$scope.useremail];

	console.log("chat visible is " + $scope.visible);

	$scope.getMessage = function(){
		return {
			fromUserID: $rootScope.userID
			, toUserID: $scope.chatbox.user.userID
			, toFullName: $scope.chatbox.user.name
			, fromFullName: $rootScope.userName
			, relatedToAdsID: undefined
			, content : vm.chatMsg
			, msgType: window.RewayConst.CHAT_MESSAGE_TYPE.TEXT
			, timeStamp : undefined 
			, type: "Chat"
			, file: undefined
		};
	}

	

	
    vm.sendFile = function(file, isImageFile){
    	vm.isFileSelected = true;
        // var file = files[0];
        var dateString = formatAMPM(new Date());            
        var DWid = $rootScope.userName + "dwid" + Date.now();

        var msg = $scope.getMessage();
        if(isImageFile==true)
        	msg.msgType = window.RewayConst.CHAT_MESSAGE_TYPE.IMAGE;
        else
        	msg.msgType = window.RewayConst.CHAT_MESSAGE_TYPE.FILE;
	    msg.content = undefined;
	    msg.file = file;
        socket.emit('send-message',msg,function (data){      
        	console.log("sent image to " + $scope.chatbox.user.userID);
        	if (data.success == true) {
				if(data.offline==true){
					vm.status_message = window.RewayConst.MSG.USER_OFFLINE;
					$scope.chatbox.onlineClass = "offline";
					//console.log("TODO: this person is offline he will receive the message next time he online");
				}
				vm.chatMsg = "";
				vm.setFocus = true;				
				$scope.chatbox.messages.push(msg);
				$scope.$apply();
				$('#' + $scope.chatbox.position + '_chat-history').scrollTop($('#' + $scope.chatbox.position + '_chat-history')[0].scrollHeight);
			}

        });
    }

	$scope.uploadFiles = function (files) {
        $scope.files = files;
        var msg = $scope.getMessage();
        if (files && files.length) {
        	for (var i = 0; i < files.length; i++){

        		var ft = vm.catchFile(files[i]);
        		var isImageFile = (ft == "image");
        		
        		Upload.upload({
		            url: '/api/upload',
		            data: {files: files[i]}
		        }).then(function (resp) {
		            console.log('Success ' + resp.config.data.files.name + 'uploaded. Response: ' + resp.data);
		            //here we need to emit message
		            // if(ft == "image")
		            // 	vm.sendImage(resp.data.image_file);
		            // else
		            	vm.sendFile(resp.data.file,isImageFile);

		        }, function (resp) {
		            console.log('Error status: ' + resp.status);
		        }, function (evt) {
		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.files.name);
		        });
        		
        	}            
        }
    };

    // message time formatting into string    
	function formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}
	
	// ====================================== Messege Sending Code ============================
	// sending text message function
	vm.sendMsg = function(){
		if (vm.chatMsg) {
			vm.isFileSelected = false;
			vm.isMsg = true;
			var dateString = formatAMPM(new Date());
			var msg = $scope.getMessage();
			socket.emit("send-message",msg, function(data){
				//delivery report code goes here
				if (data.success == true) {
					if(data.offline==true){
						vm.status_message = window.RewayConst.MSG.USER_OFFLINE;
						$scope.chatbox.onlineClass = "offline";
						//console.log("TODO: this person is offline he will receive the message next time he online");
					}
					vm.chatMsg = "";
					vm.setFocus = true;				
					$scope.chatbox.messages.push(msg);
					$scope.$apply();
					$('#' + $scope.chatbox.position + '_chat-history').scrollTop($('#' + $scope.chatbox.position + '_chat-history')[0].scrollHeight);
				}
				
			});
		}else{
			vm.isMsgBoxEmpty = true;
		}		
	}

	
    vm.toggleChat = function(event){
    	$(event.target).closest("div").find('.chat').slideToggle(300, 'swing');
    	$(event.target).closest("div").find('.chat-message-counter').slideToggle(300, 'swing');
	}
    vm.closeChat = function(event){
    	$(event.target).parent().parent().parent().remove();
    	$scope.$bus.publish({
        	channel: 'chat',
            topic: 'close chat',
            data: $scope.chatbox.user.userID
	    });
    }


    // function for checking file type
    vm.catchFile = function (file){
    	if(!file)
    		return "invalid format";
        if (file.type == "application/pdf" || file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type == "text/plain" || file.type == "application/vnd.ms-excel") {
			return "document";
		}else if(file.type == "audio/mp3" || file.type == "audio/mpeg"){
			return "music";
		}else{
			var filetype = file.type.substring(0,file.type.indexOf('/'));
			if (filetype == "image") {
				return "image";
			}else{
				return "invalid format";
			}
		}
    }

})
