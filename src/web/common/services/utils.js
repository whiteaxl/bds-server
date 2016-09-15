(function () {
  'use strict';
  angular
  .module('bds')
  .factory('RewayCommonUtil', function($http, $q, $rootScope){
    return {
      placeAutoComplete: function(callback, inputTagId, source){
        // $http.post("api/place/autocomplete",data);
        var sourceP = function(request,response){
          var results = [];
          $http.get("/api/place/autocomplete?input=" + request.term).then(function(res){
            var predictions = res.data.predictions; 
            if(res.status == '200'){
              for (var i = 0, prediction; prediction = predictions[i]; i++) {
                results.push(
                {
                  description: prediction.fullName,
                  types:    prediction.placeType, 
                  viewPort:   prediction.viewPort,
                  placeId: prediction.placeId,
                  tinh: prediction.tinh,
                  huyen: prediction.huyen,
                  xa: prediction.xa,
                  class: "iconLocation gray"

                }
                );
              } 
            }
            response(results);
          });
        };
        if(source)
          sourceP = source;
        $( "#" + inputTagId ).autocomplete({
          minLength: 0,
          source: sourceP,
          focus: function( event, ui ) {
            $( "#" + inputTagId ).val( ui.item.description );
            return false;
          },
          select: function( event, ui ) {
            $( "#" + inputTagId ).val( ui.item.description );
              callback(ui.item);
              return false;
            }
          })
        .autocomplete( "instance" )._renderItem = function( ul, item ) {
          ul.addClass('relandAutoOne');
          return $( "<li class='googlemap'>")
          .append("<p><i class='" + item.class + "'></i>" + item.description + "<span>" + window.RewayPlaceUtil.getTypeName(item) + "</span></p>")
        .appendTo( ul );
      };
    }      
  };
});
})();
