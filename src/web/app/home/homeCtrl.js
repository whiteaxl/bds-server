(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,MainCtrl);

	/* @ngInject */
	function MainCtrl($rootScope, $scope,HouseService) {
		var vm = this;
		init();
		
		$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 20 , control: {}};
		$scope.options = {scrollwheel: false};
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
        //alert($scope.map.center['latitude']);
        vm.findHouse = function(){
        	
        	HouseService.findHouse().then(function(res){
        		vm.sellingHouses = res.data;
        	});
        }
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
			$scope.map.center.latitude = lat;
			$scope.map.center.longitude = lng;
			alert(lat);
			alert(lng);
			$scope.map.control.refresh();
			//map.setCenter(new google.maps.LatLng(lat, lng));
		}
	}
})();
