angular.module('bds').directive('bdsMobileMenu', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {},
        terminal: true,
        templateUrl: "/web/common/directives/bdsMobileMenuTemplate.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
                var vm = this;                                
                vm.gotoSearchPage = function(event){
                   $state.go('search', {"place":"ChIJoRyG2ZurNTERqRfKcnt_iOc", "loaiTin" : 0, "loaiNhaDat" : 1, "viewMode": "list"}, {location: true});

                }
                vm.showLogin = function(event){
                    $('#box-login').fadeIn(500);
                    window.loca
                }
                vm.gotoHomePage = function(event){
                    $state.go('home', { }, {location: true});
                }
                vm.gotoRelandApp = function(event){

                }
                vm.profile = function(){
                    $state.go('profile', { userID: $rootScope.user.userID}, {location: true});
                }
            }
        ],
        controllerAs: "mmn"
    };
    return def;
}]);