(function() {
	'use strict';
	var controllerId = 'MobileChatCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, socket, $compile, NewsService, NgMap, $window,$timeout,$location, $localStorage){
		var vm = this;
		vm.allInbox = [];
		vm.allSaleInbox = [];
		vm.allRentInbox = [];
		vm.toUserIdDetail;

		vm.init = function(){
			socket.emit('alert user online',{email: $rootScope.user.userEmail, fromUserID:  $rootScope.user.userID, fromUserName : $rootScope.user.userName},function(data){
				console.log("alert user online " + $rootScope.user.userID);
			});
		}

		$timeout(function() {
			vm.init();
		},100);

		vm.getChatTime = function (date) {
			var mm = date.getMonth() + 1; // getMonth() is zero-based
			mm = (mm >= 10)? mm:('0'+mm);
			var dd = date.getDate();
			dd = (dd >= 10)? dd:('0'+dd);
			var hour = date.getHours();
			hour = (hour >= 10)? hour:('0'+hour);
			var minute = date.getMinutes();
			minute = (minute >= 10)? minute:('0'+minute);

			return (dd + ' tháng ' + mm + ' ' + hour + ':' + minute);
		}
		HouseService.getInboxMsg({userID: $rootScope.user.userID}).then(function(res) {
			if (res.status == 200 && res.data.status == 0) {
				vm.allInbox = res.data.data;
				if(vm.allInbox.length > 0){
					var async = require("async");
					async.forEach(vm.allInbox,function(inbox, callback){
						console.log("-------------inbox----:" + inbox.partner.userID);
						HouseService.getAllChatMsg({userID: $rootScope.user.userID, partnerUserID: inbox.partner.userID, adsID: inbox.relatedToAds.adsID}).then(function(res) {
							if (res.status == 200 && res.data.status == 0) {
								console.log("-------------msg of inbox----:" + inbox.partner.userID);
								if(res.data.data.length > 0){
									inbox.lastMsg = res.data.data[0].default.content;
									inbox.lastDate = vm.getChatTime(new Date(res.data.data[0].default.date));
									inbox.lastTime = new Date(res.data.data[0].default.date).getTime();
									var count = 0;
									for(var i=0; i<res.data.data.length; i++){
										if(!res.data.data[i].default.read){
											if((inbox.partner.userID.trim()==res.data.data[i].default.fromUserID.trim()) && (inbox.relatedToAds.adsID.trim()==res.data.data[i].default.relatedToAds.adsID.trim()))
												++count;
										}
									}
									if(count>0)
										inbox.unreadCount = count;
								}
							}
							callback();
						});

					}, function(err){
						if(err){throw err;}
						console.log("processing all elements completed");
						vm.allInbox.sort(function(obj1, obj2) {
							console.log("-------------sort----:");
							console.log("--------" + obj2.lastTime + "--------------" + obj1.lastTime);
							return obj2.lastTime - obj1.lastTime;
						});
						var inbox;
						var unreadMsg = 0;
						for(var i=0; i< vm.allInbox.length; i ++){
							inbox = vm.allInbox[i];
							if(inbox.unreadCount)
								unreadMsg = unreadMsg + inbox.unreadCount;
							if(inbox.relatedToAds.loaiTin == 0){
								vm.allSaleInbox.push(inbox);
							} else {
								vm.allRentInbox.push(inbox);
							}
						}
						$rootScope.unreadMsg = unreadMsg;
						$localStorage.unreadMsg = $rootScope.unreadMsg;
						console.log("---------------processing all elements completed--------------------");
					});
				}
				/*
				socket.emit('get-unread-message',{userID: $rootScope.user.userID},function (data){
					console.log("-----------------emit get-unread-message " + $rootScope.user.userID);
					console.log(data);
				});*/
			}
		});

		vm.openChatDetail = function(inbox){
			vm.toUserIdDetail=inbox.partner.userID;
			vm.toAdsIDDetail=inbox.relatedToAds.adsID;
			$state.go('mchatDetail', { "adsID" : inbox.relatedToAds.adsID, "toUserID" : inbox.partner.userID});
			$(".overlay").click();
		}

		/*
		$scope.$on('$destroy', function () {
			console.log("-------------destroy--chat------------");
			socket.removeListener("new message",function(data){
				console.log("-------------destroy--chat------new message---------------");
				console.log(data);
			})
		});*/

		$scope.$on('$destroy', function (event) {
			console.log("-------------destroy--chat------------");
			socket.removeAllListeners();
			// or something like
			// socket.removeListener(this);
		});

		socket.on("new message", function(data){
			console.log("-------------chat------new message---------------");
			if(!$rootScope.isChatDetail){
				console.log("-------------chat------new message--------in-------");
				console.log(vm.toUserIdDetail);
				data.date = new Date(data.date);

				if(vm.allInbox.length > 0){
					var isContain = false;
					var async = require("async");
					async.forEach(vm.allInbox,function(inbox, callback){
						var count = 0;
						if(inbox.unreadCount){
							count = inbox.unreadCount;
						}
						if($rootScope.user.userID.trim()==data.toUserID && inbox.partner.userID.trim()==data.fromUserID.trim() && inbox.relatedToAds.adsID.trim()==data.relatedToAds.adsID.trim()){
							count++;
							inbox.unreadCount = count;
							inbox.lastMsg = data.content;
							inbox.lastDate = vm.getChatTime(new Date(data.date));
							inbox.lastTime = new Date(data.date).getTime();
							isContain = true;
							console.log("--------------------msg from : " + data.fromUserID.trim());
							console.log(inbox.unreadCount);
						}
						callback();
					}, function(err){
						if(err){throw err;}
						console.log("processing all elements completed");
						if(!isContain){
							var inbox ={};
							inbox.partner = {};
							inbox.partner.userID = data.fromUserID.trim();
							inbox.partner.fullName = data.fullName;
							inbox.partner.avatar = data.avatar;
							inbox.relatedToAds = data.relatedToAds;
							inbox.unreadCount = 1;
							inbox.lastMsg = data.content;
							inbox.lastDate = vm.getChatTime(new Date(data.date));
							inbox.lastTime = new Date(data.date).getTime();
							vm.allInbox.push(inbox);
						}
						if(!$rootScope.unreadMsg)
							$rootScope.unreadMsg = 1;
						else
							$rootScope.unreadMsg = $rootScope.unreadMsg + 1;
					});
				} else{
					var inbox ={};
					inbox.partner = {};
					inbox.partner.userID = data.fromUserID.trim();
					inbox.partner.fullName = data.fullName;
					inbox.partner.avatar = data.avatar;
					inbox.relatedToAds = data.relatedToAds;
					inbox.unreadCount = 1;
					inbox.lastMsg = data.content;
					inbox.lastDate = vm.getChatTime(new Date(data.date));
					vm.allInbox.push(inbox);
					if(!$rootScope.unreadMsg)
						$rootScope.unreadMsg = 1;
					else
						$rootScope.unreadMsg = $rootScope.unreadMsg + 1;
				}

				vm.allInbox.sort(function(obj1, obj2) {
					return obj2.lastTime - obj1.lastTime;
				})
				$scope.$apply();
			}
		});

		/*
		socket.on("unread-messages", function(data){
			console.log("------------------chat-unreadMessage-----------------");
			console.log(data);
			if(data.length > 0){
				var inbox;
				var count = 0;
				if(vm.allInbox.length > 0){
					for (var i = 0; i < vm.allInbox.length; i++) {
						inbox = vm.allInbox[i];
						count = 0;
						for (var j = 0; j < data.length; j++) {
							var msg = data[j].default;
							msg.date = new Date(msg.date);
							if((inbox.relatedToAds.adsID==msg.relatedToAds.adsID.trim()) && ($rootScope.user.userID.trim() == msg.toUserID.trim()) &&(inbox.partner.userID.trim()==msg.fromUserID.trim())){
								count++;
							}
						}
						if(count > 0){
							inbox.unreadCount = count;
						}
					}
				}
				if(vm.allSaleInbox.length > 0){
					for (var i = 0; i < vm.allSaleInbox.length; i++) {
						inbox = vm.allSaleInbox[i];
						count = 0;
						for (var j = 0; j < data.length; j++) {
							var msg = data[j].default;
							msg.date = new Date(msg.date);
							if((inbox.relatedToAds.adsID==msg.relatedToAds.adsID.trim()) && ($rootScope.user.userID.trim() == msg.toUserID.trim()) &&(inbox.partner.userID.trim()==msg.fromUserID.trim())){
								count++;
							}
						}
						if(count > 0){
							inbox.unreadCount = count;
						}
					}
				}
				if(vm.allRentInbox.length > 0){
					for (var i = 0; i < vm.allRentInbox.length; i++) {
						inbox = vm.allRentInbox[i];
						count = 0;
						for (var j = 0; j < data.length; j++) {
							var msg = data[j].default;
							msg.date = new Date(msg.date);
							if((inbox.relatedToAds.adsID==msg.relatedToAds.adsID.trim()) && ($rootScope.user.userID.trim() == msg.toUserID.trim()) &&(inbox.partner.userID.trim()==msg.fromUserID.trim())){
								count++;
							}
						}
						if(count > 0){
							inbox.unreadCount = count;
						}
					}
				}
			}
			console.log("-------------------unreadMessage--------1---------");
			console.log(vm.allInbox);
		});*/
	});
})();
