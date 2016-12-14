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
                vm.iconSearchClass = "iconSearch";
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
                    $scope.searchData.loaiNhaDat = undefined;
                    angular.element('#loadiNhaDatContainer span label').text(vm.loaiNhaDat[0].lable);

                    if($scope.searchData.loaiTin==0){
                        $scope.searchData.giaBETWEEN =  vm.sellPrices[0].value;    
                    }else{
                        $scope.searchData.giaBETWEEN =  vm.rentPrices[0].value;    
                    }     
                    $scope.searchData.dienTichBETWEEN = vm.areas[0].value;

                    vm.setSearchDataSpn(0);
                    vm.selectHuongNha(vm.huongNhaList[0]);
                    angular.element('#huongNhaContainer span label').text(vm.huongNhaList[0].lable);
                    $scope.searchData.ngayDangTinGREATER = "19810101";
                    vm.updateDrums();
                    
                    
                }
                vm.pageSize = 25;
                vm.initialized = false;
                vm.keepViewport = true;
                vm.stateName = $state.current.name;
                vm.act = $rootScope.act;
                // $scope.searchData = {};
                // //Object.assign($scope.searchData,$rootScope.searchData);
                // _.assign($scope.searchData,$rootScope.searchData);
                // $scope.sd.abc = 'd';

                vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
                vm.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;

                vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);


                vm.sellPrices  = window.RewayListValue.sellPrices;
                vm.rentPrices  = window.RewayListValue.rentPrices;
                vm.areas = window.RewayListValue.areas;
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
                        value: Date.today().add(-3).days().toString('yyyyMMdd'),
                        lable: "3 ngày"
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
                    $(".iconSearch").show();
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

                vm.ngayDangTinInputChange = function () {
                    if(!$scope.ngayDangTinInput){
                        $("#datepost_value").html("Bất kỳ");
                        $scope.searchData.ngayDangTinGREATER = "19810101";
                    }else {
                        var ngayDang=parseInt($scope.ngayDangTinInput);
                        $scope.searchData.ngayDangTinGREATER = Date.today().add(-ngayDang).days().toString('yyyyMMdd')
                        $("#datepost_value").html($scope.ngayDangTinInput + " ngày");
                    }
                }

                vm.changeDienTichFrom = function () {
                    if(!$scope.dienTichKhacFrom){
                        if($scope.dienTichKhacFrom==0){
                            if(!$scope.dienTichKhacTo){
                                if($scope.dienTichKhacTo==0){
                                    $("#area_value").html("Chưa xác định");
                                    $scope.searchData.dienTich = -1;
                                    $scope.searchData.dienTichBETWEEN=[-1,-1];
                                } else{
                                    $scope.searchData.dienTich = undefined;
                                    $("#area_value").html("Bất kỳ");
                                    $scope.searchData.dienTichBETWEEN=[0, window.RewayListValue.BIG];
                                }
                            } else{
                                $scope.searchData.dienTich = undefined;
                                $("#area_value").html("0 m² - " + $scope.dienTichKhacTo + " m²");
                                $scope.searchData.dienTichBETWEEN=[0, $scope.dienTichKhacTo];
                            }
                        } else{
                            $scope.searchData.dienTich = undefined;
                            if(!$scope.dienTichKhacTo){
                                $("#area_value").html("Bất kỳ");
                                $scope.searchData.dienTichBETWEEN=[0, window.RewayListValue.BIG]
                            } else{
                                $("#area_value").html("0 m² - " + $scope.dienTichKhacTo + " m²");
                                $scope.searchData.dienTichBETWEEN=[0, $scope.dienTichKhacTo];
                            }
                        }

                    } else{
                        $scope.searchData.dienTich = undefined;
                        if(!$scope.dienTichKhacTo){
                            if($scope.dienTichKhacTo==0){
                                $("#area_value").html("0 m² - " + $scope.dienTichKhacFrom + " m²");
                                $scope.searchData.dienTichBETWEEN=[0, $scope.dienTichKhacFrom];
                            } else{
                                $("#area_value").html($scope.dienTichKhacFrom + " m² - Bất kỳ" );
                                $scope.searchData.dienTichBETWEEN=[$scope.dienTichKhacFrom, window.RewayListValue.BIG];
                            }
                        } else{
                            if($scope.dienTichKhacFrom < $scope.dienTichKhacTo){
                                $("#area_value").html($scope.dienTichKhacFrom + " m² - " + $scope.dienTichKhacTo + " m²");
                                $scope.searchData.dienTichBETWEEN=[$scope.dienTichKhacFrom, $scope.dienTichKhacTo];
                            } else {
                                $("#area_value").html($scope.dienTichKhacTo + " m² - " + $scope.dienTichKhacFrom + " m²");
                                $scope.searchData.dienTichBETWEEN=[$scope.dienTichKhacTo, $scope.dienTichKhacFrom];
                            }
                        }
                    }
                }

                vm.changeDienTichTo = function () {
                    if(!$scope.dienTichKhacTo){
                        if($scope.dienTichKhacTo==0){
                            if(!$scope.dienTichKhacFrom){
                                if($scope.dienTichKhacFrom==0){
                                    $("#area_value").html("Chưa xác định");
                                    $scope.searchData.dienTich = -1;
                                    $scope.searchData.dienTichBETWEEN=[-1,-1];
                                } else{
                                    $scope.searchData.dienTich = undefined;
                                    $("#area_value").html("Bất kỳ");
                                    $scope.searchData.dienTichBETWEEN=[0, window.RewayListValue.BIG];
                                }
                            } else{
                                $scope.searchData.dienTich = undefined;
                                $("#area_value").html("0 m² - " + $scope.dienTichKhacFrom + " m²");
                                $scope.searchData.dienTichBETWEEN=[0, $scope.dienTichKhacFrom];
                            }
                        } else{
                            $scope.searchData.dienTich = undefined;
                            if(!$scope.dienTichKhacFrom){
                                $("#area_value").html("Bất kỳ");
                                $scope.searchData.dienTichBETWEEN=[0, window.RewayListValue.BIG]
                            } else{
                                $("#area_value").html($scope.dienTichKhacFrom + " m² - Bất kỳ");
                                $scope.searchData.dienTichBETWEEN=[$scope.dienTichKhacFrom,window.RewayListValue.BIG];
                            }
                        }

                    } else{
                        $scope.searchData.dienTich = undefined;
                        if(!$scope.dienTichKhacFrom){
                            $("#area_value").html("0 m² " + $scope.dienTichKhacTo + " m²" );
                            $scope.searchData.dienTichBETWEEN=[0, $scope.dienTichKhacTo]
                        } else{
                            if($scope.dienTichKhacFrom < $scope.dienTichKhacTo){
                                $("#area_value").html($scope.dienTichKhacFrom + " m² - " + $scope.dienTichKhacTo + " m²");
                                $scope.searchData.dienTichBETWEEN=[$scope.dienTichKhacFrom, $scope.dienTichKhacTo];
                            } else {
                                $("#area_value").html($scope.dienTichKhacTo + " m² - " + $scope.dienTichKhacFrom + " m²");
                                $scope.searchData.dienTichBETWEEN=[$scope.dienTichKhacTo, $scope.dienTichKhacFrom];
                            }
                        }
                    }
                }

                vm.changeGiaKhacFrom = function () {
                    if(!$scope.giaKhacFrom){
                        if($scope.giaKhacFrom==0){
                            if(!$scope.giaKhacTo){
                                if($scope.giaKhacTo==0){
                                    $("#prices_value").html("Chưa xác định");
                                    $scope.searchData.gia = -1;
                                    $scope.searchData.giaBETWEEN=[-1,-1];
                                } else{
                                    $scope.searchData.gia = undefined;
                                    $("#prices_value").html("Bất kỳ");
                                    $scope.searchData.giaBETWEEN=[0, window.RewayListValue.BIG];
                                }
                            } else{
                                $scope.searchData.gia = undefined;
                                $("#prices_value").html("0 triệu - " + $scope.giaKhacTo + " tỷ");
                                $scope.searchData.giaBETWEEN=[0, $scope.giaKhacTo*1000];
                            }
                        } else{
                            $scope.searchData.gia = undefined;
                            if(!$scope.giaKhacTo){
                                $("#prices_value").html("Bất kỳ");
                                $scope.searchData.giaBETWEEN=[0, window.RewayListValue.BIG]
                            } else{
                                $("#prices_value").html("0 triệu - " + $scope.giaKhacTo + " tỷ");
                                $scope.searchData.giaBETWEEN=[0, $scope.giaKhacTo*1000];
                            }
                        }
                    } else{
                        $scope.searchData.gia = undefined;
                        if(!$scope.giaKhacTo){
                            if($scope.giaKhacTo==0){
                                $("#prices_value").html("0 triệu - " + $scope.giaKhacFrom + " tỷ");
                                $scope.searchData.giaBETWEEN=[0, $scope.giaKhacFrom*1000];
                            } else{
                                $("#prices_value").html($scope.giaKhacFrom + " tỷ - Bất kỳ" );
                                $scope.searchData.giaBETWEEN=[$scope.giaKhacFrom*1000, window.RewayListValue.BIG];
                            }
                        } else{
                            if($scope.giaKhacFrom < $scope.giaKhacTo){
                                $("#prices_value").html($scope.giaKhacFrom + " tỷ - " + $scope.giaKhacTo + " tỷ");
                                $scope.searchData.giaBETWEEN=[$scope.giaKhacFrom*1000, $scope.giaKhacTo*1000];
                            } else {
                                $("#prices_value").html($scope.giaKhacTo + " tỷ - " + $scope.giaKhacFrom + " tỷ");
                                $scope.searchData.giaBETWEEN=[$scope.giaKhacTo*1000, $scope.giaKhacFrom*1000];
                            }
                        }
                    }
                }

                vm.changeGiaKhacTo = function () {
                    if(!$scope.giaKhacTo){
                        if($scope.giaKhacTo==0){
                            if(!$scope.giaKhacFrom){
                                if($scope.giaKhacFrom==0){
                                    $("#prices_value").html("Chưa xác định");
                                    $scope.searchData.gia = -1;
                                    $scope.searchData.giaBETWEEN=[-1,-1];
                                } else{
                                    $scope.searchData.gia = undefined;
                                    $("#prices_value").html("Bất kỳ");
                                    $scope.searchData.giaBETWEEN=[0, window.RewayListValue.BIG];
                                }
                            } else{
                                $scope.searchData.gia = undefined;
                                $("#prices_value").html("0 triệu - " + $scope.giaKhacFrom + " tỷ");
                                $scope.searchData.giaBETWEEN=[0, $scope.giaKhacFrom*1000];
                            }
                        } else{
                            $scope.searchData.gia = undefined;
                            if(!$scope.giaKhacFrom){
                                $("#prices_value").html("Bất kỳ");
                                $scope.searchData.giaBETWEEN=[0, window.RewayListValue.BIG]
                            } else{
                                $("#prices_value").html($scope.giaKhacFrom + " tỷ - Bất kỳ");
                                $scope.searchData.giaBETWEEN=[$scope.giaKhacFrom*1000, window.RewayListValue.BIG];
                            }
                        }
                    }else{
                        $scope.searchData.gia = undefined;
                        if(!$scope.giaKhacFrom){
                            $("#prices_value").html("0 triệu " + $scope.giaKhacTo + " tỷ" );
                            $scope.searchData.giaBETWEEN=[0, $scope.giaKhacTo*1000];
                        } else{
                            if($scope.giaKhacFrom < $scope.giaKhacTo){
                                $("#prices_value").html($scope.giaKhacFrom + " tỷ - " + $scope.giaKhacTo + " tỷ");
                                $scope.searchData.giaBETWEEN=[$scope.giaKhacFrom*1000, $scope.giaKhacTo*1000];
                            } else {
                                $("#prices_value").html($scope.giaKhacTo + " tỷ - " + $scope.giaKhacFrom + " tỷ");
                                $scope.searchData.giaBETWEEN=[$scope.giaKhacTo*1000, $scope.giaKhacFrom*1000];
                            }
                        }
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
                    /*
                    if($scope.dienTichKhacFrom || $scope.dienTichKhacTo){
                        $scope.searchData.dienTichBETWEEN[0] = 0 || $scope.dienTichKhacFrom;
                        $scope.searchData.dienTichBETWEEN[1] = $scope.dienTichKhacTo || window.RewayListValue.BIG;
                        // $scope.dienTichKhacFrom = undefined;
                        // $scope.dienTichKhacTo = undefined;
                    }
                    if($scope.giaKhacFrom || $scope.giaKhacTo){
                        $scope.searchData.giaBETWEEN[0] = $scope.giaKhacFrom * 1000|| 0;
                        $scope.searchData.giaBETWEEN[1] = $scope.giaKhacTo *1000|| window.RewayListValue.BIG;
                        // $scope.giaKhacFrom = undefined;
                        // $scope.giaKhacTo = undefined;
                    }*/
                    if($scope.searchData.ngayDangTinGREATER)
                        $scope.searchData.ngayDangTinGREATER = $scope.searchData.ngayDangTinGREATER + "";
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
                    if($scope.searchData.loaiNhaDat && ($scope.searchData.loaiNhaDat[0]==0))
                        $scope.searchData.loaiNhaDat = undefined;
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
                    $(".close-search").removeAttr("style");
                    $(".input-fr").removeAttr("style");

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
                    $('#searchadd').blur();
                    $scope.$apply();               
                }

                vm.showLoadingFuntion = function(loading){
                    if(loading==true){
                        vm.iconSearchClass = "iconSearching search-head fa-spin";
                    }else{
                        vm.iconSearchClass = "iconSearch";
                    }
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
                    ],vm.showLoadingFuntion);
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
                              placeId: prediction.placeId
                              // class: "iconLocation gray"
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
                    vm.act = $rootScope.act;
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
                    $( "#searchadd").text("");
                    vm.act='';
                    //event.preventDefault
                    //$scope.$digest();

                }



                vm.userLoggedIn = function(){
                    console.log("---------------------filter-userLoggedIn--------------------");
                    if(vm.favoriteSearchSource && vm.favoriteSearchSource.length<2){
                        if($rootScope.getSearchHistory()){

                            var lastSearches = $rootScope.getSearchHistory();
                            if(lastSearches.length>0){
                                console.log("--------------------- init sugestSearch-Filter-------------------: " + lastSearches.length);
                                // vm.favoriteSearchSource.push({
                                //     description: "Tìm kiếm gần đây",
                                //     lastSearchSeparator: true
                                // });
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
                    }

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

                vm.updateDrums = function() {
                    //set price drum
                    var prices = "";
                    if ($scope.searchData.giaBETWEEN) {
                        prices = "[";
                        if ($scope.searchData.giaBETWEEN[0]){
                            prices = prices + $scope.searchData.giaBETWEEN[0]
                        } else {
                            prices = prices + 0;
                        }
                        prices = prices + ",";
                        if ($scope.searchData.giaBETWEEN[1]){
                            prices = prices + $scope.searchData.giaBETWEEN[1]
                        } else {
                            prices = prices + window.RewayListValue.BIG;
                        }
                        prices = prices + "]";
                    } else{
                        prices = "[0, " + window.RewayListValue.BIG + "]";
                    }

                    //var prices = "["+$scope.searchData.giaBETWEEN[0]+"," +$scope.searchData.giaBETWEEN[1]+"]";
                    var pricesElm = $("#price_" + $scope.searchData.loaiTin + " select#prices");
                    setDrumValues(pricesElm, prices);
                    
                    
                    // var area1 = $scope.searchData.dienTichBETWEEN[0];
                    // var area1Elm = $("select#area1");
                    // setDrumValues(area1Elm,area1);

                    var area = "";
                    if ($scope.searchData.dienTichBETWEEN) {
                        area = "[";
                        if ($scope.searchData.dienTichBETWEEN[0]){
                            area = area + $scope.searchData.dienTichBETWEEN[0] + ",";
                        } else {
                            area = area + 0 + ",";;
                        }
                        if ($scope.searchData.dienTichBETWEEN[1]){
                            area = area + $scope.searchData.dienTichBETWEEN[1]
                        } else {
                            area = area + window.RewayListValue.BIG;
                        }
                        area = area + "]";
                    } else{
                        area = "[0, " + window.RewayListValue.BIG + "]";
                    }

                    //var area = "["+$scope.searchData.dienTichBETWEEN[0]+","+$scope.searchData.dienTichBETWEEN[1]+"]";
                    var areaElm = $("select#area");
                    setDrumValues(areaElm,area);

                    var datepost = ($scope.searchData.ngayDangTinGREATER?$scope.searchData.ngayDangTinGREATER:"19810101") + "";
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
                            var drumLable = $(selected).find(":selected").html();
                            if(drumLable)
                                drumLable=drumLable.trim();
                            $("#" + selected.id + "_value").html(drumLable);
                            if(selected.value && selected.value.trim().length>0){
                                var array = JSON.parse(selected.value);
                                if(selected.id =="prices"){
                                    $scope.searchData.giaBETWEEN = array;
                                    $timeout(function () {
                                        if(drumLable == "Bất kỳ"){
                                            $scope.giaKhacFrom="";
                                            $scope.giaKhacTo="";
                                            $scope.searchData.gia = undefined;
                                        } else if(drumLable == "Chưa xác định"){
                                            $scope.searchData.giaBETWEEN = [-1,-1];
                                            $scope.searchData.gia = -1;
                                            $scope.giaKhacFrom=0;
                                            $scope.giaKhacTo=0;
                                        } else if(drumLable.indexOf("&gt;") > -1){
                                            $scope.searchData.gia = undefined;
                                            $scope.giaKhacFrom=Math.round((parseFloat(array[0])/1000)*1000)/1000;
                                            $scope.giaKhacTo="";
                                        } else{
                                            $scope.searchData.gia = undefined;
                                            $scope.giaKhacFrom=Math.round((parseFloat(array[0])/1000)*1000)/1000;
                                            $scope.giaKhacTo=Math.round((parseFloat(array[1])/1000)*1000)/1000;
                                        }
                                    },0)
                                }else if(selected.id =="area"){
                                    $scope.searchData.dienTichBETWEEN = array;
                                    $timeout(function () {
                                        if(drumLable == "Bất kỳ"){
                                            $scope.dienTichKhacFrom="";
                                            $scope.dienTichKhacTo="";
                                            $scope.searchData.dienTich = undefined;
                                        } else if(drumLable == "Chưa xác định"){
                                            $scope.searchData.dienTichBETWEEN = [-1,-1];
                                            $scope.searchData.dienTich = -1;
                                            $scope.dienTichKhacFrom=0;
                                            $scope.dienTichKhacTo=0;
                                        } else if(drumLable.indexOf("&gt;") > -1){
                                            $scope.searchData.dienTich = undefined;
                                            $scope.dienTichKhacFrom=array[0];
                                            $scope.dienTichKhacTo="";
                                        } else{
                                            $scope.searchData.dienTich = undefined;
                                            $scope.dienTichKhacFrom=array[0];
                                            $scope.dienTichKhacTo=array[1];
                                        }
                                    },0)
                                }else if(selected.id=="datepost"){
                                    $scope.searchData.ngayDangTinGREATER = selected.value;
                                    var soNgayDang = drumLable;
                                    if(soNgayDang.trim()=="Bất kỳ"){
                                        $timeout(function () {
                                            $scope.ngayDangTinInput =  0;
                                        },0)
                                    } else{
                                        if(soNgayDang.indexOf(" ") > -1){
                                            soNgayDang=soNgayDang.substring(0,soNgayDang.indexOf(" "));
                                        }
                                        $timeout(function () {
                                            $scope.ngayDangTinInput =  parseInt(soNgayDang);
                                        },0)
                                    }
                                }
                            }
                        }
                    });
                    vm.updateDrums();

                    if($scope.searchData.ngayDangTinGREATER){
                        if($scope.searchData.ngayDangTinGREATER.trim() == "19810101"){
                            $scope.ngayDangTinInput = 0;
                            $("#datepost_value").html("Bất kỳ");
                        } else{
                            var year = $scope.searchData.ngayDangTinGREATER.substring(0,4);
                            var month = $scope.searchData.ngayDangTinGREATER.substring(4,6);
                            var day = $scope.searchData.ngayDangTinGREATER.substring(6,8);
                            var dateDangTin = new Date(year, month-1, day);
                            var currentDate = new Date();
                            var timeDiff = Math.abs(currentDate.getTime() - dateDangTin.getTime());
                            $scope.ngayDangTinInput = Math.round(timeDiff / (1000 * 3600 * 24));
                            $("#datepost_value").html(($scope.ngayDangTinInput) + " ngày");
                        }
                    }

                    if($scope.searchData.loaiNhaDat){
                        if($scope.searchData.loaiTin==0){
                            for(var i=0; i<vm.loaiNhaDatBan.length; i++){
                                if(vm.loaiNhaDatBan[i].value.trim() ==$scope.searchData.loaiNhaDat[0].trim()) {
                                    $(".type-box .collapse-title span label").html(vm.loaiNhaDatBan[i].lable.trim());
                                    break;
                                }
                            }
                        } else if($scope.searchData.loaiTin==1) {
                            for (var i = 0; i < vm.loaiNhaDatThue.length; i++) {
                                if (vm.loaiNhaDatThue[i].value.trim() == $scope.searchData.loaiNhaDat[0].trim()) {
                                    $(".type-box .collapse-title span label").html(vm.loaiNhaDatThue[i].lable.trim());
                                    break;
                                }
                            }
                        }

                    };

                    if($scope.searchData.dienTich && $scope.searchData.dienTich == -1){
                        $scope.dienTichKhacFrom = 0;
                        $scope.dienTichKhacTo=0;
                        $("#area_value").html("Chưa xác định");
                    }else{
                        if($scope.searchData.dienTichBETWEEN){
                            if($scope.searchData.dienTichBETWEEN[0]==0 && $scope.searchData.dienTichBETWEEN[1]==window.RewayListValue.BIG){
                                $("#area_value").html("Bất kỳ");
                            }else{
                                $scope.dienTichKhacFrom = $scope.searchData.dienTichBETWEEN[0];
                                if($scope.searchData.dienTichBETWEEN[1] != window.RewayListValue.BIG){
                                    $scope.dienTichKhacTo=$scope.searchData.dienTichBETWEEN[1];
                                    $("#area_value").html($scope.dienTichKhacFrom + " m² - " + $scope.dienTichKhacTo + " m²");
                                } else{
                                    $("#area_value").html($scope.dienTichKhacFrom + " m² - " + " Bất kỳ");
                                }
                            }
                        }
                    }

                    if($scope.searchData.gia && $scope.searchData.gia == -1){
                        $scope.giaKhacFrom = 0;
                        $scope.giaKhacTo=0;
                        $("#prices_value").html("Chưa xác định");
                    } else{
                        if($scope.searchData.giaBETWEEN){
                            if($scope.searchData.giaBETWEEN[0]==0 && $scope.searchData.giaBETWEEN[1]==window.RewayListValue.BIG){
                                $("#prices_value").html("Bất kỳ");
                            } else {
                                $scope.giaKhacFrom=Math.round((parseFloat($scope.searchData.giaBETWEEN[0])/1000)*1000)/1000;

                                if($scope.searchData.giaBETWEEN[1] != window.RewayListValue.BIG){
                                    $scope.giaKhacTo=Math.round((parseFloat($scope.searchData.giaBETWEEN[1])/1000)*1000)/1000;
                                    $("#prices_value").html($scope.giaKhacFrom + " tỷ - " + $scope.giaKhacTo + " tỷ");
                                } else{
                                    $("#prices_value").html($scope.giaKhacFrom + " tỷ - Bất kỳ");
                                }
                            }
                        }
                    }

                    if($scope.searchData.huongNha){
                        for(var i=0; i<vm.huongNhaList.length; i++){
                            if(vm.huongNhaList[i].value.trim() == $scope.searchData.huongNha[0].trim()) {
                                $(".trend-box .collapse-title span label").html(vm.huongNhaList[i].lable.trim());
                                break;
                            }
                        }
                    };

                    if($rootScope.getSearchHistory()){

                        var lastSearches = $rootScope.getSearchHistory();
                        if(lastSearches.length>0){
                            console.log("--------------------- init sugestSearch-Filter-------------------: " + lastSearches.length);
                            // vm.favoriteSearchSource.push({
                            //     description: "Tìm kiếm gần đây",
                            //     lastSearchSeparator: true
                            // });
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

                    $scope.$on("userLogin", function (event, data) {
                        vm.userLoggedIn();
                    });
                    $scope.$on("userLogout", function (event, data) {
                        vm.favoriteSearchSource = [
                            {
                                description: "Vị trí hiện tại",
                                location: true,
                                class: "ui-autocomplete-category"
                            }
                        ];
                    });
                    /*

                    $scope.$bus.subscribe({
                        channel: 'user',
                        topic: 'logged-in',
                        callback: function(data, envelope) {
                            //console.log('add new chat box', data, envelope);
                            vm.userLoggedIn();
                        }
                    });

                    $scope.$bus.subscribe({
                        channel: 'login',
                        topic: 'logged out',
                        callback: function(data, envelope) {
                            vm.favoriteSearchSource = [
                                {
                                    description: "Vị trí hiện tại",
                                    location: true,
                                    class: "ui-autocomplete-category"
                                }
                            ];
                        }
                    });
                     */

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