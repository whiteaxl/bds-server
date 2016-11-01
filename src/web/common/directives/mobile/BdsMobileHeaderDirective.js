angular.module('bds').directive('bdsMobileHeader', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {},
        terminal: true,
        templateUrl: "/web/common/directives/mobile/bds-mobile-header.tpl.html",
        replace: 'true',
        controller: ['$state','socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
            function($state,socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
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
                vm.searchfr = function(){
                    $(".search").removeAttr("style");
                    $(".search_mobile").find("i").removeClass("iconCancel").addClass("iconSearch");
                    $("body").removeClass("bodyNavShow");
                    $(".search-footer").removeClass("fixed");
                    $(".search-btn").css("display","none");
                    vm.reset();
                }                     
                vm.reset =function(){
                    $(".btn-more").removeAttr("style");
                    $(".more-box").addClass("more-box-hide");
                    $(".spinner").addClass("spinner-hide");
                    $(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
                    $(".btn-group .btn").removeClass("active");
                    $(".btn-group .btn:first-child").addClass("active");
                }         
                vm.toggleFilter = function(){

                    if($(".search_mobile").find("i").hasClass("iconSearch")){
                        if($(".post").css("right")=="0px"){
                            $scope.isPostPage = true;
                            vm.exitPost();
                        }
                        $(".search").animate({
                            right: 0
                        }, 120);
                        $(".search_mobile").find("i").removeClass("iconSearch").addClass("iconCancel");
                        //$("body").addClass("bodyNavShow");
                        $(".search").scrollTop(0);
                        $(".search-footer").addClass("fixed");
                        $(".search-btn").css("display","block");
                    }else{
                        if($scope.isPostPage){
                            vm.openPost();
                        }
                        $scope.isPostPage = false;
                        vm.searchfr();
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

            }
        ],
        controllerAs: "mhdr"
    };
    return def;
}]);