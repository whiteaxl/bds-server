(function() {
	'use strict';
	var controllerId = 'SearchCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,uiGmapGoogleMapApi,uiGmapIsReady,$window){
		var vm = this;
		vm.placeId = $state.params.place;
		if(!vm.placeId)
			vm.placeId = 'ChIJoRyG2ZurNTERqRfKcnt_iOc';
		init();
		/*HouseService.findGooglePlaceById(vm.placeId).then(function(response){
			var place = response.data.result;
			$scope.searchPlaceSelected = place;
			vm.search();
		});*/
		

		$scope.$on('$viewContentLoaded', function(){
			window.DesignCommon.adjustPage();
			if($state.current.data)
				$scope.bodyClass = $state.current.data.bodyClass
		});
  		
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
			/*for(var i = 0; i < $scope.ads_list.length; i++) { 
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
			}*/

		}
		

	});

})();
