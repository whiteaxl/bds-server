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
                    vm.hideMenuLeft();
                   $state.go('mhome', { }, {location: true});
                   $(".overlay").click();
                }
                vm.showLogin = function(event){
                    //$('#loginBox').fadeIn(500);
                    //window.loca
                }
                vm.loginProfile = function(){
                    if($rootScope.isLoggedIn()){
                        $rootScope.showProfile(true);
                        vm.hideMenuLeft();                        
                    }else{
                        $('#loginBox').modal('show');
                    }
                }
                vm.gotoSearchPage = function(event){
                    console.log("-------vao msearch");
                    $state.go('msearch', { "place" : 'ChIJoRyG2ZurNTERqRfKcnt_iOc', "loaiTin" : 0, "loaiNhaDat" : 0 ,"viewMode": "list"}, {location: true});
                    $(".overlay").click();
                }
                //nhannc
                vm.hideMenuLeft = function(){
                    $(".overlay").hide();
                    $(".nav_mobile").find("i").removeClass("iconLeftOpen").addClass("iconMenu");
                    $("body").removeClass("bodyNavShow").removeAttr("style");
                    $("nav.main").removeAttr("style");
                }

                vm.gotoChatPage = function(){
                    console.log("-------vao mchats");
                    if($scope.$parent.mhc)
                        $scope.$parent.mhc.doneSearch = true;
                    vm.hideMenuLeft();
                    if($rootScope.isLoggedIn()==false){
                        $scope.$bus.publish({
                            channel: 'login',
                            topic: 'show login',
                            data: {label: "Đăng nhập để đăng tin"}
                        });
                        return true;
                    }
                    $state.go('mchats', { }, {location: true});
                    $(".overlay").click();
                }
                
                vm.gotoDangTinPage = function(event){
                    console.log("-------vao mpost");
                    if($scope.$parent.mhc)
                        $scope.$parent.mhc.doneSearch = true;
                    vm.hideMenuLeft();
                    if($rootScope.isLoggedIn()==false){
                        $scope.$bus.publish({
                            channel: 'login',
                            topic: 'show login',
                            data: {label: "Đăng nhập để đăng tin"}
                        });
                        return true;
                    }
                    $state.go('mpost', { }, {location: true});
                    $(".overlay").click();
                }
                vm.gotoQuanLyDangTin = function(event){
                    console.log("-------vao madsMgmt");
                    if($scope.$parent.mhc)
                        $scope.$parent.mhc.doneSearch = true;
                    vm.hideMenuLeft();
                    if($rootScope.isLoggedIn()==false){
                        $scope.$bus.publish({
                            channel: 'login',
                            topic: 'show login',
                            data: {label: "Đăng nhập để truy cập quản lý tin đăng"}
                        });
                        return true;
                    }
                    $state.go('madsMgmt', { }, {location: true});
                    $(".overlay").click();
                }
                //nhannc end
                vm.showFilter = function(){
                    if($scope.$parent.mhc)
                        $scope.$parent.mhc.doneSearch = true;
                    $rootScope.bdsData.filterShowAct = true;
                    $scope.$bus.publish({
                        channel: 'search',
                        topic: 'show search',
                        data: null
                    });
                    $(".overlay").click();
                }
                vm.gotoRelandApp = function(event){

                }
                vm.profile = function(){
                    $state.go('profile', { userID: $rootScope.user.userID}, {location: true});
                }
                vm.signout = function(){
                    $localStorage.relandToken = undefined;
                    // $rootScope.user.userName = undefined;
                    $rootScope.user = {
                      userID: undefined,
                      adsLikes: [],
                      lastSearch: null,
                      autoSearch: false
                    } 
                    $scope.$bus.publish({
                      channel: 'login',
                      topic: 'logged out',
                      data: {}
                    });


                    socket.emit('user leave',{email: $rootScope.user.userEmail, userID:  $rootScope.user.userID, sessionID: $localStorage.relandToken, username : $rootScope.user.userName, userAvatar : undefined},function(data){
                        console.log("disconect socket user " + $rootScope.user.userName);
                    });
                    $(".overlay").click();
                }
            }
        ],
        controllerAs: "mmn"
    };
    return def;
}]);