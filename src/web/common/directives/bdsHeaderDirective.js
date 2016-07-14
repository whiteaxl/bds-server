angular.module('bds').directive('bdsHeader', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {menuitems: "=menuitems", placesearchid: "=placesearchid"},
        terminal: true,
        templateUrl: "/web/common/directives/bdsHeaderTemplate.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
                var vm = this;                
                vm.gotoMenu = function(data){
                    //$state.go('searchdc', { "tinh" : $scope.diachinh.tinhKhongDau, "huyen" : $scope.diachinh.huyenKhongDau,"xa" : $scope.diachinh.xaKhongDau,"loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat, "viewMode": vm.viewMode}, {location: true});
                    if(!data.menuType)
                        $state.go('search', { "place" : $scope.placesearchid, "loaiTin" : data.loaiTin, "loaiNhaDat" : data.loaiNhaDat }, {location: true});
                    else if(data.menuType == 1){
                        console.log("--goToPageNews---rootCatId: " + data.rootCatId);
                        $state.go('news',{"rootCatId" : data.rootCatId});
                    }
                }
                vm.onMobileMenu = function(data){
                    /*$(this).toggleClass('active');*/
                    var body = $("body");
                    var height_menu = $("#menu-left").find('.inner').height(),
                        height_device = $(window).height();
                    if(height_menu <= height_device) height_menu = height_device;
                    if(body.hasClass("show-menu")){
                        body.removeClass("show-menu").addClass('hide-menu');
                        $("#wrapper").removeAttr("style");
                    }else{
                        body.removeClass('hide-menu').addClass("show-menu");
                        $("#wrapper").css({height: height_menu});
                    }
                }
            }
        ],
        controllerAs: "hdr"
    };
    return def;
}]);