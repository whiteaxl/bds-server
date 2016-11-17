(function() {
	'use strict';
	var controllerId = 'MobileChatDetailCtrl';
	angular.module('bds').controller(controllerId,function ($compile, $state, $scope, $rootScope, socket, $location, $http, Upload, HouseService, NgMap, $window,$timeout){		// Chat Page Controller
		// Varialbles Initialization.
		var vm = this;
		vm.adsID = $state.params.adsID;
		// from general chat if exist $state.params.toUserID
		vm.toUserID = $state.params.toUserID;

		vm.ads = null;
		vm.user = null;
		vm.toUser = null;
		vm.chatMsg = "";

		$scope.sampleSentences = [
			{ value: 0, lable: "Xin chào bạn!"},
			{ value: 1, lable: "Nhà đã bán chưa bạn?"},
			{ value: 2, lable: "Gửi cho mình thêm ảnh" },
			{ value: 3, lable: "Gửi cho mình vị trí chính xác của nhà" },
			{ value: 4, lable: "Giá cuối cùng bạn bán là bao nhiêu?" },
			{ value: 5, lable: "Giá có thương lượng được không bạn?" },
			{ value: 6, lable: "Giảm giá chút đi bạn" },
			{ value: 7, lable: "Cảm ơn bạn!" },
		];
		$scope.chatBox = {};

		vm.init = function(){
			console.log("------------------------init--------------------------")
			console.log($rootScope.user);
			socket.emit('new user',{email: $rootScope.user.userEmail, userID:  $rootScope.user.userID, username : $rootScope.user.userName},function(data){
				console.log("register socket user " + $rootScope.user.userName);
			});
			socket.emit('get-unread-message',{userID: $rootScope.user.userID},function (data){
				console.log("-----------------emit get-unread-message " + $rootScope.user.userID);
				console.log(data);
			});

			HouseService.getUserInfo({userID: $rootScope.user.userID}).then(function(res) {
				if (res.status == 200 && res.data.status == 0) {
					vm.user = res.data.userInfo;
				}
			});

			HouseService.detailAds({adsID: vm.adsID, userID: $rootScope.user.userID}).then(function(res) {
				if(res.status == 200 && res.data.status==0){
					vm.ads = res.data.ads;
					if(!vm.toUserID){
						if(vm.ads.dangBoi.userID){
							vm.toUserID = vm.ads.dangBoi.userID;
						}
					}
					if(vm.toUserID){
						HouseService.getUserInfo({userID: vm.toUserID}).then(function(res) {
							if(res.status == 200 && res.data.status==0){
								vm.toUser = res.data.userInfo;
								vm.initChatBox({userID: vm.toUser.userID,name: vm.toUser.fullName,avatar: vm.toUser.avatar});
								HouseService.getAllChatMsg({userID: $rootScope.user.userID, partnerUserID: vm.toUser.userID, adsID: vm.adsID}).then(function(res) {
									if (res.status == 200 && res.data.status == 0) {
										if(res.data.data.length > 0){
											var msgList = [];
											for(var i=res.data.data.length -1; i >=0; i--){
												msgList.push(res.data.data[i].default);
											}

											var async = require("async");
											async.forEach(msgList,function(msg){
												$timeout(function() {
													window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
												},100);
												$('#chatDetailId').scrollTop($('#chatDetailId')[0].scrollHeight);
												var objDiv = document.getElementById("chatDetailId");
												objDiv.scrollTop = objDiv.scrollHeight;
											}, function(err){
												if(err){throw err;}
												console.log("processing all elements completed");
											});
										}
									}
								});
							}
						});
					}
				} else {
					return;
				}
			});
		}

		vm.goBack = function(){
			vm.closeChat();
			$window.history.back();
		}

		$timeout(function() {
			vm.init();
		},100);

		if($rootScope.user && $rootScope.user.userID){
			$scope.userID = $rootScope.user.userID;
		}

		vm.isMe = function(userID){
			if($scope.userID.trim() == userID.trim())
				return true;
			else 
				return false;
		}

		/**
		 Handle in comming message
		 */
		socket.on("new message", function(data){
			if(!$scope.chatBox.user){
				vm.initChatBox({userID: data.fromUserID,name: data.fromFullName,avatar: data.fromUserAvatar});
			}
			data.date = new Date(data.date);
			socket.emit("read-messages",data, function(res){
				console.log("mark messages as read " + res);
			});
			$timeout(function() {
				window.RewayClientUtils.addChatMessage($scope.chatBox,data);
			},100);
			$scope.$apply();
			$('#chatDetailId').scrollTop($('#chatDetailId')[0].scrollHeight);
			var objDiv = document.getElementById("chatDetailId");
			objDiv.scrollTop = objDiv.scrollHeight;
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
			console.log("------------------chat-unreadMessage-----------------");
			console.log(data);
			var readedData = [];
			for (var i = 0, len = data.length; i < len; i++) {
				var msg = data[i].default;
				msg.date = new Date(msg.date);
				if((vm.adsID.trim()==msg.relatedToAds.adsID.trim()) && ($rootScope.user.userID.trim() == msg.toUserID.trim()) &&(vm.toUserID.trim()==msg.fromUserID.trim())){
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
				socket.emit('user-start-typing',{fromUserID: $rootScope.user.userID,toUserID : $scope.chatBox.user.userID},function (data){
					console.log("emit start typing to " + $scope.chatBox.user.userID);
				});
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

		vm.chonMauCau = function(mauCau){
			vm.chatMsg = mauCau;
			$('.list-sort').toggle();
			$("#msgTxtId").focus();
		}

		$scope.uploadFiles = function (files) {
			$scope.files = files;
			var msg = $scope.getMessage();
			if (files && files.length) {
				var async = require("async");
				async.forEach(files,function(myFile){
					var ft = vm.catchFile(myFile);
					var isImageFile = (ft == "image");
					var fileName = myFile.name;
					console.log(fileName);
					fileName = fileName.substring(fileName.lastIndexOf("."), fileName.length);
					fileName = "Chat_" + $rootScope.user.userID + "_" + new Date().getTime() + fileName;

					Upload.upload({
						url: '/api/upload',
						data: {files: myFile, filename : fileName}
					}).then(function (resp) {
						console.log('Success ' + resp.config.data.files.name + 'uploaded. Response: ' + resp.data);

						$timeout(function() {
							var fileUrl = location.protocol;
							fileUrl = fileUrl.concat("//").concat(window.location.host).concat(resp.data.file.url);

							console.log("----fileUrl: " + fileUrl);
							var msg = $scope.getMessage();
							if(isImageFile==true)
								msg.msgType = window.RewayConst.CHAT_MESSAGE_TYPE.IMAGE;
							else
								msg.msgType = window.RewayConst.CHAT_MESSAGE_TYPE.FILE;
							msg.content = fileUrl;
							socket.emit('send-message',msg,function (data){
								console.log("sent image to " + $scope.chatBox.user.userID);
								if (data.success == true) {
									if(data.offline==true){
										$scope.chatBox.status = window.RewayConst.MSG.USER_OFFLINE;
										$scope.chatBox.onlineClass = "offline";
										//console.log("TODO: this person is offline he will receive the message next time he online");
									}
									vm.chatMsg = "";
									msg.timeStamp = dateString;
									window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
									$scope.$apply();
									$('#chatDetailId').scrollTop($('#chatDetailId')[0].scrollHeight);
									var objDiv = document.getElementById("chatDetailId");
									objDiv.scrollTop = objDiv.scrollHeight;
								}
							});
						},100);

					}, function (resp) {
						console.log('Error status: ' + resp.status);
					}, function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						console.log('progress: ' + progressPercentage + '% ' + evt.config.data.files.name);
					});
				}, function(err){
					if(err){throw err;}
					console.log("processing all elements completed");
				});
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
						msg.timeStamp = dateString;
						// $scope.chatBox.messages.push(msg);
						console.log(msg);
						$timeout(function() {
							window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
						},100);
						$scope.$apply();
						$('#chatDetailId').scrollTop($('#chatDetailId')[0].scrollHeight);
						var objDiv = document.getElementById("chatDetailId");
						objDiv.scrollTop = objDiv.scrollHeight;
					}
				});
			}else{
				vm.isMsgBoxEmpty = true;
			}
		}

		vm.closeChat = function(){
			if($scope.chatBox.user.userID){
				$scope.$bus.publish({
					channel: 'chat',
					topic: 'close chat',
					data: $scope.chatBox.user.userID
				});
			}
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
