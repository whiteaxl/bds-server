(function() {
	'use strict';
	var controllerId = 'MobileHomeCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location){
		var vm = this;
		var query = { loaiTin: 0,
		   giaBETWEEN: [ 0, 9999999 ],
		   soPhongNguGREATER: '0',
		   soTangGREATER: '0',
		   soPhongTamGREATER: '0',
		   dienTichBETWEEN: [ 0, 9999999 ],
		   place:
		   { placeId: 'ChIJKQqAE44ANTERDbkQYkF-mAI',
		   relandTypeName: 'Tỉnh',
		   fullName: 'Hanoi',
		   radiusInKm: 0.5 },
		   limit: 200,
		   polygon: []
	   	}
	   	var homeDataSearch = {
          timeModified: undefined,
          query: query,
          currentLocation : undefined
        }
        vm.getLocation = function() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(function(position){
		        	$rootScope.currentLocation.lat = position.coords.latitude;
		        	$rootScope.currentLocation.lon = position.coords.longitude;
		        	homeDataSearch.currentLocation = $rootScope.currentLocation;
		        	HouseService.homeDataForApp(homeDataSearch).then(function(res){
						//alert(JSON.stringify(res));
						vm.boSuuTap = res.data.data; 
					});
		        });
		    } else {
		        x.innerHTML = "Geolocation is not supported by this browser.";
		    }
		}
		vm.getLocation();
		
	});
})();
