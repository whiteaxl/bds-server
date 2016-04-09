(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,MainCtrl);

	/* @ngInject */
	function MainCtrl($rootScope, $scope,HouseService) {
		var vm = this;
		init();
		vm.getAllAds = function(){
			HouseService.getAllAds().then(function(res){
				vm.sellingHouses = res.data;

				for(var i = 0; i < res.data.length; i++) { 
		    		var ads = res.data[i];
		    		if(res.data[i].map)
		    			$scope.markers.push(res.data[i].map.marker);
				}
			});
		}
		$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {}};
		$scope.options = {scrollwheel: false};
		$scope.markerCount = 3;
		$scope.markers = [{
			id: 0,
			coords: {
				latitude: 10.762622,
				longitude: 106.660172
			},
			data: 'restaurant'
		}, {
			id: 1,
			coords: {
				latitude: 21.033333,
				longitude: 105.849998
			},
			data: 'house'
		}, {
			id: 2,
			coords: {
				latitude: 16.0439,
				longitude: 108.199
			},
			data: 'hotel'
		}];
		$scope.markers = [];
		vm.createHouse = function(desc,seller,email){
        	vm.getLocation();
        	return;
        	HouseService.createHouse(desc,seller,email).then(function(res){
				//vm.sellingHouses = res.data;
				alert(res.data);
			});
			//alert("done");

		}
		vm.detailHouse = function(){
			alert('todo');

		}
		function init(){
		}
		vm.getLocation = function () {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(vm.showPosition);
			} else {
				alert("Geolocation is not supported by this browser.");
			}
		}
		vm.showPosition =  function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			//$scope.map.center.latitude = lat;
			//$scope.map.center.longitude = lng;
			var marker = {
				id: $scope.markerCount,
				coords: {
					latitude: lat,
					longitude: lng
				},
				data: 'restaurant'
			}
			$scope.markers.push(marker);
			$scope.markerCount = $scope.markerCount + 1;
			$scope.$digest();
		}
	}
})();
