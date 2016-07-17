angular.module('bds').directive('bdsProfileLeft', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {},
        terminal: true,
        templateUrl: "/web/common/directives/bds-profile-left.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
                var vm = this;                
                
            }
        ],
        controllerAs: "pl"
    };
    return def;
}]);