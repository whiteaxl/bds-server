(function () {
    'use strict';
    angular.module('bds').factory('NewsService',function ($http, $q, $rootScope) {
        return{
            countNews: function(data){
                var url = "/api/countNews";
                return $http.post(url,data);
            },
            findNews: function(data){
                var url = '/api/findNews';
                return $http.post(url,data);
            },
            findNewsDetail: function(data){
                var url = '/api/findNewsDetail';
                return $http.post(url,data);
            },
            findRootCategory: function(data){
                var url = '/api/findRootCategory';
                return $http.post(url,data);
            }
        };
    })
})();
