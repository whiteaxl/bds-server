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
			        		$scope.markers = [];
			        		var current_bounds = map.getBounds();
			        		$scope.map.center = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() }
			        		if(place.geometry.viewport){
			        			map.fitBounds(place.geometry.viewport);	
			        		} else if( !current_bounds.contains( place.geometry.location ) ){
			        			var new_bounds = current_bounds.extend(place.geometry.location);
			        			map.fitBounds(new_bounds);
			        		}
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
		}

	}
})(jQuery);