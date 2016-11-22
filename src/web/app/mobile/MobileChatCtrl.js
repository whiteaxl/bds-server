(function() {
	'use strict';
	var controllerId = 'MobileChatCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, socket, $compile, NewsService, NgMap, $window,$timeout,$location){
		var vm = this;
		vm.allInbox = [];
		vm.allSaleInbox = [];
		vm.allRentInbox = [];

		vm.init = function(){
			socket.emit('new user',{email: $rootScope.user.userEmail, userID:  $rootScope.user.userID, username : $rootScope.user.userName},function(data){
				console.log("register socket user " + $rootScope.user.userID);
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
					async.forEach(vm.allInbox,function(inbox){
						HouseService.getAllChatMsg({userID: $rootScope.user.userID, partnerUserID: inbox.partner.userID, adsID: inbox.relatedToAds.adsID}).then(function(res) {
							if (res.status == 200 && res.data.status == 0) {
								if(res.data.data.length > 0){
									inbox.lastMsg = res.data.data[0].default.content;
									inbox.lastDate = vm.getChatTime(new Date(res.data.data[0].default.date));
								}
							}
						});
					}, function(err){
						if(err){throw err;}
						console.log("processing all elements completed");
					});

					var inbox;
//check co nen dua doan tach nay vao each tren do ko

					for(var i=0; i< vm.allInbox.length; i ++){
						inbox = vm.allInbox[i];

						if(inbox.relatedToAds.loaiTin == 0){
							vm.allSaleInbox.push(inbox);
						} else {
							vm.allRentInbox.push(inbox);
						}
					}
				}
				socket.emit('get-unread-message',{userID: $rootScope.user.userID},function (data){
					console.log("-----------------emit get-unread-message " + $rootScope.user.userID);
					console.log(data);
				});
			}
		});

		vm.openChatDetail = function(inbox){
			$state.go('mchatDetail', { "adsID" : inbox.relatedToAds.adsID, "toUserID" : inbox.partner.userID});
			$(".overlay").click();
		}

		socket.on("new message", function(data){
			console.log("-------------chat------new message---------------");
			console.log(data);
			data.date = new Date(data.date);

			if(vm.allInbox.length > 0){
				var async = require("async");
				async.forEach(vm.allInbox,function(inbox){
					var count = 0;
					if(inbox.unreadCount){
						count = inbox.unreadCount;
					}
					if($rootScope.user.userID.trim()==data.toUserID && inbox.partner.userID.trim()==data.fromUserID.trim() && inbox.relatedToAds.adsID.trim()==data.relatedToAds.adsID.trim()){
						count++;
						inbox.unreadCount = count;
						inbox.lastMsg = data.content;
						inbox.lastDate = vm.getChatTime(new Date(data.date));
					}
				}, function(err){
					if(err){throw err;}
					console.log("processing all elements completed");
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
			}
			$scope.$apply();
		});

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
						for (var i = 0; i < data.length; i++) {
							var msg = data[i].default;
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
						for (var i = 0; i < data.length; i++) {
							var msg = data[i].default;
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
						for (var i = 0; i < data.length; i++) {
							var msg = data[i].default;
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
		});
	});
})();
