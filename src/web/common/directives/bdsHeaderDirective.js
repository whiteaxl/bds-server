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
            }
        ],
        controllerAs: "hdr"
    };
    return def;
}]);