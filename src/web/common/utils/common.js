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

		},
		isSameDate: function(date1,date2){
			if(date1 && date2){
				console.log(date1.getYear() + "/" + date1.getMonth() + "/" + date1.getDate());
				console.log(date2.getYear() + "/" + date2.getMonth() + "/" + date2.getDate());
				return date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth()
					&& date1.getDate() == date2.getDate();
			}
			return false;
		},
		addChatMessage: function(chatbox,msg){
			var messages = chatbox.messages;
			if(messages.length>0){
				var lastDate = messages[messages.length-1].date;
				msg.showDate = lastDate && msg.date && !this.isSameDate(lastDate,msg.date);
			}else{
				msg.showDate = true;
				msg.date = new Date(msg.date);
				msg.dateDisplay = this.formatDateWeekDay(msg.date);
			}
			messages.push(msg);
		},
		formatDateWeekDay: function(date){
			if(date){
				var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
				var day = days[ date.getDay() ];
				var month = months[ date.getMonth() ];
				return day + " " + month + " " + date.getFullYear();
			}
			return "";
		}



	}
})(jQuery);