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
      findAdsSpatial: function(googlePlace){
        var url = "/api/find";
        var data = {
          "loaiTin":0,
          "orderBy":"giaDESC",
          "limit": 200
        }
        if(googlePlace.geometry.bounds){
          console.log("Tim ads for Tinh Huyen Xa: " + googlePlace.formatted_address);
          data.geoBox = [googlePlace.geometry.bounds.southwest.lng,googlePlace.geometry.bounds.southwest.lat,googlePlace.geometry.bounds.northeast.lng,googlePlace.geometry.bounds.northeast.lat]
        } else{
          console.log("Tim ads for dia diem: " + googlePlace.formatted_address);
          data.radiusInKm = "10";
        }

        return $http.post(url,data);
      }
    };
  });
})();
