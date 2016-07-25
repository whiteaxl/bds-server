angular.module('bds').directive('bdsAdsBoxList', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {cat: "=cat", view_mode: "=view_mode", more: "=more", header: "=header"},
        terminal: true,
        templateUrl: "/web/common/directives/ads-box-list.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
                var vm = this;     
                vm.cat = $scope.cat;  
                vm.more = $scope.more;
                vm.header = $scope.header;
                vm.goDetail = function(index){
                    var item = vm.cat.list[index];
                    if(item.type == "Ads"){
                        $state.go('detail', { "adsID" : item.adsID}, {location: true});
                    }else if(item.type=="DuAn"){

                    }
                }     
                vm.getClass = function(i){
                    // alert('aaaa');
                    var colArr = ["col col-40", "col col-35", "col col-25"];
                    var reverse = false;    
                    var j = Math.floor(i/3);
                    if(j==0){
                        return colArr[i%3];
                    }else if(j==1){
                        return colArr[((i%3)+1)%3];
                    }else {
                        return colArr[((i%3)+2)%3];
                    }
                    /*var reverse = false;  
                    var j = Math.floor(i/2);

                    if(i%2==0){
                        if(j%2==0)                  
                            return "col col-40";
                        else
                            return "col col-60";
                    }else{
                        if(j%2==0)                  
                            return "col col-60";
                        else
                            return "col col-40";    
                    }*/
                }
                $scope.$on("$destroy", function () {
                    // alert("OMG! You are killing me");
                });
            }

        ],
        controllerAs: "abl"
    };
    return def;
}]);