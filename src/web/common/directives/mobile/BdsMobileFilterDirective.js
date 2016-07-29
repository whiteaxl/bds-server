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
                vm.searchData = {
                    spn: "0"
                }

                vm.setSearchDataSpn = function(val){
                    vm.searchData.spn = val;
                }
                 vm.setSearchDataSpt = function(val){
                    vm.searchData.spt = val;
                }


                NgMap.getMap().then(function(map){
                    // $scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
                    window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"searchadd",map);
                    $scope.PlacesService =  new google.maps.places.PlacesService(map);
                    if($scope.placeId){
                        $scope.PlacesService.getDetails({
                            placeId: $scope.placeId
                        }, function(place, status) {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                $scope.searchPlaceSelected = place;
                                //var map = $scope.map.control.getGMap();
                                var current_bounds = map.getBounds();
                                //$scope.map.center =  
                                vm.center = "["+place.geometry.location.lat() +"," +place.geometry.location.lng() +"]";
                                if(place.geometry.viewport){
                                    //map.fitBounds(place.geometry.viewport);   
                                    //$scope.map
                                } else if( !current_bounds.contains( place.geometry.location ) ){
                                    //var new_bounds = current_bounds.extend(place.geometry.location);
                                    //map.fitBounds(new_bounds);
                                    //$digest();
                                }
                                $scope.$apply();
                                //vm.search();
                            }
                        });
                    }
                    

                });


                vm.searchPage = function(i, callback){
                    vm.searchData.pageNo = i;       
                    if(vm.searchData.place)
                        vm.searchData.place.radiusInKm = vm.searchData.radiusInKm;  
                    vm.searchData.userID = $rootScope.user.userID;
                    vm.searchData.giaBETWEEN[0] = vm.searchData.khoangGia.value.min;
                    vm.searchData.giaBETWEEN[1] = vm.searchData.khoangGia.value.max;
                    vm.searchData.dienTichBETWEEN[0] = vm.searchData.khoangDienTich.value.min;
                    vm.searchData.dienTichBETWEEN[1] = vm.searchData.khoangDienTich.value.max;

                    // vm.khoangGiaList[]
                    // vm.searchData.khoangGia
                    HouseService.findAdsSpatial(vm.searchData).then(function(res){
                        var result = res.data.list;
                        //vm.totalResultCounts = res.data.list.length;
                        
                        for (var i = 0; i < result.length; i++) { 
                            var ads = result[i];
                            ads.giaFmt = ads.giaFmtForWeb;

                            if($rootScope.alreadyLike(ads.adsID) ==  true)
                                ads.liked =true;
                            var length = result.length;
                            var fn = function() {
                                if(i < length) {
                                    vm.updateStreetview(result[i], fn);
                                }
                            };
                            fn();

                            result[i].index = i;
                            if(ads.huongNha){
                                ads.huongNha =  window.RewayListValue.getHuongNhaDisplay(ads.huongNha);
                            }else{
                                ads.huongNha = "";  
                            }
                            if(result[i].place){
                                if(result[i].place.geo){
                                    result[i].map={
                                        center: {
                                            latitude:   result[i].place.geo.lat,
                                            longitude:  result[i].place.geo.lon
                                        },
                                        marker: {
                                            id: i,
                                            coords: {
                                                latitude:   result[i].place.geo.lat,
                                                longitude:  result[i].place.geo.lon
                                            },
                                            content: result[i].giaFmt,
                                            data: 'test'
                                        },
                                        options:{
                                            scrollwheel: false
                                        },
                                        zoom: 14    
                                    }
                                            
                                }
                            }
                            
                        }
                        vm.ads_list = res.data.list;
                        $scope.markers = [];
                        for(var i = 0; i < res.data.list.length; i++) { 
                            var ads = res.data.list[i];
                            if(res.data.list[i].map)
                                $scope.markers.push(res.data.list[i].map.marker);
                        }
                        /*if(vm.ads_list.length==0){
                            vm.zoomMode = "false";
                        }else{
                            vm.zoomMode = "auto";
                        }*/

                        vm.currentPageStart = vm.pageSize*(vm.searchData.pageNo-1) + 1
                        vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
                        vm.currentPage = vm.searchData.pageNo;
                        
                        $timeout(function() {
                            $('body').scrollTop(0);
                        },0);
                        
                        if($rootScope.isLoggedIn()){
                            $rootScope.user.lastSearch = vm.searchData;
                        }
                        
                        if(vm.ads_list && vm.ads_list.length>0){                    
                            if(vm.diaChinh)
                                HouseService.findDuAnHotByDiaChinhForSearchPage({diaChinh: vm.diaChinh}).then(function(res){
                                    if(res.data.success==true)
                                        vm.duAnNoiBat = res.data.duAnNoiBat;
                                });
                        }

                        if(callback)
                            callback();
                    });
                }


                vm.gotoHomePage = function(event){
                   $state.go('mhome', { }, {location: true});
                   $(".overlay").click();
                }
                vm.showLogin = function(event){
                    $('#box-login').fadeIn(500);
                    //window.loca
                }
                vm.search = function(){
                    //HouseService.
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