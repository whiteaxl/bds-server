(function () {
  'use strict';
  angular
  .module('bds')
  .factory('HouseService', function($http, $q, $rootScope){
    var urlPath = '/api/ads/getAllAds';
    return {
      getAllAds: function(){
        console.log("Get all Ads");
        //return $http.get(urlPath);
        var deferred = $q.defer()
        deferred.resolve({data: window.testData});
        return deferred.promise;
      },
      createHouse: function(desc,email,seller){
        return $http.post(urlPath + 'create'); 
      },
      findAdsSpatial: function(data){
        var url = "/api/find";
        //var url = "/api/search";
        return $http.post(url,data);
      },
      //Nhannc
      findRencentAds: function(data){
        var url = "/api/findRecent";
        return $http.post(url,data);
      },
      findBelowPriceAds: function(data){
        var url = "/api/findBelowPrice";
        return $http.post(url,data);
      },
      //End Nhannc
      findGooglePlaceById: function(googlePlaceId){
        return $http.post("/api/findGooglePlaceById",{'googlePlaceId':googlePlaceId});
      }
    };
  });
})();
