(function(){
    'use strict';
    var controllerId = 'NewsDetailCtrl';
    angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, $sce, NewsService, $window) {
        var vm = this;
        $scope.rootCatId = $state.params.rootCatId;
        $scope.articleId = $state.params.articleId;
        $scope.article = null;
        console.log("----------newsDetail: " +$scope.rootCatId + "----" + $scope.articleId);
        initNewsDetail();

        vm.goDetail = function(articleId){
            $state.go('newsDetail', { "rootCatId" : $scope.rootCatId, "articleId" : articleId}, {location: true});
        }

        function initNewsDetail() {
            console.log("---------------------initNews ---------------catId: " + $scope.articleId);
            var data = {
                catId: $scope.rootCatId,
                articleId: $scope.articleId
            };

            NewsService.increaseRating(data).then(function (res) {
                console.log("------NewsService.increaseRating-----");
            });

            NewsService.findNewsDetail(data).then(function (res) {
                console.log("------newsDetailCtrl.findNewsDetail-----");
                if (res.data.article) {
                    $scope.article = res.data.article;
                }
                //console.log($scope.article);
                console.log("----newsDetailCtrl.findNewsDetail finished ");
            });
            NewsService.findHightestArticle(data).then(function (res) {
                console.log("------newsDetailCtrl.findHightestArticle-----");
                if(res.data.list){
                    if(res.data.length > 0){
                        $scope.hightestArticles = [];
                        for (var i = 1; i < res.data.length; i++) {
                            $scope.hightestArticles.push(res.data.list[i]);
                        }
                    }
                }
                console.log($scope.article);
                console.log("----newsDetailCtrl.findHightestArticle finished ");
            });
            NewsService.findHotArticle(data).then(function (res) {
                console.log("------newsDetailCtrl.findHotArticle-----");
                if(res.data.list){
                    if(res.data.length > 0){
                        $scope.defaultHotArticle = res.data.list[0];
                        if(res.data.length > 1){
                            $scope.hotArticles = [];
                            for (var i = 1; i < res.data.length; i++) {
                                $scope.hotArticles.push(res.data.list[i]);
                            }
                        }
                    }
                }
                console.log($scope.article);
                console.log("----newsDetailCtrl.findHotArticle finished ");
            });
        }
    })
})();