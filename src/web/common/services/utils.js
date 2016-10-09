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

        // $.widget( "custom.catcomplete", $.ui.autocomplete, {
        //   _create: function() {
        //   this._super();
        //   this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
        //   },
        //   _renderMenu: function( ul, items ) {
        //   var that = this,
        //     currentCategory = "";
        //   ul.addClass('relandAuto');
        //   $.each( items, function( index, item ) {
        //     var li;
        //     if ( item.category != currentCategory ) {
        //     ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
        //     currentCategory = item.category;
        //     }
        //     li = that._renderItemData( ul, item );
        //     if ( item.category ) {
        //     li.html("<i class='" + item.labelicon + "'></i>" + item.label + "<span>" + item.labeldes + "</span>");
        //     }
        //   });
        //   }
        // });

        // $( "#" + inputTagId).catcomplete({
        //   delay:0 ,
        //   source: sourceP
        // });
        $( "#" + inputTagId ).autocomplete({
          minLength: 0,
          source: sourceP,
          focus: function( event, ui ) {
            if(ui.item.lastSearchSeparator == true){                
                event.preventDefault();
            }else{
              $( "#" + inputTagId ).val( ui.item.description );
              return false;  
            }            
          },
          _create: function() {
            this._super();
            this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
          },
          select: function( event, ui ) {
              if(ui.item.lastSearchSeparator == true){                
                event.preventDefault();
              }else{
                $( "#" + inputTagId ).val( ui.item.description );
                callback(ui.item);
                return false;  
              }
            }
          })
        .autocomplete( "instance" )._renderItem = function( ul, item ) {
          ul.addClass('relandAuto');
          if(item.location == true || item.lastSearchSeparator == true){
            return $('<li disabled class="ui-autocomplete-category">' + item.description + '</li>').appendTo( ul );
          }else {
            return $( "<li class='ui-menu-item'>")
            .append('<i class="' + item.class + '"></i>' + item.description + '<span class="ui-menu-item-wrapper">' + item.subDescription + '</span></li>')
            .appendTo(ul);
          }
        };
        // .autocomplete( "instance" )._renderMenu = function( ul, items ) {
        //   var that = this,
        //   currentCategory = "";
        //   ul.addClass('relandAuto');
        //   $.each( items, function( index, item ) {
        //     var li;
        //     if ( item.location == true || item.lastSearchSeparator == true ) {
        //       ul.append( "<li class='ui-autocomplete-category'>" + item.description + "</li>" );              
        //       // li = that._renderItemData( ul, item );
        //     }else{
        //       li = that._renderItemData( ul, item );
        //       li.html("<i class='" + item.class + "'></i>" + item.description + "<span>" + item.subDescription + "</span>");
        //     }
            
        //   });
        // };
    }      
  };
});
})();
