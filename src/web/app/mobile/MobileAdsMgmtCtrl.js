(function() {
	'use strict';

	var controllerId = 'MobileAdsMgmtCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, Upload, $state, HouseService, NewsService, RewayCommonUtil, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;
		if($state.params.loaiTin)
			vm.loaiTin = $state.params.loaiTin;

		vm.adsLikes = [];
		vm.adsSales = [];
		vm.adsRents = [];
		
		vm.resetInactiveClass = function(){
			console.log("--------------reset---------------");
			$(".nav-tabs-3").find("li").removeClass("active");
			$("#managerSaved").removeClass("active");
			$("#managerSale").removeClass("active");
			$("#managerRent").removeClass("active");
		}
		
		vm.setActivePanel =  function(){
			if(!vm.loaiTin){
				console.log("--------------tab---da luu---------------");
				$( "#tabDaLuuId" ).parent().addClass("active");
				$("#managerSaved").addClass("active");
			} else {
				if(vm.loaiTin==0){
					console.log("--------------tab---ban---------------");
					$( "#tabSaleId" ).parent().addClass("active");
					$("#managerSale").addClass("active");
				} else if(vm.loaiTin==1){
					console.log("--------------tab---thue---------------");
					$( "#tabRentId" ).parent().addClass("active");
					$("#managerRent").addClass("active");
				}
			}
		}

		vm.goDetail = function(ads){
			$state.go('mdetail', { "adsID" : ads.adsID});
		}

		vm.updateAds = function(ads){
			console.log("------------------updateAds-------------");
			$state.go('mpost', { "adsID" : ads.adsID});
		}

		vm.deleteAds = function(ads, loaiTin){
			console.log("------------------deleteAds-------------");
			var avatarImage = ads.image.cover;
			var imgList = ads.image.images;
			HouseService.deleteAds({adsID: ads.adsID}).then(function(res){
				console.log("------------------callService-------------");
				console.log(res);
				if(res.status==200){
					if(loaiTin == 0){
						var index = vm.adsSales.indexOf(ads);
						vm.adsSales.splice(index, 1);
					} else{
						var index = vm.adsRents.indexOf(ads);
						vm.adsRents.splice(index, 1);
					}
					if(avatarImage){
						HouseService.deleteFile({fileUrl: avatarImage.trim()}).then(function(res){
							console.log(res);
						})
					}
					if(imgList){
						for(var i=0; i< imgList.length; i++){
							HouseService.deleteFile({fileUrl: imgList[i].trim()}).then(function(res){
								console.log(res);
							})
						}
					}
				}
			});
		}

		vm.initAdsLikesData = function(){
			if($rootScope.user && $rootScope.user.userID){
				HouseService.getAdsLikes({userID: $rootScope.user.userID}).then(function (res) {
					if(res.status == 200){
						if(res.data.data){
							for(var i = 0; i < res.data.data.length; i++){
								vm.adsLikes.push(res.data.data[i]);
							}
						}
					}
					console.log("------------initLikes---------------");
					console.log(vm.adsLikes);
				})
			}
		}

		vm.initAdsSaleRents = function(){
			if($rootScope.user && $rootScope.user.userID){
				HouseService.getMyAds({userID: $rootScope.user.userID}).then(function (res) {
					console.log("------------initAdsSaleRent---------------");
					console.log(res);
					if(res.status == 200){
						if(res.data.data){
							for(var i = 0; i < res.data.data.length; i++){
								if(res.data.data[i].loaiTin == 0){
									vm.adsSales.push(res.data.data[i]);
								} else if(res.data.data[i].loaiTin == 1){
									vm.adsRents.push(res.data.data[i]);
								}
							}
						}
					}

				})
			}
		}
/*
		vm.scrollElement = function(){
			console.log("-------------scrollElement--121-----");
			$('#banId').click(function (e) {
				$('html, body').animate({
					scrollTop: $('#managerBuy').offset().top - 1
				}, 'slow');
			});

			console.log("-------------scrollElement--1-----");

		}
*/
		vm.unlikeAds = function(event, ads){
			console.log("------------unlikeAds---------------");
			$(event.target).attr('class', 'icon-heart refresh');
			$(event.target).unbind();
			if($rootScope.user && $rootScope.user.userID){
				HouseService.unlikeAds({userID: $rootScope.user.userID, adsID: ads.adsID}).then(function(res){
					if(res.status == 200){
						var index = vm.adsLikes.indexOf(ads);
						vm.adsLikes.splice(index, 1);
					}
					console.log(vm.adsLikes);
				})
			}
		}

		vm.init = function(){
			vm.initAdsLikesData();
			vm.initAdsSaleRents();
			var async = require("async");
			async.series(
				vm.resetInactiveClass(),
				vm.setActivePanel()
			);
		}

		$timeout(function() {
			vm.init();
		},300);
	});
})();
