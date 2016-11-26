angular.module('bds').directive('bdsMobileHeader', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {mode: '=mode'},
        terminal: true,
        templateUrl: "/web/common/directives/mobile/bds-mobile-header.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService','RewayCommonUtil',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService,RewayCommonUtil) {
                var vm = this; 
                vm.stateName = $state.current.name;
                //nhannc
                $scope.isPostPage = false;
                vm.openPost = function(){
                    $(".post").animate({
                        right: 0
                    }, 120);
                    $("body").addClass("bodySearchShow");
                    $(".post").scrollTop(0);
                    $(".post-footer").addClass("fixed");
                    overlay(".overlay");
                }
                vm.exitPost = function(){
                    $(".post").removeAttr("style");
                    $("body").removeClass("bodySearchShow");
                    $(".post-footer").removeClass("fixed");
                }
                //end nhannc
                vm.goToSearchPage = function(){
                    if($rootScope.searchData.placeId){
                        $state.go("msearch", { "placeId": $rootScope.searchData.placeId, "loaiTin" : 0, "loaiNhaDat" : 0,"query": $rootScope.searchData, "viewMode": "map"},{reload: true});   
                    }else{
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position){
                                $rootScope.currentLocation.lat = position.coords.latitude;
                                $rootScope.currentLocation.lon = position.coords.longitude;
                                RewayCommonUtil.getGeoCodePostGet(position.coords.latitude,position.coords.longitude,function(results){                                    
                                    if(results){
                                        var places = results;
                                        var newPlace = places[0];
                                        for (var i=0; i<places.length; i++) {
                                            var xa = window.RewayPlaceUtil.getXa(places[i]);
                                            if (xa != '') {
                                                newPlace = places[i];
                                                break;
                                            }
                                        }
                                        var tinh = window.RewayPlaceUtil.getTinh(newPlace);
                                        var huyen = window.RewayPlaceUtil.getHuyen(newPlace);
                                        var xa = window.RewayPlaceUtil.getXa(newPlace);
                                        var diaChinh = {};
                                        diaChinh.tinhKhongDau = window.RewayUtil.locDau(tinh);
                                        diaChinh.huyenKhongDau = window.RewayUtil.locDau(huyen);
                                        //diaChinh.xaKhongDau = window.RewayUtil.locDau(xa);
                                        var placeType = 'T';
                                        if (diaChinh.huyenKhongDau)
                                            placeType = 'H';
                                        // if (diaChinh.xaKhongDau)
                                        //     placeType = 'X';
                                        var diaChinhDto = {
                                            tinhKhongDau: diaChinh.tinhKhongDau,
                                            huyenKhongDau: diaChinh.huyenKhongDau,
                                            // xaKhongDau: diaChinh.xaKhongDau,
                                            placeType: placeType
                                        }
                                        HouseService.getPlaceByDiaChinhKhongDau(diaChinhDto).then(function(res){
                                            console.log("--------------HouseService.getPlaceByDiaChinhKhongDau-------------");
                                            if(res){                                                                                                
                                                $state.go("msearch", { "placeId": res.data.diaChinh.placeId, "loaiTin" : 0, "loaiNhaDat" : 0,"query": $rootScope.searchData, "viewMode": "map"},{reload: true});   
                                            }
                                        });
                                    }
                                    
                                });                                
                            }, function(error){
                                console.log(error);                 
                                // vm.showAskCurrentLocation  = true;
                                $state.go("msearch", { "placeId": "Place_T_HN", "loaiTin" : 0, "loaiNhaDat" : 0,"query": $rootScope.searchData, "viewMode": "map"},{reload: true});   
                            });
                        } else {
                            $state.go("msearch", { "placeId": "Place_T_HN", "loaiTin" : 0, "loaiNhaDat" : 0,"query": $rootScope.searchData, "viewMode": "map"},{reload: true});   
                        }

                    }
                    
                    
                }
                vm.searchfr = function(){
                    $(".search").removeAttr("style");
                    $(".search_mobile").find("i").removeClass("iconCancel").addClass("iconSearch");
                    $("body").removeClass("bodyNavShow");
                    $(".search-footer").removeClass("fixed");
                    $(".search-btn").css("display","none");
                    vm.reset();
                }                     
                vm.reset =function(){
                    // $(".btn-more").removeAttr("style");
                    // $(".more-box").addClass("more-box-hide");
                    // $(".spinner").addClass("spinner-hide");
                    // $(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
                    // $(".btn-group .btn").removeClass("active");
                    // $(".btn-group .btn:first-child").addClass("active");
                    $(".spinner").addClass("spinner-hide");
                    $(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
                    $(".btn-group .btn").removeClass("active");
                    $(".btn-group .btn:first-child").addClass("active");
                    $(".search input").val('');
                    $(".search_mobile").removeClass("active");
                }         
                vm.toggleFilter = function(event){
                    //nhannc
                    if($(".search_mobile").find("i").hasClass("iconSearch")) {
                        if ($(".post").css("right") == "0px") {
                            $scope.isPostPage = true;
                            vm.exitPost();
                        }
                    } else{
                        if($scope.isPostPage){
                            vm.openPost();
                        }
                        $scope.isPostPage = false;
                    }
                    //end nhannc
                    if(!$('.search_mobile').hasClass("active")){
                        $(event.target).text("Hủy");
                        $(".search").animate({
                            right: 0
                        }, 120);
                        $(".search_mobile").find("i").removeClass("iconSearch").addClass("iconCancel");
                        //$("body").addClass("bodyNavShow");
                        $(".search").scrollTop(0);
                        $(".search").css("top","0");
                        $(".search-footer").addClass("fixed");
                        $(".search-btn").css("display","block");
                        $(".search_mobile").addClass("active");
                        $("header").hide();

                    }else{                        
                        $(event.target).text("Lọc");
                        vm.searchfr();
                        $(".search").css("top","42");
                        $("header").show();
                    }
                }

                vm.toggleLeftMenu=function(){
                    $(".overlay").show();
                    $(".nav_mobile").find("i").removeClass("iconMenu").addClass("iconLeftOpen");
                    $("body").addClass("bodyNavShow").animate({
                        left: 270
                    }, 120);
                    $("nav.main").animate({
                        left: 0
                    }, 120);
                }

                $scope.$bus.subscribe({
                    channel: 'search',
                    topic: 'show search',
                    callback: function(data, envelope) {
                        if(!$('.search_mobile').hasClass("active")){
                            $(".search").animate({
                                right: 0
                            }, 120);
                            $(".search_mobile").find("i").removeClass("iconSearch").addClass("iconCancel");
                            //$("body").addClass("bodyNavShow");
                            $(".search").scrollTop(0);
                            $(".search-footer").addClass("fixed");
                            $(".search-btn").css("display","block");
                            $(".search_mobile").addClass("active");
                        }
                    }
                });

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
                    $( "#searchadd1").autocomplete( "option", "source",vm.autocompleteSource);
                    var $ww = $(window).width();                 

                    
                }
                vm.toggleQuickClearAutoComplete = function(){
                    if(vm.autoCompleteText == '' || !vm.autoCompleteText){
                        $( "#searchadd1").autocomplete( "option", "source",vm.favoriteSearchSource);
                        $( "#searchadd1").autocomplete( "search", "" );
                        $(".close-search").removeAttr("style");
                        $(".input-fr").removeAttr("style");
                    }else{
                        $(".close-search").show();
                        $(".input-fr").css("width", $ww-78);
                    }
                    // if($(".search").find("input").hasClass("input-fr")){

                    //     if($(".input-fr").val().length>0) {
                    //         $(".close-search").show();
                    //         $(".input-fr").css("width", $ww-78);
                    //     }else{
                    //         $(".close-search").removeAttr("style");
                    //         $(".input-fr").removeAttr("style");
                    //     }
                    // }
                }
                vm.autoCompleteChange = function(event){
                    if(vm.autoCompleteText == ''){
                        $( "#searchadd1").autocomplete( "option", "source",vm.favoriteSearchSource);
                        $( "#searchadd1").autocomplete( "search", "" );
                    }
                    vm.toggleQuickClearAutoComplete();                    
                }
                vm.showFavorite = function(event){
                    if(vm.autoCompleteText == '' || !vm.autoCompleteText){
                        $( "#searchadd1").autocomplete( "option", "source",vm.favoriteSearchSource);
                        $( "#searchadd1").autocomplete( "search", "" );
                    }

                }
                vm.userLoggedIn = function(){                   
                    let saveSearches = $rootScope.user.saveSearch;
                    if(saveSearches ){
                        for (var i = saveSearches.length - 1; i >= 0; i--) {                              
                            let des = window.RewayUtil.convertQuery2String(saveSearches[i].query);
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



                vm.selectPlaceCallback1 = function(item){
                    if(item.lastSearchSeparator==true){
                        return;
                    }
                    vm.item = item;
                    if(vm.item.placeId)
                        $rootScope.searchData.placeId = vm.item.placeId;
                    vm.keepViewport = false;
                    if(item.query){                        
                        $rootScope.searchData = item.query;                        
                        // vm.updateDrums();
                    } 
                    if(!item.location){
                        $rootScope.searchData.circle = undefined;
                    }    
                    // $scope.$apply();   
                    $state.go("msearch", { "placeId": $rootScope.searchData.placeId, "loaiTin" : 0, "loaiNhaDat" : 0,"query": $rootScope.searchData, "viewMode": $scope.mode?$scope.mode:"list"},{reload: true});
                    $(".overlay").click();            
                }
                vm.init = function(){
                    RewayCommonUtil.placeAutoComplete(vm.selectPlaceCallback1,"searchadd1",[
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

                    $scope.$bus.subscribe({
                        channel: 'search',
                        topic: 'search',
                        callback: function(data, envelope) {
                            //console.log('add new chat box', data, envelope);
                            let des = window.RewayUtil.convertQuery2String(data.query);
                            if(des && des.length>20)
                                des = des.substring(0,20) + "...";
                            vm.favoriteSearchSource.push({
                                description: "Tìm kiếm lúc " + data.time,
                                subDescription: des,
                                query: data.query,
                                class: "fa fa-history gray ui-menu-item-wrapper"                        
                            }); 
                        }
                    });

                    if($rootScope.getAllLastSearch($localStorage)){
                        let lastSearches = $rootScope.getAllLastSearch($localStorage);
                        if(lastSearches.length>0){
                            vm.favoriteSearchSource.push({
                                description: "Tìm kiếm gần đây",
                                lastSearchSeparator: true
                            });
                        }
                        for (var i = lastSearches.length - 1; i >= 0; i--) {
                            let des = window.RewayUtil.convertQuery2String(lastSearches[i].query);
                            if(des && des.length>20)
                                des = des.substring(0,20) + "...";
                            vm.favoriteSearchSource.push({
                                description: "Tìm kiếm lúc " + lastSearches[i].time,
                                subDescription: des,
                                query: lastSearches[i].query,
                                class: "fa fa-history gray ui-menu-item-wrapper"                        
                            }); 
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
                },0);

                $scope.$on("$destroy", function() {
                    $('#searchadd1').autocomplete("destroy");
                });


            }

        ],
        controllerAs: "mhdr"
    };
    return def;
}]);