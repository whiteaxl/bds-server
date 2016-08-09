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

                vm.spinner = function(event, box, item){
                    var me = event.target;
                    if($(me).parent().find($(box)).hasClass(item)) {
                        $(me).parent().find($(box)).removeClass(item);
                        $(me).find("i").addClass("iconUpOpen").removeClass("iconDownOpen");
                    }
                    else {
                        $(me).parent().find($(box)).addClass(item);
                        $(me).find("i").addClass("iconDownOpen").removeClass("iconUpOpen");
                    }
                }
                
                vm.gotoSearchPage = function(event){
                    //$state.go('msearch', { "place" : 'ChIJoRyG2ZurNTERqRfKcnt_iOc', "loaiTin" : 0, "loaiNhaDat" : 0 ,"viewMode": "list"}, {location: true});
                    if(!vm.place)
                        vm.place = {place_id: "ChIJoRyG2ZurNTERqRfKcnt_iOc"};
                    $state.transitionTo("msearch", { "place" : vm.place.place_id, "loaiTin" : 0, "loaiNhaDat" : 0 ,"viewMode": "list"}, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                    $(".overlay").click();
                }
                vm.gotoRelandApp = function(event){

                }
                vm.profile = function(){
                    $state.go('profile', { userID: $rootScope.user.userID}, {location: true});
                }
                vm.selectPlaceCallback = function(place){
                    vm.place = place;
                }

                NgMap.getMap("filtermap").then(function(map){
                    vm.map = map;           
                    window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"searchadd",map);
                    vm.PlacesService =  new google.maps.places.PlacesService(map);                                
                });
                vm.init = function(){
                    Hammer.plugins.fakeMultitouch();
                    $("select.drum").drum({
                        onChange : function (selected) {
                            if (selected.value !=0) $("#" + selected.id + "_value").html($("#"+selected.id+" option:selected").text());
                        } 
                    });

                }
                vm.init();
                
            }
        ],
        controllerAs: "mf"
    };
    return def;
}]);