angular.module('bds').directive('bdsMobileFilter', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {mode: '=mode', searchData: "=searchData"},
        terminal: true,
        templateUrl: "/web/common/directives/mobile/bds-mobile-filter.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService','RewayCommonUtil','NgMap',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService,RewayCommonUtil,NgMap) {
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
                vm.keepViewport = true;
                vm.stateName = $state.current.name;  
                // $scope.searchData = {};
                // //Object.assign($scope.searchData,$rootScope.searchData);
                // _.assign($scope.searchData,$rootScope.searchData);
                // $scope.sd.abc = 'd';

                vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
                vm.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;

                vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
                

                vm.sellPrices  =[                    
                    {
                        value: [0,9999999999999],
                        lable: "Bất kỳ"
                    },
                    {
                        value: [0,500],
                        lable: "<500 triệu"
                    },                    
                    {
                        value: [500,800],
                        lable: "500-800 triệu"
                    },
                    {
                        value: [800,1000],
                        lable: "800 triệu - 1 tỷ"
                    },
                    {
                        value: [1000,2000],
                        lable: "1-2 tỷ"
                    },
                    {
                        value: [2000,3000],
                        lable: "2-3 tỷ"
                    },
                    {
                        value: [3000,5000],
                        lable: "3-5 tỷ"
                    },
                    {
                        value: [5000,7000],
                        lable: "5-7 tỷ"
                    },
                    {
                        value: [7000,10000],
                        lable: "7-10 tỷ"
                    },
                    {
                        value: [10000,20000],
                        lable: "10-20 tỷ"
                    },
                    {
                        value: [20000-30000],
                        lable: "20-30 tỷ"
                    },
                    {
                        value: [30000-99999999999999],
                        lable: ">30 tỷ"
                    }
                ];

                vm.rentPrices  =[
                    {
                        value: [0,9999999999999],
                        lable: "Bất kỳ"
                    },                    
                    {
                        value: [0,1],
                        lable: "<1 triệu"
                    },
                    {
                        value: [1,3],
                        lable: "1-3 triệu"
                    },
                    {
                        value: [3,5],
                        lable: "3-5 triệu"
                    },
                    {
                        value: [5,10],
                        lable: "5-10 triệu"
                    },
                    {
                        value: [10,20],
                        lable: "10-20 triệu"
                    },
                    {
                        value: [20,40],
                        lable: "20-40 triệu"
                    },
                    {
                        value: [40,70],
                        lable: "40-70 triệu"
                    },
                    {
                        value: [70,100],
                        lable: "70-100 triệu"
                    },
                    {
                        value: [100,999999999999],
                        lable: ">100 triệu"
                    }
                ];
                vm.areas = [
                    {
                        value: [0,9999999999999],
                        lable: "Bất kỳ"
                    },                    
                    {
                        value: [0,30],
                        lable: "<30 m2"
                    },                    
                    {
                        value: [30,50],
                        lable: "30-50 m2"
                    },                    
                    {
                        value: [50,80],
                        lable: "50-80 m2"
                    },                    
                    {
                        value: [80,100],
                        lable: "80-100 m2"
                    },                    
                    {
                        value: [100,150],
                        lable: "100-150 m2"
                    },                    
                    {
                        value: [150,200],
                        lable: "150-200 m2"
                    },                    
                    {
                        value: [200,250],
                        lable: "200-250 m2"
                    },                    
                    {
                        value: [250,300],
                        lable: "250-300 m2"
                    },                    
                    {
                        value: [300,500],
                        lable: "300-500 m2"
                    },                    
                    {
                        value: [500,9999999999999999],
                        lable: ">500 m2"
                    }
                ];
                vm.ngayDangTinList = [
                    {
                        value: "19810101",
                        lable: "Bất kỳ"
                    },                    
                    {
                        value: Date.today().add(-1).days().toString('yyyyMMdd'),
                        lable: "1 ngày"
                    },                    
                    {
                        value: Date.today().add(-2).days().toString('yyyyMMdd'),
                        lable: "2 ngày"
                    },                    
                    {
                        value: Date.today().add(-3).days().toString('yyyyMMdd'),
                        lable: "3 ngày"
                    },                    
                    {
                        value: Date.today().add(-5).days().toString('yyyyMMdd'),
                        lable: "5 ngày"
                    },                    
                    {
                        value: Date.today().add(-7).days().toString('yyyyMMdd'),
                        lable: "7 ngày"
                    },                    
                    {
                        value: Date.today().add(-14).days().toString('yyyyMMdd'),
                        lable: "14 ngày"
                    },                    
                    {
                        value: Date.today().add(-30).days().toString('yyyyMMdd'),
                        lable: "30 ngày"
                    },                    
                    {
                        value: Date.today().add(-90).days().toString('yyyyMMdd'),
                        lable: "90 ngày"
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
                    $scope.searchData.loaiNhaDat = [lnd.value];
                    $('#typeBox').modal("hide");
                }
                vm.selectHuongNha = function(hn){
                    $scope.searchData.huongNha = [hn.value];
                    $('#trendBox').modal("hide");
                    

                }

                vm.setSearchDataSpn = function(val){
                    $scope.searchData.soPhongNguGREATER = val;
                }
                 vm.setSearchDataSpt = function(val){
                    $scope.searchData.soPhongTamGREATER = val;
                }
                vm.setSearchDataGia = function(event, index){
                    var value = event.target;
                }
                vm.setSearchDataRadius = function(val){
                    vm.radius = val;
                }

                vm.gotoHomePage = function(event){
                   $state.go('mhome', { }, {location: true});
                   $(".overlay").click();
                }
                vm.showLogin = function(event){
                    $('#box-login').fadeIn(500);
                    //window.loca
                }
                vm.hideFilter = function(){
                    $(".search").removeAttr("style");
                    $(".search_mobile").find("i").removeClass("iconCancel").addClass("iconSearch");
                    $("body").removeClass("bodyNavShow");
                    $(".search-footer").removeClass("fixed");
                    $(".search-btn").css("display","none");
                    $(".overlay").click();
                    $(".spinner").addClass("spinner-hide");
                    $(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
                    $(".btn-group .btn").removeClass("active");
                    $(".btn-group .btn:first-child").addClass("active");
                    $(".search input").val('');
                    $(".search_mobile").removeClass("active");
                    $(".search").css("top","42");
                    $("header").show();
                    $('.search-txt').text("Lọc");
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
                    // if(!vm.place)
                    //     vm.place = {place_id: "ChIJoRyG2ZurNTERqRfKcnt_iOc"};
                    // $state.transitionTo("msearch", { "place" : vm.place.place_id, "loaiTin" : 0, "loaiNhaDat" : 0 ,"query": $scope.searchData, "viewMode": "list"}, {
                    //     reload: true,
                    //     inherit: false,
                    //     notify: true
                    // });
                    if($scope.searchData.dienTichKhacFrom || $scope.searchData.dienTichKhacTo){
                        $scope.searchData.dienTichBETWEEN[0] = 0 || $scope.searchData.dienTichKhacFrom;
                        $scope.searchData.dienTichBETWEEN[1] = $scope.searchData.dienTichKhacTo || 9999999999999999;  
                        $scope.searchData.dienTichKhacFrom = undefined;
                        $scope.searchData.dienTichKhacTo = undefined;                     
                    }
                    if($scope.searchData.giaKhacFrom || $scope.searchData.giaKhacTo){
                        $scope.searchData.giaBETWEEN[0] = $scope.searchData.giaKhacFrom || 0;
                        $scope.searchData.giaBETWEEN[1] = $scope.searchData.giaKhacTo || 9999999999999999;  
                        $scope.searchData.giaKhacFrom = undefined;
                        $scope.searchData.giaKhacTo = undefined;                      
                    }
                    $scope.searchData.polygon = undefined;
                    if(vm.item){
                        if(vm.item.query){
                            $scope.searchData = vm.item.query;                             
                        } else if(vm.item.location){
                            $scope.searchData.circle = {
                                center: $rootScope.currentLocation,
                                radius: vm.radius
                            }
                        } else{
                            $scope.searchData.diaChinh = {
                                tinhKhongDau: vm.place.tinh,
                                huyenKhongDau: vm.place.huyen,
                                xaKhongDau: vm.place.xa,
                                fullName: vm.place.description
                            };                                
                        }
                        
                    }
                    
                    // $state.go("msearch", { "place" : vm.place.place_id, "loaiTin" : 0, "loaiNhaDat" : 0 ,"query": $scope.searchData, "viewMode": "list"});

                    $state.go("msearch", { "placeId": $rootScope.searchData.placeId, "loaiTin" : 0, "loaiNhaDat" : 0,"query": $scope.searchData, "viewMode": $scope.mode?$scope.mode:"list"},{reload: true});
                    $(".overlay").click();
                }
                vm.gotoRelandApp = function(event){

                }
                vm.profile = function(){
                    $state.go('profile', { userID: $rootScope.user.userID}, {location: true});
                }
                vm.selectPlaceCallback = function(item){
                    if(item.lastSearchSeparator==true){
                        return;
                    }
                    $rootScope.act = item.description;
                    vm.item = item;
                    if(vm.item.placeId)
                        $rootScope.searchData.placeId = vm.item.placeId;
                    vm.keepViewport = false;
                    if(item.query){
                        vm.place = vm.item.place;
                        $scope.searchData = item.query;                        
                        vm.updateDrums();
                    }else{
                        vm.place = item;
                    } 
                    if(!item.location){
                        $scope.searchData.circle = undefined;
                    }    
                    $scope.$apply();               
                }

                NgMap.getMap("filtermap").then(function(map){
                    vm.map = map;           
                    /*window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"searchadd",map,[
                        {
                            description: "1",
                            types:      "1", 
                            place_id:   "111",
                            class: "iconLocation gray"
                        },
                        {
                            description: "2",
                            types:      "1", 
                            place_id:   "111",
                            class: "iconLocation gray"
                        }
                    ]);*/

                    RewayCommonUtil.placeAutoComplete(vm.selectPlaceCallback,"searchadd",[
                        {
                            description: "3",
                            types:      "1", 
                            place_id:   "111",
                            class: "iconLocation grasy"
                        },
                        {
                            description: "4",
                            types:      "1", 
                            place_id:   "111",
                            class: "iconLocation grasy"
                        }
                    ]);
                    // vm.PlacesService =  new google.maps.places.PlacesService(map);                                
                });

                var setDrumValues = function(select, value){
                    var options = select[0].options;                    
                    if(value.indexOf("[0,9999999")>-1){
                         select.drum('setIndex', 0); 
                         $("#"+select.attr("id") + "_value").html(options[0].label);   
                    }else{
                        for(var i =0;i<options.length;i++){
                            if(options[i].value==value){
                                select.drum('setIndex', i); 
                                $("#"+select.attr("id") + "_value").html(options[i].label);                                
                                break;
                            }
                        }
                    }
                    
                }
                vm.showFrequentSearch = false;
                vm.autocompleteSource = function (request, response) {
                    var results = [];
                    $http.get("/api/place/autocomplete?input=" + request.term).then(function(res){
                        var predictions = res.data.predictions; 
                        if(res.status == '200'){
                          for (var i = 0, prediction; prediction = predictions[i]; i++) {
                            results.push(
                            {
                              description: prediction.fullName,
                              types:    prediction.placeType, 
                              viewPort:   prediction.viewPort,
                              tinh: prediction.tinh,
                              huyen: prediction.huyen,
                              xa: prediction.xa,
                              placeId: prediction.placeId,
                              class: "iconLocation gray"
                            }
                            );
                          } 
                        }
                        response(results);
                    });
                }
                vm.favoriteSearchSource = [
                    {
                        description: "Vị trí hiện tại",
                        location: true,
                        class: "ui-autocomplete-category"
                    }
                ];


                vm.keyPress = function(event){
                    vm.showFrequentSearch = false;
                    $( "#searchadd").autocomplete( "option", "source",vm.autocompleteSource);
                    $('.iconCancel').show();
                }
                
                vm.exitAutoComplete =function(event){
                    vm.act = '';
                    if($(event.target).hasClass('iconCancel')){                        
                        // $(".input-fr").removeAttr("style");
                        $('.iconCancel').hide();
                        $('#searchadd').focus();
                        $( "#searchadd").autocomplete( "option", "source",vm.favoriteSearchSource);
                        $( "#searchadd").autocomplete( "search", "" );                        
                    }else{
                        $(".close-search").removeAttr("style");
                        $(".input-fr").removeAttr("style");
                    }
                    event.preventDefault();
                    
                }
                vm.showFavorite = function(event){
                    console.log("------------------showFavorite-Filter------------------");
                    var $ww = $(window).width();
                    $(".input-fr").css("width", $ww-78);
                    $('.iconCancel').hide();
                    $(".close-search").show();  
                    $( "#searchadd").autocomplete( "option", "source",vm.favoriteSearchSource);
                    $( "#searchadd").autocomplete( "search", "" );                            
                    $( "#searchadd").focus();
                }



                vm.userLoggedIn = function(){                   
                    var saveSearches = $rootScope.user.saveSearch;
                    if(saveSearches ){
                        $scope.saveSearchCount = saveSearches.length;
                        for (var i = saveSearches.length - 1; i >= 0; i--) {                              
                            var des = window.RewayUtil.convertQuery2String(saveSearches[i].query);
                            if(des && des.length>20)
                                des = des.substring(0,20) + "...";                            
                            vm.favoriteSearchSource.splice(1,0,{
                                description: saveSearches[i].name,
                                subDescription: des,
                                query: saveSearches[i].query,
                                class: "fa fa-heart red ui-menu-item-wrapper"                        
                            });                                
                        }

                    }                
                }

                vm.updateDrums = function(){
                    //set price drum
                    var prices = "["+$scope.searchData.giaBETWEEN[0]+"," +$scope.searchData.giaBETWEEN[1]+"]";
                    var pricesElm = $("#price_" + $scope.searchData.loaiTin + " select#prices");
                    setDrumValues(pricesElm, prices);
                    
                    
                    // var area1 = $scope.searchData.dienTichBETWEEN[0];
                    // var area1Elm = $("select#area1");
                    // setDrumValues(area1Elm,area1);

                    var area = "["+$scope.searchData.dienTichBETWEEN[0]+","+$scope.searchData.dienTichBETWEEN[1]+"]";
                    var areaElm = $("select#area");
                    setDrumValues(areaElm,area);

                    var datepost = $scope.searchData.ngayDangTinGREATER;
                    var datepostElm = $("select#datepost");
                    setDrumValues(datepostElm,datepost);   
                }
                vm.init = function(){
                    $scope.$bus.subscribe({
                        channel: 'search',
                        topic: 'search',
                        callback: function(data, envelope) {
                            console.log("--------------------- topic Search-Filter-------------------");
                            var des = window.RewayUtil.convertQuery2String(data.query);
                            if(des && des.length>20)
                                des = des.substring(0,20) + "...";
                            var lastSearchLength = vm.favoriteSearchSource.length;
                            if($scope.saveSearchCount)
                                var lastSearchLength = vm.favoriteSearchSource.length - $scope.saveSearchCount;
                            if(lastSearchLength>= 10){
                                vm.favoriteSearchSource.splice(vm.favoriteSearchSource.length-1, 1);
                            }
                            vm.favoriteSearchSource.push({
                                description: (data.query && data.query.diaChinh && data.query.diaChinh.fullName? data.query.diaChinh.fullName : ''),
                                subDescription: des,
                                query: data.query,
                                class: "fa fa-history gray ui-menu-item-wrapper"                        
                            }); 
                        }
                    });

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
                            $("#" + selected.id + "_value").html($(selected).find(":selected").html());
                            var array = JSON.parse(selected.value);
                            if(selected.id =="prices"){
                                $scope.searchData.giaBETWEEN = array;
                            }else if(selected.id =="area"){
                                $scope.searchData.dienTichBETWEEN = array;
                            }else if(selected.id=="datepost"){
                                $scope.searchData.ngayDangTinGREATER = selected.value;
                            }
                        }
                    });
                    vm.updateDrums();

                    if($rootScope.getAllLastSearch($localStorage)){

                        var lastSearches = $rootScope.getAllLastSearch($localStorage);
                        if(lastSearches.length>0){
                            console.log("--------------------- init sugestSearch-Filter-------------------: " + lastSearches.length);
                            vm.favoriteSearchSource.push({
                                description: "Tìm kiếm gần đây",
                                lastSearchSeparator: true
                            });
                        }
                        var count = 0;
                        for (var i = lastSearches.length - 1; i >= 0; i--) {
                            var des = window.RewayUtil.convertQuery2String(lastSearches[i].query);
                            if(des && des.length>20)
                                des = des.substring(0,20) + "...";
                            vm.favoriteSearchSource.push({
                                description: (lastSearches[i].query && lastSearches[i].query.diaChinh ? lastSearches[i].query.diaChinh.fullName : ''),
                                subDescription: des,
                                query: lastSearches[i].query,
                                class: "fa fa-history gray ui-menu-item-wrapper"                        
                            });
                            count++;
                            if(count>10)
                                break;
                        }
                    }

                    vm.userLoggedIn();

                    $scope.$bus.subscribe({
                        channel: 'user',
                        topic: 'logged-in',
                        callback: function(data, envelope) {
                            //console.log('add new chat box', data, envelope);
                            vm.userLoggedIn();
                        }
                    });
                    

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