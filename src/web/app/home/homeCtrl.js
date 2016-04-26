(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, uiGmapGoogleMapApi){
		var vm = this;
		init();
		//nhannc
		$scope.placeSearchId='ChIJoRyG2ZurNTERqRfKcnt_iOc';
		$scope.goToPageSearch = function(){
			$state.go('search', { place : $scope.placeSearchId });
		}

		//End nhannc
		vm.getAllAds = function(){
			HouseService.getAllAds().then(function(res){
				vm.sellingHouses = res.data;
				$scope.markers = [];
				for(var i = 0; i < res.data.length; i++) { 
		    		var ads = res.data[i];
		    		if(res.data[i].map)
		    			$scope.markers.push(res.data[i].map.marker);
				}
			});
		}
		
		$scope.$on('$viewContentLoaded', function(){
			//addCrudControls
			window.DesignCommon.adjustPage();
			if($state.current.data)
				$scope.bodyClass = $state.current.data.bodyClass
			// window.onresize = function() {
			//     window.DesignCommon.resizePage();
			// }
		});
		
		vm.formatLabel = function(model){
			if(model)
				return model.formatted_address;
		}
		
		function init(){
			//nhannc
			$scope.loaiNhaDatBan = [
				{ "type": "1", "name": "Nhà đất" },
				{ "type": "2", "name": "Chung cư" },
				{ "type": "3", "name": "BDS bán gần đây" },
				{ "type": "4", "name": "Tìm kiếm nâng cao" },
				{ "type": "5", "name": "Tất cả" }
			];

			$scope.loaiNhaDatThue = [
				{ type: "1", name: "Nhà ở" },
				{ type: "2", name: "Phòng trọ" },
				{ type: "3", name: "Văn phòng" },
				{ type: "4", name: "Cửa hàng" },
				{ type: "5", name: "Tham khảo giá nhà cho thuê" },
				{ type: "6", name: "Tìm kiếm nâng cao" },
				{ type: "7", name: "Tất cả" }
			];
			uiGmapGoogleMapApi.then(function(maps){
				var searchBox = new maps.places.Autocomplete(
					(document.getElementById('autoCompleteHome')), {
						types: ['geocode']
					});
				searchBox.addListener('place_changed', function () {
					var place = searchBox.getPlace();
					$scope.searchPlaceHomeSelected = place;
					HouseService.findGooglePlaceById($scope.searchPlaceHomeSelected.place_id).then(function(response){
						$scope.searchPlaceHomeSelected = response.data.result;
						$scope.placeSearchId = $scope.searchPlaceHomeSelected.place_id;
					});
				})
			})
			function init(){
				uiGmapGoogleMapApi.then(function(maps){
					window.RewayClientUtils.createPlaceAutoComplete($scope,"autoCompleteHome",maps);
					uiGmapIsReady.promise(1).then(function(instances) {
						instances.forEach(function(inst) {
							var map = inst.map;
							$scope.PlacesService =  new maps.places.PlacesService(map);
							$scope.PlacesService.getDetails({
								placeId: vm.placeId
							}, function(place, status) {
								if (status === maps.places.PlacesServiceStatus.OK) {
									$scope.searchPlaceSelected = place;
									//var map = $scope.map.control.getGMap();
									var current_bounds = map.getBounds();
									$scope.map.center = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() }
									if(place.geometry.viewport){
										//map.fitBounds(place.geometry.viewport);	
										//$scope.map
									} else if( !current_bounds.contains( place.geometry.location ) ){
										//var new_bounds = current_bounds.extend(place.geometry.location);
										//map.fitBounds(new_bounds);
										$digest();
									}
									vm.search();
								}
							});
						});
					});

				});
			//end nhannc
			$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {}};
			$scope.options = {scrollwheel: false,labelContent: 'gia'};
			$scope.markerCount = 3;
			$scope.markers = [];
			$scope.initData = window.initData;
			$scope.hot_ads_cat = window.hot_ads_cat;
			$scope.ads_list = window.testData;
			$scope.bodyClass= "page-home";
			for(var i = 0; i < $scope.ads_list.length; i++) { 
	    		var ads = $scope.ads_list[i];
	    		if(ads.place){
	    			if(ads.place.geo){
		    			ads.map={
		    				center: {
								latitude: 	ads.place.geo.lat,
								longitude: 	ads.place.geo.lon
							},
		    				marker: {
								id: i,
								coords: {
									latitude: 	ads.place.geo.lat,
									longitude: 	ads.place.geo.lon
								},
								options: {
									//labelContent : ads.gia,
									icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+ ads.gia+ '|FF0000|000000'
								},
								data: 'test'
							},
							options:{
								scrollwheel: false
							},
							zoom: 14	
		    			}
		    			$scope.map.center = {latitude: ads.map.center.latitude, longitude: ads.map.center.longitude };
		    			$scope.markers.push(ads.map.marker);
		    					
					}
	    		}
			}

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
				options: {
					labelContent : 'You are here'
				},
				data: 'restaurant'
			}
			$scope.markers.push(marker);
			$scope.markerCount = $scope.markerCount + 1;
			$scope.$digest();
		}

	});

	// /* @ngInject */
	// function MainCtrl() {
		
	// }
})();
