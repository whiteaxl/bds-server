angular.module('bds').directive('bdsMobileFilter', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {},
        terminal: true,
        templateUrl: "/web/common/directives/mobile/bds-mobile-filter.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService','NgMap',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService,NgMap) {
                var vm = this; 
                $(".btn-more .collapse-title").click(function() {
                    $(this).parent().hide(), $(".more-box").removeClass("more-box-hide")
                })   
                vm.reset = function(){
                    $(".btn-more").removeAttr("style");
                    $(".more-box").addClass("more-box-hide");
                    $(".spinner").addClass("spinner-hide");
                    $(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
                    $(".btn-group .btn").removeClass("active");
                    $(".btn-group .btn:first-child").addClass("active");
                }
                vm.pageSize = 25;
                /*vm.searchData = {
                    giaBETWEEN: [0,9999999999999],
                    "loaiTin": 0,
                    "loaiNhaDat": 0, 
                    "loaiNhaDats": [],
                    "soPhongNguGREATER": 0,
                    "soPhongTamGREATER": 0,
                    "soTangGREATER": 0,
                    "dienTichBETWEEN": [0,99999999999999],
                    "huongNha": 0,
                    "huongNhas": [],
                    "radiusInKm": 2,
                    "userID": $rootScope.user.userID,
                    //"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
                    "limit": vm.pageSize,
                    "orderBy": 0,
                    "pageNo": 1
                }*/


                vm.setSearchDataSpn = function(val){
                    $rootScope.searchData.soPhongNguGREATER = val;
                }
                 vm.setSearchDataSpt = function(val){
                    $rootScope.searchData.soPhongTamGREATER = val;
                }
                vm.selectPlaceCallback = function(place){
                    $rootScope.searchData.place = place;
                }
                


                


                


                vm.gotoHomePage = function(event){
                   $state.go('mhome', { }, {location: true});
                   $(".overlay").click();
                }
                vm.showLogin = function(event){
                    $('#box-login').fadeIn(500);
                    //window.loca
                }
                
                vm.gotoSearchPage = function(event){
                    $state.go('msearch', { "place" : 'ChIJoRyG2ZurNTERqRfKcnt_iOc', "loaiTin" : 0, "loaiNhaDat" : 0 ,"viewMode": "list"}, {location: true});
                    $(".overlay").click();
                }
                vm.gotoRelandApp = function(event){

                }
                vm.profile = function(){
                    $state.go('profile', { userID: $rootScope.user.userID}, {location: true});
                }
            }
        ],
        controllerAs: "mf"
    };
    return def;
}]);