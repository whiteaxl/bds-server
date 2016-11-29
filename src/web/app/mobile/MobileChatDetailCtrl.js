(function() {
	'use strict';
	var controllerId = 'MobileChatDetailCtrl';
	angular.module('bds').controller(controllerId,function ($compile, $state, $scope, $rootScope, $localStorage, socket, $location, $http, Upload, HouseService, RewayCommonUtil, NgMap, $window,$timeout){		// Chat Page Controller
		// Varialbles Initialization.
		var vm = this;
		$rootScope.isChatDetail = true;
		vm.adsID = $state.params.adsID;
		// from general chat if exist $state.params.toUserID
		vm.toUserID = $state.params.toUserID;

		vm.ads = null;
		vm.user = null;
		vm.toUser = null;
		vm.chatMsg = "";
		vm.currentLocation = {};
		vm.sendLocation ={}
		vm.toUserOnline;
		vm.sentLocationView = {};

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

		/*
		//use to show location on new window
		// with msg.content = "https://www.google.com/maps?q=" + vm.currentLocation.lat + "," + vm.currentLocation.lon;
		vm.openMap = function(mapUrl){
			$window.open(mapUrl, '_blank');
		};
		*/
		// autocomplete
		vm.favoriteSearchSource = [
			{
				description: "Vị trí hiện tại",
				location: true,
				class: "ui-autocomplete-category"
			}
		];

		vm.autoCompleteChange = function(event){
			if(vm.autoCompleteText == ''){
				$( "#searchSendLocation").autocomplete( "option", "source",vm.favoriteSearchSource);
				$( "#searchSendLocation").autocomplete( "search", "" );
			}
			vm.toggleQuickClearAutoComplete();
		}

		vm.showFavorite = function(event){
			if(vm.autoCompleteText == '' || !vm.autoCompleteText){
				$( "#searchSendLocation").autocomplete( "option", "source",vm.favoriteSearchSource);
				$( "#searchSendLocation").autocomplete( "search", "" );
			}

		}
		vm.keyPress = function(event){
			vm.showFrequentSearch = false;
			$( "#searchSendLocation").autocomplete( "option", "source",vm.autocompleteGoogleSource);
			var $ww = $(window).width();


		}

		vm.autocompleteGoogleSource = function (request, response) {
			var options = {
				input: request.term,
				//types: ['(cities)'],
				//region: 'US',
				componentRestrictions: { country: "vn" }
			};
			function callback(predictions, status) {
				var results = [];
				if(predictions){
					for (var i = 0, prediction; prediction = predictions[i]; i++) {
						results.push(
							{
								description: prediction.description,
								types:  	prediction.types,
								place_id: 	prediction.place_id,
								class: "iconLocation gray"
							}
						);
					}
				}
				response(results);
			}
			var service = new google.maps.places.AutocompleteService();
			service.getPlacePredictions(options, callback);
		}

		vm.selectPlaceCallback = function(item){
			if(item.lastSearchSeparator==true){
				return;
			}
			vm.item = item;
			if(vm.item.place_id){
				var request = {
					placeId: vm.item.place_id
				};
				var service = new google.maps.places.PlacesService(vm.fullMapSendLocation);
				service.getDetails(request, function(place, status) {
					vm.fullMapSendLocation.fitBounds(place.geometry.viewport);
					vm.sendLocation.lat = vm.fullMapSendLocation.getCenter().lat();
					vm.sendLocation.lon = vm.fullMapSendLocation.getCenter().lng();
					vm.getDiaChinhGoogle(vm.sendLocation.lat, vm.sendLocation.lon);
				});
			}
		}

		vm.toggleQuickClearAutoComplete = function(){
			if(vm.autoCompleteText == '' || !vm.autoCompleteText){
				$( "#searchSendLocation").autocomplete( "option", "source",vm.favoriteSearchSource);
				$( "#searchSendLocation").autocomplete( "search", "" );
				$(".close-search").removeAttr("style");
				$(".input-fr").removeAttr("style");
			}else{
				$(".close-search").show();
				$(".input-fr").css("width", $ww-78);
			}
		}

		//end autoComplete

		//getPlace
		vm.getDiaChinhGoogle = function(lat, lon){
			vm.getGeoCode(lat, lon, function(res){
				if(res.results){
					vm.googlePlaces = res.results;
					var place = vm.googlePlaces[0];
					vm.autoCompleteText = place.formatted_address;
				}
			})
		}

		vm.getGeoCode = function(lat,lon,callback){
			var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
				"key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
				"&latlng=" + lat + ',' + lon;

			return fetch(url)
				.then(response => response.json())
				.then(function (data) {
					callback(data);
				})
				.catch(e => e);
		}
		//end getPlace

		vm.getCurrentLocation = function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					vm.currentLocation.lat = position.coords.latitude;
					vm.currentLocation.lon = position.coords.longitude;
					vm.sendLocation.lat = vm.currentLocation.lat;
					vm.sendLocation.lon = vm.currentLocation.lon;
					vm.getDiaChinhGoogle(vm.sendLocation.lat, vm.sendLocation.lon);
				}, function(error){
					console.log(error);
				});
			} else {
			}
		}

		vm.updateStreetview = function(lat, lon){
			var latLng = new google.maps.LatLng(lat, lon);
			var streetViewService = new google.maps.StreetViewService();
			streetViewService.getPanoramaByLocation(latLng, 500, function(streetViewPanoramaData, status,res) {
				if (status === google.maps.StreetViewStatus.OK) {
					vm.streetviewLatLng = streetViewPanoramaData.location.latLng;
				}
			});

		}

		vm.showFullMap =function(isViewLocation, msg){
			if(!isViewLocation)
				$('#mapsBoxSendLocation').modal("show");
			else {
				vm.sentLocationView.lat = msg.location.lat;
				vm.sentLocationView.lon = msg.location.lon;
				var async = require("async");
				async.series(
					vm.updateStreetview(vm.sentLocationView.lat, vm.sentLocationView.lon)
				);

				$('#mapsBoxViewLocation').modal("show");
			}
		}

		vm.sendUrlMapLocation = function(){
			if (vm.sendLocation.lat && vm.sendLocation.lon) {
				vm.isFileSelected = false;
				//var dateString = formatAMPM(new Date());
				var msg = $scope.getMessage();
				//msg.content = "https://www.google.com/maps?q=" + vm.currentLocation.lat + "," + vm.currentLocation.lon;
				msg.location = {
					lat : vm.sendLocation.lat,
					lon : vm.sendLocation.lon
				}
				msg.msgType = window.RewayConst.CHAT_MESSAGE_TYPE.LOCATION;
				socket.emit("send-message",msg, function(data){
					//delivery report code goes here
					if (data.success == true) {
						if(data.offline==true){
							vm.toUserOnline = false;
							$scope.chatBox.status = window.RewayConst.MSG.USER_OFFLINE;
							$scope.chatBox.onlineClass = "offline";
							//console.log("TODO: this person is offline he will receive the message next time he online");
						}
						msg.timeStamp = (new Date()).getTime();
						console.log(msg);
						window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
						$scope.$apply();
						$("body").animate({ scrollTop: $(document).height() }, "slow");
						// var objDiv = document.getElementById("chatDetailId");
						// objDiv.scrollTop = objDiv.scrollHeight;
					}
				});
			}else{
				vm.isMsgBoxEmpty = true;
			}
		}

		vm.init = function(){
			vm.getCurrentLocation();

			socket.emit('alert user online',{email: $rootScope.user.userEmail, fromUserID:  $rootScope.user.userID, fromUserName : $rootScope.user.userName},function(data){
				console.log("alert user online " + $rootScope.user.userID);
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

			RewayCommonUtil.placeAutoCompletePost(vm.selectPlaceCallback, "searchSendLocation");
			
			$('#mapsBoxSendLocation').on('show.bs.modal', function (e) {
				$timeout(function() {
					if (!vm.fullMapSendLocation) {
						vm.fullMapSendLocation = NgMap.initMap('fullMapSendLocation');
						google.maps.event.addListener(vm.fullMapSendLocation, "click", function (event) {
							vm.sendLocation.lat = event.latLng.lat();
							vm.sendLocation.lon = event.latLng.lng();
							console.log("-------movecursor-----lat: " + vm.sendLocation.lat);
							console.log("---------movecusor---lon: " + vm.sendLocation.lon);
						});
						google.maps.event.addListener(vm.fullMapSendLocation, "center_changed", function () {
							vm.sendLocation.lat = vm.fullMapSendLocation.getCenter().lat();
							vm.sendLocation.lon = vm.fullMapSendLocation.getCenter().lng();
							vm.getDiaChinhGoogle(vm.sendLocation.lat, vm.sendLocation.lon);
							console.log("-------movecusor-----lat: " + vm.sendLocation.lat);
							console.log("---------movecusor---lon: " + vm.sendLocation.lon);
						});
						google.maps.event.addListener(vm.fullMapSendLocation, "touchmove", function () {
							event.preventDefault();
							var touch = e.touches[0];
							if(e.touches.length == 1){
								//This means there are two finger move gesture on screen
								vm.fullMapSendLocation.setOptions({draggable:true});
							}
						}, false);
						google.maps.event.addListener(vm.fullMapSendLocation, "drag", function(event) {
							console.log("------------lat: " + vm.location.lat);
							console.log("------------lon: " + vm.location.lon);
						});
					}
				},300);
			});

			$('#mapsBoxViewLocation').on('show.bs.modal', function (e) {
				$timeout(function() {
					if (!vm.fullMapViewLocation) {
						vm.fullMapViewLocation = NgMap.initMap('fullMapViewLocation');
					}
					if(vm.fullMapViewLocation){
						//vm.fullMapViewLocation.getStreetView().setVisible(false);
						//vm.fullMapViewLocation.getStreetView().setPosition(vm.streetviewLatLng);
					}
				},300);
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
						socket.emit('check user online',{fromUserID: $rootScope.user.userID,toUserID : vm.toUserID},function(data){
							console.log("register socket user " + vm.toUserID);
						});

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
												window.RewayClientUtils.addChatMessage($scope.chatBox,msg);

												//$('#chatDetailId').scrollTop($('#chatDetailId')[0].scrollHeight);
												//var objDiv = document.getElementById("chatDetailId");
												//objDiv.scrollTop = objDiv.scrollHeight;
											}, function(err){
												if(err){throw err;}
												console.log("processing all elements completed");
											});
											$("body").animate({ scrollTop: $(document).height() }, "slow");
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

		$scope.$on('$destroy', function () {
			console.log("-------------destroy--chat------new message---------------");
			socket.removeAllListeners();

		});

		vm.goBack = function(){
			//vm.closeChat();
			console.log("-------------------------goback-Chat----------------------");
			$rootScope.isChatDetail = false;
			$state.go($rootScope.lastState, $rootScope.lastStateParams);
		}

		$timeout(function() {
			vm.init();
		},500);

		if($rootScope.user && $rootScope.user.userID){
			$scope.userID = $rootScope.user.userID;
		}

		vm.isMe = function(userID){
			if($scope.userID.trim() == userID.trim())
				return true;
			else 
				return false;
		}
		vm.testWatch = function () {
			console.log("-----------testWatch:---- ");
			console.log($rootScope.chatMsgData);
		}
		$rootScope.watchHitCount = 0;
		$rootScope.$watch('chatMsgData', vm.testWatch,true);
		/**
		 Handle in comming message
		 */
		socket.on("new message", function(data){
			console.log("----------------------on new msg-detail-------------------");
			$rootScope.chatMsgData = data;
			console.log($rootScope.watchHitCount);
			if((data.fromUserID.trim()==vm.toUserID.trim()) && (data.relatedToAds.adsID.trim() == vm.adsID)){
				if(!$scope.chatBox.user){
					vm.initChatBox({userID: data.fromUserID,name: data.fromFullName,avatar: data.fromUserAvatar});
				}
				data.date = new Date(data.date);
				console.log(data);
				$timeout(function() {
					socket.emit('get-unread-message',{userID: $rootScope.user.userID},function (data){
						console.log("-----------------emit get-unread-message " + $rootScope.user.userID);
						console.log(data);
					});
				},300);


				window.RewayClientUtils.addChatMessage($scope.chatBox,data);
				$scope.$apply();
				$("body").animate({ scrollTop: $(document).height() }, "slow");
			} else{
				if(!$rootScope.unreadMsg)
					$rootScope.unreadMsg = 1;
				else
					$rootScope.unreadMsg = $rootScope.unreadMsg + 1;
				$rootScope.unreadMsg = $rootScope.unreadMsg;
			}
		});
		
		socket.on("check user online",function(data){
			$timeout(function() {
				if(vm.toUserID && data){
					vm.toUserOnline = data.toUserIsOnline;
				}
			},100);
		});

		socket.on("alert user online",function(data){
			console.log("-----------------alert user online----------------");
			$timeout(function() {
				if(vm.toUserID.trim() == data.fromUserID){
					vm.toUserOnline = true;
				}
			},100);
		});

		socket.on("alert user offline",function(data){
			console.log("-----------------alert user offline----------------");
			$timeout(function() {
				if(vm.toUserID.trim() == data.fromUserID){
					vm.toUserOnline = false;
				}
			},100);
		});

		socket.on("user-start-typing",function(data){
			if($scope.chatBox.user.userID.trim()==data.fromUserID.trim()){
				var toUserName = $scope.chatBox.user.name;
				if(toUserName.indexOf('@') >=0){
					toUserName = toUserName.substring(0,toUserName.indexOf('@'));
				}
				$scope.chatBox.status = toUserName + " is typing...";
				$scope.$apply();
			}
		});

		socket.on("user-stop-typing",function(data){
			if($scope.chatBox.user.userID.trim()==data.fromUserID.trim()){
				$scope.chatBox.status = "";
				$scope.$apply();
			}
		});

		socket.on("unread-messages", function(data){
			console.log("------------------chat-unreadMessage-----------------");

			var readedData = [];
			for (var i = 0, len = data.length; i < len; i++) {
				var msg = data[i].default;
				msg.date = new Date(msg.date);
				if((vm.adsID.trim()==msg.relatedToAds.adsID.trim()) && ($rootScope.user.userID.trim() == msg.toUserID.trim()) &&(vm.toUserID.trim()==msg.fromUserID.trim())){
					readedData.push(data[i]);
				}
			}
			console.log(readedData);
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
				socket.emit('user-stop-typing',{fromUserID: $rootScope.user.userID,toUserID:$scope.chatBox.user.userID},function (data){
					console.log("emit stop typing to " + $scope.chatBox.user.userID);
				});
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
				, timeStamp : (new Date()).getTime()
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
							//var dateString = formatAMPM(new Date());
							var msg = $scope.getMessage();
							msg.msgType = window.RewayConst.CHAT_MESSAGE_TYPE.FILE;
							msg.content = fileUrl;
							socket.emit('send-message',msg,function (data){
								console.log("sent image to " + $scope.chatBox.user.userID);
								if (data.success == true) {
									if(data.offline==true){
										vm.toUserOnline = false;
										$scope.chatBox.status = window.RewayConst.MSG.USER_OFFLINE;
										$scope.chatBox.onlineClass = "offline";
										//console.log("TODO: this person is offline he will receive the message next time he online");
									}
									vm.chatMsg = "";
									msg.timeStamp = (new Date()).getTime();
									window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
									$scope.$apply();
									$("body").animate({ scrollTop: $(document).height() }, "slow");
									// var objDiv = document.getElementById("chatDetailId");
									// objDiv.scrollTop = objDiv.scrollHeight;
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

		$scope.formatAMPM = function(milliseconds) {
			var date = new Date(milliseconds);
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
			console.log("---------------sendMsg---------------");
			if (vm.chatMsg) {
				vm.isFileSelected = false;
				//var dateString = formatAMPM(new Date());
				var msg = $scope.getMessage();
				socket.emit("send-message",msg, function(data){
					//delivery report code goes here
					if (data.success == true) {
						if(data.offline==true){
							vm.toUserOnline = false;
							$scope.chatBox.status = window.RewayConst.MSG.USER_OFFLINE;
							$scope.chatBox.onlineClass = "offline";
							//console.log("TODO: this person is offline he will receive the message next time he online");
						}
						vm.chatMsg = "";
						msg.timeStamp = (new Date()).getTime();
						// $scope.chatBox.messages.push(msg);
						console.log(msg);
						window.RewayClientUtils.addChatMessage($scope.chatBox,msg);
						$scope.$apply();
						$("body").animate({ scrollTop: $(document).height() }, "slow");
						// var objDiv = document.getElementById("chatDetailId");
						// objDiv.scrollTop = objDiv.scrollHeight;
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
