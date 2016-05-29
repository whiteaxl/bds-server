angular.module('bds')
.directive("userInfoMenu", [
  function() {
    return {
      restrict: 'E',
      scope: {},
        templateUrl: "/web/common/directives/userInfoMenuTemplate.html",
        replace: 'true',
        controller: ['$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
        function($scope, $rootScope, $http, $window,$localStorage, HouseService) {
          $scope.loginError = false;
          let vm = this;
          vm.profile = function() {
            alert("todo");
          }
          vm.signout = function(){
          	$localStorage.relandToken = undefined;
          	$rootScope.userName = undefined;
          }
        }
        ],
        controllerAs: 'uim',
      }
    }
    ]);