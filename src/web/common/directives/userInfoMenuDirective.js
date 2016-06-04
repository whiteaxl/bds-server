angular.module('bds')
.directive("userInfoMenu", [
  function() {
    return {
      restrict: 'E',
      scope: {},
        templateUrl: "/web/common/directives/userInfoMenuTemplate.html",
        replace: 'true',
        controller: ['socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
        function(socket,$scope, $rootScope, $http, $window,$localStorage, HouseService) {
          $scope.loginError = false;
          let vm = this;
          vm.profile = function() {
            alert("todo");
          }
          vm.signout = function(){
          	$localStorage.relandToken = undefined;
          	$rootScope.userName = undefined;
            socket.emit('user leave',{email: $rootScope.userEmail, userID:  $rootScope.userID, username : $rootScope.userName, userAvatar : undefined},function(data){
                console.log("disconect socket user " + $rootScope.userName);
            });
          }
        }
        ],
        controllerAs: 'uim',
      }
    }
    ]);