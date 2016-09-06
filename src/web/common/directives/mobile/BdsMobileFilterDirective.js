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
                vm.initialized = false;
                $scope.searchData = {};
                //Object.assign($scope.searchData,$rootScope.searchData);
                _.assign($scope.searchData,$rootScope.searchData);

                vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
                vm.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;

                vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);

                vm.sellPrices  =[                    
                    {
                        value: 0.5,
                        lable: "500 triệu"
                    },
                    {
                        value: 0.8,
                        lable: "800 triệu"
                    },
                    {
                        value: 1,
                        lable: "1 tỷ"
                    },
                    {
                        value: 2,
                        lable: "2 tỷ"
                    },
                    {
                        value: 3,
                        lable: "3 tỷ"
                    },
                    {
                        value: 5,
                        lable: "5 tỷ"
                    },
                    {
                        value: 7,
                        lable: "7 tỷ"
                    },
                    {
                        value: 10,
                        lable: "10 tỷ"
                    },
                    {
                        value: 20,
                        lable: "20 tỷ"
                    },
                    {
                        value: 30,
                        lable: "30 tỷ"
                    }
                ];

                vm.rentPrices  =[                    
                    {
                        value: 1,
                        lable: "1 triệu"
                    },
                    {
                        value: 3,
                        lable: "3 triệu"
                    },
                    {
                        value: 5,
                        lable: "5 triệu"
                    },
                    {
                        value: 10,
                        lable: "10 triệu"
                    },
                    {
                        value: 20,
                        lable: "20 triệu"
                    },
                    {
                        value: 40,
                        lable: "40 triệu"
                    },
                    {
                        value: 70,
                        lable: "70 triệu"
                    },
                    {
                        value: 100,
                        lable: "100 triệu"
                    }
                ];

                vm.selectLoaiTin = function(loaiTin){
                    $scope.searchData.loaiTin = loaiTin;
                    if($scope.searchData.loaiTin==0){
                        vm.loaiNhaDat = vm.loaiNhaDatBan;
                        vm.prices = vm.sellPrices;
                    }else{
                        vm.loaiNhaDat = vm.loaiNhaDatThue;
                        vm.prices = vm.rentPrices;
                    }                   
                }
                vm.selectLoaiTin($scope.searchData.loaiTin);
                
                vm.selectLoaiNhaDat = function(lnd){
                    $scope.searchData.loaiNhaDat = lnd.value;
                }
                vm.selectHuongNha = function(hn){
                    $scope.searchData.huongNha = hn.value;

                }


                vm.setSearchDataSpn = function(val){
                    $scope.searchData.soPhongNguGREATER = val;
                }
                 vm.setSearchDataSpt = function(val){
                    $scope.searchData.soPhongTamGREATER = val;
                }
                vm.selectPlaceCallback = function(place){
                    $rootScope.searchData.place = place;
                }
                vm.setSearchDataGia = function(event, index){
                    var value = event.target;
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
                    me = $(me).closest('a')
                    if(me.parent().find($(box)).hasClass(item)) {
                        me.parent().find($(box)).removeClass(item);
                        me.find("i").addClass("iconUpOpen").removeClass("iconDownOpen");
                    }
                    else {
                        me.parent().find($(box)).addClass(item);
                        me.find("i").addClass("iconDownOpen").removeClass("iconUpOpen");
                    }
                }
                
                vm.gotoSearchPage = function(event){
                    //$state.go('msearch', { "place" : 'ChIJoRyG2ZurNTERqRfKcnt_iOc', "loaiTin" : 0, "loaiNhaDat" : 0 ,"viewMode": "list"}, {location: true});
                    if(!vm.place)
                        vm.place = {place_id: "ChIJoRyG2ZurNTERqRfKcnt_iOc"};
                    // $state.transitionTo("msearch", { "place" : vm.place.place_id, "loaiTin" : 0, "loaiNhaDat" : 0 ,"query": $scope.searchData, "viewMode": "list"}, {
                    //     reload: true,
                    //     inherit: false,
                    //     notify: true
                    // });
                    $state.go("msearch", { "place" : vm.place.place_id, "loaiTin" : 0, "loaiNhaDat" : 0 ,"query": $scope.searchData, "viewMode": "list"});
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

                var setDrumValues = function(select, value){
                    var options = select[0].options;                    
                    if(value>100000){
                         select.drum('setIndex', 1); 
                    }else{
                        for(var i =0;i<options.length;i++){
                            if(options[i].value==value){
                                select.drum('setIndex', i); 
                                break;
                            }
                        }
                    }
                    
                }
                vm.showFrequentSearch = false;
                vm.keyPress = function(event){
                    vm.showFrequentSearch = false;
                }

                vm.init = function(){
                    $("#typeBox .type-list li a").click(function(){
                        $(".type-box .collapse-title span label").html($(this).html());
                    });
                    $("#trendBox .type-list li a").click(function(){
                        $(".trend-box .collapse-title span label").html($(this).html());
                    });
                    Hammer.plugins.fakeMultitouch();
                    $("select.drum").drum({
                        onChange : function (selected) {
                            //if (selected.value !=0) 
                            $("#" + selected.id + "_value").html($("#"+selected.id+" option:selected").text());
                            if(selected.id =="prices1"){
                                $scope.searchData.giaBETWEEN[0] = selected.value*1000;
                            }else if(selected.id =="prices2"){
                                $scope.searchData.giaBETWEEN[1] = selected.value *1000;
                            }else if(selected.id =="area1"){
                                $scope.searchData.dienTichBETWEEN[0] = selected.value ;
                            }else if(selected.id =="area2"){
                                $scope.searchData.dienTichBETWEEN[1] = selected.value;
                            }else if(selected.id=="datepost"){
                                $scope.searchData.ngayDaDang = selected.value;
                            }
                        }
                    });
                    //set price drum
                    var prices1 = $scope.searchData.giaBETWEEN[0]/1000;
                    var prices1Elm = $("#price_" + $scope.searchData.loaiTin + " select#prices1");
                    setDrumValues(prices1Elm, prices1);
                    
                    var prices2 = $scope.searchData.giaBETWEEN[1]/1000;
                    var prices2Elm = $("#price_" + $scope.searchData.loaiTin + " select#prices2");
                    setDrumValues(prices2Elm,prices2);

                    var area1 = $scope.searchData.dienTichBETWEEN[0];
                    var area1Elm = $("select#area1");
                    setDrumValues(area1Elm,area1);

                    var area2 = $scope.searchData.dienTichBETWEEN[1];
                    var area2Elm = $("select#area2");
                    setDrumValues(area2Elm,area2);

                    var datepost = $scope.searchData.ngayDaDang;
                    var datepostElm = $("select#datepost");
                    setDrumValues(datepostElm,datepost);                    


                }
                $timeout(function() {
                   vm.init();
                   vm.initialized = true;
                },0);
                
                
            }
        ],
        controllerAs: "mf"
    };
    return def;
}]);