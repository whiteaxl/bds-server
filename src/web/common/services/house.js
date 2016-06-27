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
        // var url = "/api/search";
        return $http.post(url,data);
      },
      countAds: function(data){
        //var url = "/api/find";
        var url = "/api/count";
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
      saveSearch: function(data){
        var url = "/api/saveSearch";
        return $http.post(url,data);
      },
      //End Nhannc
      checkUserExist: function(data){
        var url = "/api/checkUserExist";
        return $http.post(url,data);
      },
      detailAds: function(data){
        var url = "/api/detail";
        return $http.post(url,data);
      },
      likeAds: function(data){
        var url = "/api/likeAds";
        return $http.post(url,data);
      },
      findGooglePlaceById: function(googlePlaceId){
        return $http.post("/api/findGooglePlaceById",{'googlePlaceId':googlePlaceId});
      },
      login: function(data){
        var url = "/api/login";
        return $http.post(url,data);
      },
      signup: function(data){
        var url = "/api/signup";
        return $http.post(url,data);
      },
      requestInfo: function(data){
        return $http.post("/api/requestInfo",data);
      },
      forgotPassword: function(data){
        return $http.post("/api/forgotPassword",data);
      },
      resetPassword: function(data){
        return $http.post("/api/resetPassword",data);
      },
      profile: function(data){
        return $http.post("/api/profile",data);
      },
      updateProfile: function(data){
        return $http.post("/api/updateProfile",data);
      }

    };
  });
})();
