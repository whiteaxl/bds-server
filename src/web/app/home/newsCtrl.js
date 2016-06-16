(function(){
    'use strict';
    var controllerId = 'NewsCtrl';
    angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, $sce, NewsService, $window) {
        var vm = this;
        $scope.rootCatId = $state.params.rootCatId;
        $scope.listArticle = [];
        vm.totalResultCounts = 0;
        vm.currentPage = 0;
        vm.lastPageNo = 0;
        vm.startPageNo = 0;
        vm.pageSize = 8;
        vm.searchData = {
            "catId": $scope.rootCatId,
            "pageNo": 1,
            "pageSize": vm.pageSize
        }
        initNews();
        vm.formatHtml = function(doc){
            if(doc)
                return $sce.trustAsHtml(doc);
        }

        //$scope.trustAsHtml1 = $sce.trustAsHtml("<span style='background-color: rgb(255, 255, 255)'>6 điều cần cân nhắc trước khi mua nhà</span>");
        //$scope.trustAsHtml = $sce.trustAsHtml("&lt;span style=&quot;background-color: rgb(255, 255, 255);&quot;&gt;6 điều cần cân nhắc trước khi mua nhà&lt;/span&gt;");

        function initNews() {
            console.log("---------------------initNews1 ---------------catId: " + $scope.rootCatId);
            var data = {
                catId: $scope.rootCatId
            };
            NewsService.countNews(data).then(function(res){
                console.log(res.data.countArticle);
                vm.totalResultCounts = res.data.countArticle;
                if(vm.totalResultCounts>0){
                    vm.currentPage = 1;
                    vm.lastPageNo = Math.ceil(vm.totalResultCounts/vm.pageSize);
                    vm.currentPageStart = 1;
                    vm.currentPageEnd = (vm.totalResultCounts >= vm.pageSize?vm.pageSize-1: vm.totalResultCounts-1);

                } else{
                    vm.currentPage = 0;
                    vm.lastPageNo = 0;
                    vm.startPageNo = 0;
                }
                vm.searchPage(1);
            });
            /*
            NewsService.findNews(data).then(function(res){
                console.log(res.data.list);
                if(res.data.list){
                    for (var i = 0; i < res.data.length; i++) {
                        $scope.listArticle.push(res.data.list[i]);
                    }
                }
                for (var i = 0; i < res.data.length; i++) {
                    console.log($scope.listArticle[i]);
                }
                console.log("---------listArticle: " + $scope.listArticle.length);
                console.log("NewsService.findNews finished ");
            });*/
        }

        vm.firstPage = function(callback){
            vm.searchPage(1);
        }
        vm.nextPage = function(callback){
            vm.searchPage(vm.currentPage+1);
        }
        vm.lastPage = function(callback){
            vm.searchPage(vm.lastPageNo);
        }
        vm.previousPage = function(callback){
            vm.searchPage(vm.currentPage-1);
        }

        vm.searchPage = function(i){
            vm.searchData.pageNo = i;
            NewsService.findNews(vm.searchData).then(function(res){
                console.log(res.data.list);
                if(res.data.list){
                    $scope.listArticle = [];
                    for (var i = 0; i < res.data.length; i++) {
                        $scope.listArticle.push(res.data.list[i]);
                    }
                }
                for (var i = 0; i < res.data.length; i++) {
                    console.log($scope.listArticle[i]);
                }
                console.log("---------listArticle: " + $scope.listArticle.length);

                vm.currentPageStart = vm.pageSize*(vm.searchData.pageNo-1) + 1
                vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
                vm.currentPage = vm.searchData.pageNo;
                console.log("NewsService.findNews finished ");
            });
        }
    })
})();