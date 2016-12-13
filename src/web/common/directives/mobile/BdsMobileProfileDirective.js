angular.module('bds').directive('bdsMobileProfile', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {
            showProfile: '&'
        },
        terminal: true,
        templateUrl: "/web/common/directives/mobile/bds-mobile-profile.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService','RewayCommonUtil','NgMap',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService,RewayCommonUtil,NgMap) {
                var vm = this;                                                 
            }
        ],
        controllerAs: "mpf"
    };
    return def;
}]);