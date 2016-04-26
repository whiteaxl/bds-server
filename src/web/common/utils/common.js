window.RewayClientUtils = (function($) {
	'use strict';
	return {
		createPlaceAutoComplete: function($scope, inputTagId, maps){
			$( "#" + inputTagId ).autocomplete({
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
			           	if(predictions){
			           		for (var i = 0, prediction; prediction = predictions[i]; i++) {
			           			results.push(
			           			{
			           				description: prediction.description,
			           				types:  	prediction.types, 
			           				place_id: 	prediction.place_id
			           			}
			           			);
			           		}	
			           	}
			           	
			           	response(results);
			           }
			           var service = new maps.places.AutocompleteService();
			           service.getPlacePredictions(options, callback);
			           var results = [];
			       },
			       focus: function( event, ui ) {
			       	$( "#" + inputTagId ).val( ui.item.description );
			       	return false;
			       },
			       select: function( event, ui ) {
			       	$( "#" + inputTagId ).val( ui.item.description );
			        // $( "#project-id" ).val( ui.item.value );
			        // $( "#project-description" ).html( ui.item.desc );
			        // $( "#project-icon" ).attr( "src", "images/" + ui.item.icon );
			        //alert(ui.item.place_id);
			        var map = $scope.map.control.getGMap();
			        var service = new maps.places.PlacesService(map);

			        service.getDetails({
			        	placeId: ui.item.place_id
			        }, function(place, status) {
			        	if (status === maps.places.PlacesServiceStatus.OK) {
			        		$scope.searchPlaceSelected = place;
			        		$scope.placeId = place.place_id;
			        		$scope.markers = [];
			        		var current_bounds = map.getBounds();
			        		$scope.map.center = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() }
			        		$scope.map.zoom = 15;
			        		var marker = {
			        				id: -1,
			        				coords: {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()},
			        				data: 'test'
			        		}
			        		$scope.markers.push(marker);
			        		/*$scope.map.bounds = {
			        			northeast: {
			        				latitude: place.geometry.viewport["O"]["O"],
									longitude: place.geometry.viewport["j"]["j"]
			        			},
								southwest: {
									latitude: place.geometry.viewport["O"]["O"],
									longitude: place.geometry.viewport["j"]["j"]
								}
			        			
			        		}*/
			        		//place.geometry.viewport;
			        		$scope.map.fit = false;
			        		$scope.$apply();
			        		/*$scope.map.control.refresh({latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() });
			        		if(place.geometry.viewport){
			        			//$scope.map.zoom = 15;
			        			//map.fitBounds(place.geometry.viewport);	
			        			return;
			        		} else {//if( !current_bounds.contains( place.geometry.location ) ){
			        			
			        			
			        			//$scope.markers.push(marker);
			        			//$scope.map.control.refresh({latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() });
			        			return;

			        			var p = map.getProjection();
			        			if (p) {
			        				var el = $(map.getDiv());
			        				var zf = Math.pow(2, $scope.map.zoom)*2;
			        				var dw = (el.width()  | 0) / zf;
			        				var dh = (el.height() | 0) / zf;
			        				var cpx = p.fromLatLngToPoint(place.geometry.location);
			        				map.fitBounds(new maps.LatLngBounds(
			        				 	p.fromPointToLatLng(new maps.Point(cpx.x - dw, cpx.y + dh)),
			        				 	p.fromPointToLatLng(new maps.Point(cpx.x + dw, cpx.y - dh))));  
			        			}

			        			$scope.map.fit = false;
								
			        		}
			        		$scope.$apply();
			        		$scope.map.control.refresh();*/
			        	}
			        });
			        return false;
			    }
			})
			.autocomplete( "instance" )._renderItem = function( ul, item ) {
				return $( "<li class='googlemap'>")
				.append( "<span>" + item.description +  "<span style='float: right;'>" + window.RewayPlaceUtil.getTypeName(item) + "</span></span>" )
				.appendTo( ul );
			};
		},
		getBoundsAtLatLngWithZoom: function(maps,map, center, zoom) {

		}

	}
})(jQuery);