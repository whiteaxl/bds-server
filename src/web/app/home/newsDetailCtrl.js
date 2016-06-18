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

        function initNewsDetail() {
            console.log("---------------------initNews ---------------catId: " + $scope.articleId);
            var data = {
                articleId: $scope.articleId
            };

            NewsService.findNewsDetail(data).then(function (res) {
                console.log("------NewsService.findNewsDetail-----");
                if (res.data.article) {
                    $scope.article = res.data.article;
                }
                console.log($scope.article);
                console.log("----NewsService.findNewsDetail finished ");
            });
        }
    })
})();