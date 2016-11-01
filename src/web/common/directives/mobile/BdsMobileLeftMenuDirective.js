angular.module('bds').directive('bdsMobileLeftMenu', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {},
        terminal: true,
        templateUrl: "/web/common/directives/mobile/bds-mobile-left-menu.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
                var vm = this;                                
                vm.gotoHomePage = function(event){
                   $state.go('mhome', { }, {location: true});
                   $(".overlay").click();
                }
                vm.showLogin = function(event){
                    //$('#loginBox').fadeIn(500);
                    //window.loca
                }
                
                vm.gotoSearchPage = function(event){
                    console.log("-------vao msearch");
                    $state.go('msearch', { "place" : 'ChIJoRyG2ZurNTERqRfKcnt_iOc', "loaiTin" : 0, "loaiNhaDat" : 0 ,"viewMode": "list"}, {location: true});
                    $(".overlay").click();
                }
                //nhannc
                vm.gotoDangTinPage = function(event){
                    console.log("-------vao mpost");
                    $state.go('mpost');
                    $(".overlay").click();
                }
                //nhannc end
                vm.gotoRelandApp = function(event){

                }
                vm.profile = function(){
                    $state.go('profile', { userID: $rootScope.user.userID}, {location: true});
                }
                vm.signout = function(){
                    $localStorage.relandToken = undefined;
                    $rootScope.user.userName = undefined;
                    $scope.$bus.publish({
                      channel: 'login',
                      topic: 'logged out',
                      data: {}
                    });
                    socket.emit('user leave',{email: $rootScope.user.userEmail, userID:  $rootScope.user.userID, username : $rootScope.user.userName, userAvatar : undefined},function(data){
                        console.log("disconect socket user " + $rootScope.user.userName);
                    });

                }
            }
        ],
        controllerAs: "mmn"
    };
    return def;
}]);