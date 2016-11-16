(function() {
	'use strict';
	var controllerId = 'MobileChatDetailCtrl';
	angular.module('bds').controller(controllerId,function ($compile, $state, $scope, $rootScope, socket, $location, $http, Upload, HouseService, NgMap, $window,$timeout){		// Chat Page Controller
		// Varialbles Initialization.
		var vm = this;
		vm.adsID = $state.params.adsID;
		vm.ads = null;
		vm.user = null;
		vm.toUser = null;

		vm.isMsgBoxEmpty = false;
		vm.isFileSelected = false;
		vm.isMsg = false;
		vm.setFocus = true;
		vm.chatMsg = "";
		vm.users = [];
		vm.messeges = [];
		vm.menu = {

		}

		console.log("chat visible is " + $scope.visible);
		vm.typing = false;

		if($rootScope.user && $rootScope.user.userID){
			$scope.userID = $rootScope.user.userID;
		}
		//ChatPanel
		$scope.chatBox = {};
		$scope.chatBox.user = {};
		$scope.chatBox.user.userID = $rootScope.user.userID;

		vm.initData = function(){
			$scope.chatBox.user = {};
			$scope.chatBox.user.userID = $rootScope.user.userID;
		}

		vm.isMe = function(userID){
			if($scope.userID.trim() == userID.trim())
				return true;
			else 
				return false;
		}

		HouseService.getUserInfo({userID: $rootScope.user.userID}).then(function(res) {
			console.log("---------------find from user-----------------");
			console.log(res);
			if (res.status == 200 && res.data.status == 0) {
				vm.user = res.data.userInfo;
			}
		});


		vm.isSameDate

		HouseService.detailAds({adsID: vm.adsID, userID: $rootScope.user.userID}).then(function(res) {
			console.log("---------------find Ads-----------------");
			console.log(res);
			if(res.status == 200 && res.data.status==0){
				vm.ads = res.data.ads;
				if(!vm.ads.dangBoi.userID){
					return;
				} else{
					HouseService.getUserInfo({userID: vm.ads.dangBoi.userID}).then(function(res) {
						console.log("---------------find to user-----------------");
						console.log(res);
						if(res.status == 200 && res.data.status==0){
							vm.toUser = res.data.userInfo;
							vm.initChatBox({userID: vm.toUser.userID,name: vm.toUser.fullName,avatar: vm.toUser.avatar});
						}
					});
				}
			} else {
				return;
			}
		});

		/**
		 Handle in comming message
		 */
		socket.on("new message", function(data){
			vm.initChatBox({userID: data.fromUserID,name: data.fromFullName,avatar: data.fromUserAvatar});
			data.date = new Date(data.date);
			window.RewayClientUtils.addChatMessage($scope.chatBox,data);
			$scope.$apply();
			// $('#' + $scope.chatBox[data.fromUserID].position + '_chat-history').scrollTop($('#' + $scope.chatBox[data.fromUserID].position + '_chat-history')[0].scrollHeight);
		});

		socket.on("user-start-typing",function(data){
			$scope.chatBox.status = $scope.chatBox.user.name + " is typing...";
			$scope.$apply();
		});

		socket.on("user-stop-typing",function(data){
			$scope.chatBox.status = "";
			$scope.$apply();
		});

		socket.on("unread-messages", function(data){
			var readedData = [];
			for (var i = 0, len = data.length; i < len; i++) {
				var msg = data[i].default;
				msg.date = new Date(msg.date);
				if((vm.adsID.trim()==msg.relatedToAds.adsID.trim()) && ($rootScope.user.userID.trim() == msg.toUserID.trim())){
					if(!$scope.chatBox.user){
						vm.initChatBox({userID:msg.fromUserID, name:msg.fromFullName,avatar: msg.fromUserAvatar});
					}
					window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
					readedData.push(data[i]);
				}
				console.log("msg["+i+"] "  + msg);
			}
			socket.emit("read-messages",readedData, function(res){
				console.log("mark messages as read " + res);
			});
		});

		vm.initChatBox = function(user){
			$scope.chatBox.user = user;
			$scope.chatBox.onlineClass = "online";
			$scope.chatBox.hidden = false;
			$scope.chatBox.ads = {
				adsID : vm.ads.adsID,
				cover : vm.ads.image.cover,
				diaChinhFullName: vm.ads.place.diaChinhFullName,
				dienTichFmt: vm.ads.dienTichFmt,
				giaFmt: vm.ads.giaFmt,
				loaiNhaDat: vm.ads.loaiNhaDat,
				loaiNhaDatFmt: vm.ads.loaiNhaDatFmt,
				loaiTin: vm.ads.loaiTin
			};
			$scope.chatBox.status = "";
			$scope.chatBox.messages = [];
		}

		//End ChatPanel

		$scope.chatKeypress = function(event){
			var keyCode = event.which || event.keyCode;
			if (keyCode === 13) {
				vm.sendMsg();
			} else{
				if(vm.typing == false){
					socket.emit('user-start-typing',{fromUserID: $rootScope.user.userID,toUserID : $scope.chatBox.user.userID},function (data){
						console.log("emit start typing to " + $scope.chatBox.user.userID);
					});
				}
			}

		}
		$scope.chatBlur = function(event){
			socket.emit('user-stop-typing',{fromUserID: $rootScope.user.userID,toUserID:$scope.chatBox.user.userID},function (data){
				console.log("emit stop typing to " + $scope.chatBox.user.userID);
			});
		}


		$scope.getMessage = function(){
			return {
				fromUserID: vm.user.userID.trim()
				, fromUserAvatar: vm.user.avatar
				, toUserID: $scope.chatBox.user.userID.trim()
				, toFullName: $scope.chatBox.user.name
				, fromFullName: vm.user.fullName
				, relatedToAds: $scope.chatBox.ads
				, content : vm.chatMsg
				, msgType: window.RewayConst.CHAT_MESSAGE_TYPE.TEXT
				, timeStamp : formatAMPM(new Date())
				, date: new Date()
				, type: "Chat"
			};
		}

		vm.sendFile = function(file, isImageFile){
			vm.isFileSelected = true;
			// var file = files[0];
			var dateString = formatAMPM(new Date());
			var DWid = $rootScope.user.userName + "dwid" + Date.now();

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
						$scope.chatbox.status = window.RewayConst.MSG.USER_OFFLINE;
						$scope.chatbox.onlineClass = "offline";
						//console.log("TODO: this person is offline he will receive the message next time he online");
					}
					vm.chatMsg = "";
					vm.setFocus = true;

					msg.timeStamp = dateString;
					// $scope.chatbox.messages.push(msg);
					window.RewayClientUtils.addChatMessage($scope.chatbox,msg);
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
			console.log("---------------sendMsg------1---------");
			if (vm.chatMsg) {
				vm.isFileSelected = false;
				vm.isMsg = true;
				var dateString = formatAMPM(new Date());
				var msg = $scope.getMessage();
				socket.emit("send-message",msg, function(data){
					//delivery report code goes here
					if (data.success == true) {
						if(data.offline==true){
							$scope.chatBox.status = window.RewayConst.MSG.USER_OFFLINE;
							$scope.chatBox.onlineClass = "offline";
							//console.log("TODO: this person is offline he will receive the message next time he online");
						}
						vm.chatMsg = "";
						vm.setFocus = true;
						msg.timeStamp = dateString;
						// $scope.chatBox.messages.push(msg);
						console.log(msg);
						window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
						$scope.$apply();
						//$('#' + $scope.chatBox.position + '_chat-history').scrollTop($('#' + $scope.chatBox.position + '_chat-history')[0].scrollHeight);
					}
				});
			}else{
				vm.isMsgBoxEmpty = true;
			}
		}

		vm.toggleChat = function(event){
			angular.element(event.target).closest("div").find('.chat').slideToggle(300, 'swing');
			angular.element(event.target).closest("div").find('.chat-message-counter').slideToggle(300, 'swing');
			//$scope.chatBox.hidden = !$scope.chatBox.hidden;
		}
		vm.closeChat = function(event){
			$(event.target).parent().parent().parent().remove();
			$scope.$bus.publish({
				channel: 'chat',
				topic: 'close chat',
				data: $scope.chatBox.user.userID
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
	});
})();
