(function() {
	'use strict';
	var controllerId = 'DetailCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window,$timeout){
		var vm = this;
		vm.viewMap = false;
		$scope.chat_visible = true;
		$scope.$on('$viewContentLoaded', function(){
			window.DesignCommon.adjustPage();
			if($state.current.data){
				$rootScope.bodyClass = "page-detail";
			}
		});	

		vm.marker = {
			id: 1,
			coords: {
				latitude: 	16.0439,
				longitude: 	108.199
			},
			content: undefined,
			data: 'test'
		}
		vm.center= [21.0363818591319,105.80105538518103];

		vm.diaChinh=  {};
		

		vm.showChat = function(user){
			if(!$rootScope.userID){
				alert("Đăng nhập để chat");
				return;
			}
			$scope.$bus.publish({
              channel: 'chat',
              topic: 'new user',
              data: {userID: user.userID,name: user.name,ads: {adsID:vm.ads.adsID, title: vm.ads.title, cover: vm.ads.image.cover}}
	        });
		};
		vm.likeAds = function(adsID){
	      if(!$rootScope.userID){
	        alert("Đăng nhập để like");
	        return;
	      }
	      HouseService.likeAds({adsID: vm.adsID,userID: $rootScope.userID}).then(function(res){
	        alert(res.data.msg);
	        console.log(res);
	      });
	    };
		$timeout(function() {
			$('body').scrollTop(0);
		},0);
		vm.adsID = $state.params.adsID;
		HouseService.detailAds({adsID: vm.adsID}).then(function(res){
			//console.log("res.data " + res.data.ads);
			vm.ads = res.data.ads;
			vm.marker.coords.latitude = vm.ads.place.geo.lat;
			vm.marker.coords.longitude = vm.ads.place.geo.lon;
			vm.center = [vm.ads.place.geo.lat,vm.ads.place.geo.lon];
			vm.marker.content = vm.ads.giaFmt;
			vm.diaChinh = vm.ads.place.diaChinh;
			$scope.email = vm.ads.dangBoi.email;
		});


	});

})();