(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, uiGmapGoogleMapApi, uiGmapIsReady, $window){
		var vm = this;
		//nhannc
		$scope.loaiTin = 0;
		$scope.loaiNhaDat;
		$scope.placeSearchId='ChIJoRyG2ZurNTERqRfKcnt_iOc';
		init();
		initHotAds();
		//alert("placeSearchId: " + $scope.placeSearchId);
		$scope.goToPageSearch = function(msgType){
			//alert("msgType: " + msgType);
			if(msgType){
				console.log("msgType: " + msgType);
				if(msgType.length >= 2){
					$scope.loaiTin = msgType.substring(0,1);
					$scope.loaiNhaDat = msgType.substring(1);
					if($scope.loaiNhaDat == '0')
						$scope.loaiNhaDat = null;
				} else{
					$scope.loaiTin = msgType;
				}
			}

			console.log("$scope.loaiTin: " + $scope.loaiTin);
			console.log("$scope.loaiNhaDat: " + $scope.loaiNhaDat);
			console.log("$scope.placeId: " + $scope.placeSearchId);
			$state.go('search', { "place" : $scope.placeSearchId, "loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat }, {location: true});
		}

		$scope.setLoaiTin = function(loaiTin){
			$scope.loaiTin = loaiTin;
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
				{ type: "00", name: "Tất cả" },
				{ type: "01", name: "Căn hộ chung cư" },
				{ type: "02", name: "Nhà riêng" },
				{ type: "03", name: "Nhà mặt phố" },
				{ type: "04", name: "Biệt thự, liền kề" },
				{ type: "05", name: "Nhà đất" },
				{ type: "099", name: "Các BDS khác" },
				{ type: "010", name: "Tìm kiếm nâng cao" }
			];

			$scope.loaiNhaDatThue = [
				{ type: "10", name: "Tất cả" },
				{ type: "11", name: "Căn hộ chung cư" },
				{ type: "12", name: "Nhà riêng" },
				{ type: "13", name: "Nhà mặt phố" },
				{ type: "14", name: "Văn phòng" },
				{ type: "15", name: "Cửa hàng, ki-ốt" },
				{ type: "199", name: "Các BDS khác" },
				{ type: "110", name: "Tìm kiếm nâng cao" }
			];

			/*uiGmapGoogleMapApi.then(function(maps){
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
			})*/

			uiGmapGoogleMapApi.then(function(maps){
				window.RewayClientUtils.createPlaceAutoComplete($scope,"autoCompleteHome",maps);
				uiGmapIsReady.promise(1).then(function(instances) {
					instances.forEach(function(inst) {
						var map = inst.map;
						$scope.PlacesService =  new maps.places.PlacesService(map);
						$scope.PlacesService.getDetails({
							placeId: $scope.placeSearchId
						}, function(place, status) {
							if (status === maps.places.PlacesServiceStatus.OK) {
								$scope.searchPlaceHomeSelected = place;
								$scope.placeSearchId = $scope.searchPlaceHomeSelected.place_id;
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

		function initHotAds(){
			console.log("----------------------aha ha aha ---------------");
			var data = {
				"ngayDangTin": '25-04-2016',
				"limit": 4
			};
			console.log("getRecentBds + data: " + data);
			HouseService.findRencentAds(data).then(function(res){
				var result = res.data.list;
				console.log("Result: " + findRecent);
			});
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
