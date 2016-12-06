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
            console.log("-----------------------------utils.autoComplete-------------------");
          ul.addClass('relandAuto');
          ul.css("max-height","200 px !important;");
          if(item.location == true || item.lastSearchSeparator == true){
            return $('<li disabled class="ui-autocomplete-category">' + item.description + '</li>').appendTo( ul );
          }else {
            return $( "<li class='ui-menu-item'>")
            .append('<i class="' + item.class + '"></i>' + item.description + (item.subDescription?('<span class="ui-menu-item-wrapper">' + item.subDescription + '</span>'):'') + '</li>')
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
      
    },
    getGeoCodePostGet: function(lat, lng,callback) {
        var latlng = new google.maps.LatLng(lat, lng);
        // This is making the Geocode request
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
                alert(status);
            }
            // This is checking to see if the Geoeode Status is OK before proceeding
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results);
            }
        });
    },
    placeAutoCompletePost: function(callback, inputTagId, source){
        console.log("-------------placeAutoComplete----------");
        var sourceP;
        $( "#" + inputTagId ).autocomplete({
                minLength: 0,
                source: sourceP,
                focus: function( event, ui ) {
                    console.log("-------------placeAutoComplete------2----");
                    if(ui.item.lastSearchSeparator == true){
                        event.preventDefault();
                    }else{
                        $( "#" + inputTagId ).val( ui.item.description );
                        return false;
                    }
                },
                _create: function() {
                    console.log("-------------placeAutoComplete------3----");
                    this._super();
                    this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
                },
                select: function( event, ui ) {
                    console.log("-------------placeAutoComplete------4----");
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
            console.log("-------------placeAutoComplete------5----");
            ul.addClass('relandAutoOne relandMaps');            
            return $( "<li>")
                .append("<p><i class='iconLocation gray'></i>" + item.description + "</span></p></li>")
                .appendTo( ul );
        };
    },
    getPaymentPerMonth: function(totalPrincipal, numOfMonth, interestRatePerYear){
      let pricipalPerMonth = totalPrincipal/numOfMonth;
      let totalInterest = interestRatePerYear * totalPrincipal;
      let interestPerMonth = totalInterest/12;

      return {
        payment: pricipalPerMonth,
        interest: interestPerMonth,
        sumOfPayment: pricipalPerMonth + interestPerMonth
      }
    }
    

  };
});
})();
