(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService){
		var vm = this;
		init();
		//vm.initData = initData;
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
		
		
		/*$scope.markers = [{
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
		}];*/
		vm.search = function(param){
			//alert(param);
			HouseService.findAdsSpatial($scope.searchPlaceSelected).then(function(res){
				var result = res.data.list;
				for (var i = 0; i < result.length; i++) { 
		    		var ads = result[i];
		    		if(result[i].place){
		    			if(result[i].place.geo){
			    			result[i].map={
			    				center: {
									latitude: 	result[i].place.geo.lat,
									longitude: 	result[i].place.geo.lon
								},
			    				marker: {
									id: i,
									coords: {
										latitude: 	result[i].place.geo.lat,
										longitude: 	result[i].place.geo.lon
									},
									options: {
										labelContent : result[i].gia
									},
									data: 'test'
								},
								options:{
									scrollwheel: false
								},
								zoom: 14	
			    			}
			    					
						}
		    		}
		    		
				}
				$scope.ads_list = res.data.list;
				$scope.markers = [];
				for(var i = 0; i < res.data.list.length; i++) { 
		    		var ads = res.data.list[i];
		    		if(res.data.list[i].map)
		    			$scope.markers.push(res.data.list[i].map.marker);
				}
			});
		}
		vm.formatLabel = function(model){
			if(model)
				return model.formatted_address;
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
