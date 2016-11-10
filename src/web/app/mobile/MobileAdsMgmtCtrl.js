(function() {
	'use strict';

	var controllerId = 'MobileAdsMgmtCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, Upload, $state, HouseService, NewsService, RewayCommonUtil, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;

		vm.adsLikes = [];

		vm.goDetail = function(ads){
			$state.go('mdetail', { "adsID" : ads.adsID}, {location: true});
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
		
		vm.unlikeAds = function(ads){
			console.log("------------unlikeAds---------------");
			$timeout(function() {
				vm.abc(ads);
			},300);
			
		}

		vm.abc = function(ads){
			if($rootScope.user && $rootScope.user.userID){
				HouseService.unlikeAds({userID: $rootScope.user.userID, adsID: ads.adsID}).then(function(res){
					console.log("------------abc---------------");
					console.log(res);
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
		}

		$timeout(function() {
			vm.init();
		},300);
	});
})();
