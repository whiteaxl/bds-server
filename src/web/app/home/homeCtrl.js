(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window ,$timeout){
		var vm = this;
		//nhannc
		$scope.loaiTin = 0;
		$scope.loaiNhaDat;
		$scope.listCategory = [];
		$scope.placeSearchId='ChIJoRyG2ZurNTERqRfKcnt_iOc';
		init();
		initHotAds();
		//alert("placeSearchId: " + $scope.placeSearchId);
		$scope.goToPageSearch = function(loaiTin, loaiBds){
			if(loaiTin)
				$scope.loaiTin = loaiTin;
			if(loaiBds)
				$scope.loaiNhaDat = loaiBds;
			if($scope.loaiNhaDat == '0')
				$scope.loaiNhaDat = null;

			console.log("$scope.loaiTin: " + $scope.loaiTin);
			console.log("$scope.loaiNhaDat: " + $scope.loaiNhaDat);
			console.log("$scope.placeId: " + $scope.placeSearchId);
			$state.go('search', { "place" : $scope.placeSearchId, "loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat }, {location: true});
		}
		$scope.goToPageNews = function(rootCatId){
			console.log("--goToPageNews---rootCatId: " + rootCatId);
			$state.go('news',{"rootCatId" : rootCatId});
		}
		vm.selectPlaceCallback = function(place){
			$scope.searchPlaceSelected = place;
			$scope.placeSearchId = place.place_id;
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
			$timeout(function() {
				window.DesignCommon.adjustPage();
			},0);
			if($state.current.data)
				$rootScope.bodyClass = $state.current.data.bodyClass
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
			$scope.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
			$scope.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;
			$scope.loaiNhaDatCanMua = window.RewayListValue.LoaiNhaDatCanMuaWeb;
			$scope.loaiNhaDatCanThue = window.RewayListValue.LoaiNhaDatCanThueWeb;
			/*
			console.log("---------nhannc--------------listCategory");
			NewsService.findRootCategory().then(function(res){
				var result = [];
				if(res.data.list){
					for (var i = 0; i < res.data.list.length; i++) {
						$scope.listCategory.push({value: res.data.list[i].cat_id, lable: res.data.list[i].cat_name});
					}
				}
				console.log("---------listCategory: " + $scope.listCategory.length);
				console.log($scope.listCategory);
			});*/

			//NhanNc add menu Tin tuc
			if(!menuHasContainsNewsCategory()){
				var danhMucCategory =  {
					label: "Tin tức",
					value: {},
					visible: true,
					items: []
				};

				NewsService.findRootCategory().then(function(res){
					var result = [];
					if(res.data.list){
						for (var i = 0; i < res.data.list.length; i++) {
							danhMucCategory.items.push({value: {menuType : 1, rootCatId : res.data.list[i].cat_id}, label: res.data.list[i].cat_name});
						}
					}
					console.log("---------listCategory moi-------: " + $scope.listCategory.length);
					console.log($scope.listCategory);
				});
				$rootScope.menuitems.push(danhMucCategory);
			}
			//NhanNc add menu Tin tuc

			NgMap.getMap().then(function(map){
	        	// $scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
	        	window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"autoCompleteHome",map);
	        	$scope.PlacesService =  new google.maps.places.PlacesService(map);
	        	$scope.PlacesService.getDetails({
	        		placeId: $scope.placeId
	        	}, function(place, status) {
	        		if (status === google.maps.places.PlacesServiceStatus.OK) {
	        			$scope.searchPlaceSelected = place;
						        		//var map = $scope.map.control.getGMap();
						        		var current_bounds = map.getBounds();
						        		//$scope.map.center =  
						        		vm.center = "["+place.geometry.location.lat() +"," +place.geometry.location.lng() +"]";
						        		if(place.geometry.viewport){
						        			//map.fitBounds(place.geometry.viewport);	
						        			//$scope.map
						        		} else if( !current_bounds.contains( place.geometry.location ) ){
						        			//var new_bounds = current_bounds.extend(place.geometry.location);
						        			//map.fitBounds(new_bounds);
						        			//$digest();
						        		}
						        		$scope.$apply();
						        		//vm.search();
						        	}
						        });

        	});
			//end nhannc
			$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {}};
			$scope.options = {scrollwheel: false,labelContent: 'gia'};
			$scope.markerCount = 3;
			$scope.markers = [];
			$scope.initData = window.initData;
			//$scope.hot_ads_cat = window.hot_ads_cat;
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

		function menuHasContainsNewsCategory() {
			for (var i = 0; i < $rootScope.menuitems.length; i++) {
				if ($rootScope.menuitems[i].label == "Tin tức") {
					return true;
				}
			}
			return false;
		}

		function initHotAds(){
			console.log("---------------------initHotAds ---------------");
			data = {
				"gia": 800,
				"limit": 4
			};

			$scope.hot_ads_cat = [];

			HouseService.findBelowPriceAds(data).then(function(res){
				var resultBelow = [];
				if(res.data.list){
					for (var i = 0; i < res.data.list.length; i++) {
						resultBelow.push(res.data.list[i].default);
					}
					$scope.hot_ads_cat.push({
						name: "Nhà dưới mức giá 800 triệu",
						location: "Hà Nội",
						list: resultBelow
					})
				}
				console.log("HouseService.findBelowPriceAds: " + resultBelow.length);
				console.log(resultBelow);
			});

			var data = {
				"ngayDangTin": '25-04-2016',
				"limit": 4
			};
			console.log("getRecentBds + data: " + data);
			HouseService.findRencentAds(data).then(function(res){
				var result = [];
				if(res.data.list){
					for (var i = 0; i < res.data.list.length; i++) {
						result.push(res.data.list[i].default);
					}
					$scope.hot_ads_cat.push({
						name: "Bất động sản mới đăng",
						location: "Hà Nội",
						list: result
					})
				}
				console.log("HouseService.findRencentAds: " + result.length);
				console.log(result);
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
