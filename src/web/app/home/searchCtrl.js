(function() {
	'use strict';
	var controllerId = 'SearchCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,uiGmapGoogleMapApi,$window){
		var vm = this;
		init();
		vm.placeId = $state.params.place;
		if(!vm.placeId)
			vm.placeId = 'ChIJoRyG2ZurNTERqRfKcnt_iOc';
		HouseService.findGooglePlaceById(vm.placeId).then(function(response){
			var place = response.data.result;
			$scope.searchPlaceSelected = place;
			vm.search();
		});
		

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
				$( "#autocomplete" ).autocomplete({
			      minLength: 0,
			      source: function (request, response) {
			           var options = {
			               input: request.term,
			               //types: ['(cities)'],
			               //region: 'US',
			               componentRestrictions: { country: "vn" }
			           };
			           function callback(predictions, status) {
			           		var results = [];
			               for (var i = 0, prediction; prediction = predictions[i]; i++) {
			                   results.push(
				                   {
				                   		description: prediction.description,
				                   		types:  		prediction.types, 
				                   }
			                   );
			               }
			               response(results);
			           }
			           var service = new maps.places.AutocompleteService();
			           service.getPlacePredictions(options, callback);
			           var results = [];
			      },
			      focus: function( event, ui ) {
			        $( "#autocomplete" ).val( ui.item.description );
			        return false;
			      },
			      select: function( event, ui ) {
			        $( "#autocomplete" ).val( ui.item.description );
			        // $( "#project-id" ).val( ui.item.value );
			        // $( "#project-description" ).html( ui.item.desc );
			        // $( "#project-icon" ).attr( "src", "images/" + ui.item.icon );
			 
			        return false;
			      }
			    })
			    .autocomplete( "instance" )._renderItem = function( ul, item ) {
			      return $( "<li class='googlemap'>")
			        .append( "<span>" + item.description +  "<span style='float: right;'>" + window.RewayPlaceUtil.getTypeName(item) + "</span></span>" )
			        .appendTo( ul );
			    };
			})
			
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
		

	});

})();
