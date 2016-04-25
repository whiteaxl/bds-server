(function() {
	'use strict';
	var controllerId = 'SearchCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,uiGmapGoogleMapApi,uiGmapIsReady,$window){
		var vm = this;
		vm.placeId = $state.params.place;
		if(!vm.placeId)
			vm.placeId = 'ChIJoRyG2ZurNTERqRfKcnt_iOc';
		init();
		
		vm.sell_price_list = window.RewayListValue.sell_steps;
		vm.sell_dien_tich_list = window.RewayListValue.dientich_steps;
		vm.sortOptions = window.RewayListValue.sortHouseOptions;
		vm.sortBy = 1;
		vm.price_min = "0";
		vm.price_max = window.RewayListValue.filter_max_value.value;
		vm.dien_tich_min = 0;
		vm.dien_tich_max = window.RewayListValue.filter_max_value.value;


		$scope.$on('$viewContentLoaded', function(){
			window.DesignCommon.adjustPage();
			if($state.current.data)
				$scope.bodyClass = $state.current.data.bodyClass
		});
  		
		vm.search = function(param){
			//alert(param);
			var data = {
			  "loaiTin": 0,
			  "giaBETWEEN": [vm.price_min,vm.price_max],
			  "soPhongNguGREATER": 0,
			  "soTangGREATER": 0,
			  "dienTichBETWEEN": [vm.dien_tich_min,vm.dien_tich_max],
			  //"geoBox": [ 105.8411264, 20.9910223, 105.8829904, 21.022562 ],
			  "limit": 200,
			  "radiusInKm": 0.5
			};
			var googlePlace = $scope.searchPlaceSelected;
			if($scope.searchPlaceSelected.geometry.viewport){
          		console.log("Tim ads for Tinh Huyen Xa: " + googlePlace.formatted_address);
          		data.geoBox = [googlePlace.geometry.viewport.getSouthWest().lng(),googlePlace.geometry.viewport.getSouthWest().lat(),googlePlace.geometry.viewport.getNorthEast().lng(),googlePlace.geometry.viewport.getNorthEast().lat()]
        	} else{
          		console.log("Tim ads for dia diem: " + googlePlace.formatted_address);
          		data.radiusInKm = "10";
          		var place = {
          			placeId: googlePlace.place_id,
 	      			relandTypeName : window.RewayPlaceUtil.getTypeName(googlePlace),
       				radiusInKm :  2,
 				    currentLocation: undefined
 			  	}
 			  	data.place = place;
          		data.geoBox = undefined;
        	}

			HouseService.findAdsSpatial(data).then(function(res){
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
				$scope.map.fit = true;
				$scope.map.zoom = 10;
			});
		}
		vm.formatLabel = function(model){
			if(model)
				return model.formatted_address;
		}
		
		var events = {
          places_changed: function (searchBox) {}
        }
        $scope.searchbox = { template:'searchbox.tpl.html', events:events};

		function init(){
			uiGmapGoogleMapApi.then(function(maps){
			 	window.RewayClientUtils.createPlaceAutoComplete($scope,"autocomplete",maps);
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
			$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
			
			$scope.options = {scrollwheel: false,labelContent: 'gia'};
			$scope.markerCount = 3;
			$scope.markers = [];
			$scope.initData = window.initData;
			$scope.hot_ads_cat = window.hot_ads_cat;
			$scope.ads_list = window.testData;
			$scope.bodyClass= "page-home";
		}
		

	});

})();
