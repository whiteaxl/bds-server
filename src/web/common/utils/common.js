window.RewayClientUtils = (function($) {
	'use strict';
	 var div_icon = {
            type: 'div',
            iconSize: [230, 0],
            html: 'Using <strong>Bold text as an icon</strong>: Lisbon',
            popupAnchor:  [0, 0]
    };
	return {
		createPlaceAutoComplete: function(callback, inputTagId, map){
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
			           var service = new google.maps.places.AutocompleteService();
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
			        //var map = $scope.map.control.getGMap();
			        var service = new google.maps.places.PlacesService(map);

			        service.getDetails({
			        	placeId: ui.item.place_id
			        }, function(place, status) {
			        	if (status === google.maps.places.PlacesServiceStatus.OK) {
			        		callback(place);
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