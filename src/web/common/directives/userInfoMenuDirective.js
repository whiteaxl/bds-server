angular.module('bds')
.directive("userInfoMenu", [
  function() {
    return {
      restrict: 'E',
      scope: {},
        templateUrl: "/web/common/directives/userInfoMenuTemplate.html",
        replace: 'true',
        controller: ['socket','$scope','$state','$rootScope', '$http', '$window','$localStorage','HouseService',
        function(socket,$scope, $state, $rootScope, $http, $window,$localStorage, HouseService) {
          $scope.loginError = false;
          var vm = this;
          vm.profile = function() {
            $state.go('profile', { userID: $rootScope.userID}, {location: true});
          }
          vm.signout = function(){
          	$localStorage.relandToken = undefined;
          	$rootScope.userName = undefined;
            $scope.$bus.publish({
              channel: 'login',
              topic: 'logged out',
              data: {}
            });
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