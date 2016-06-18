angular.module('bds').directive('bdsDiaChinhLink', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {diachinh: "=diachinh", loaitin: "=loaitin", loainhadat: "=loainhadat", viewmode: "=viewmode"},
        terminal: true,
        templateUrl: "/web/common/directives/diaChinhLinkTemplate.html",
        replace: 'true',   
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
                var vm = this;
                
                vm.gotoDiachinh = function(diachinh,type){
                    if(type==1){
                        $scope.diachinh.huyenKhongDau = null;
                        $scope.diachinh.xaKhongDau = null;
                    }else if(type==2){
                        $scope.diachinh.xaKhongDau = null;
                    }
                    $state.go('searchdc', { "tinh" : $scope.diachinh.tinhKhongDau, "huyen" : $scope.diachinh.huyenKhongDau,"xa" : $scope.diachinh.xaKhongDau,"loaiTin" : $scope.loaitin, "loaiNhaDat" : $scope.loainhadat, "viewMode": vm.viewMode}, {location: true});
                }
            }
        ],
        controllerAs: "dl"
    };
    return def;
}]);