angular.module('bds')
.directive("loginForm", [
  function() {
    return {
      restrict: 'E',
      scope: {email: "=", loginbox: "="},
        // template: '<div class="box-login" id="box-login"><div class="inner"><form action="index.html" method="post" id="form-login" novalidate><div ng-if="$root.token" class="head">Đăng nhập/Đăng ký để lưu thông tin tìm kiếm</div><div ng-if="!$root.token" class="head">Chào mừng bạn quay lại với Reland. Xin nhập mật khẩu</div><a href="#box-login" class="btn-close" data-login="close"><i class="fa fa-times"></i></a><div ng-if="$root.token" class="control"><input type="email" ng-model="lc.email" placeholder="Enter email address" class="form-control" name="email" required/></div><div ng-if="!$root.token" class="control"><input type="password" ng-model="lc.password" class="form-control" required> </input></div><div class="handle"><button type="button" ng-click="lc.signin();" class="btn-login">Đăng nhập</button></div><div class="rule">Tôi đồng ý với các điều khoản <a href="/terms/" target="_blank">sử dụng</a> và <a href="/privacy/" target="_blank">bản quyền của Reland</a>.</div><div class="register">Bạn có phải là môi giới BĐS? <a href="/agent_signup/?redirect_url=http://www.trulia.com/"> Đăng ký tại đây.</a></div></form></div></div>',
        templateUrl: "/web/common/directives/loginTemplate.html",
        replace: 'true',
        controller: ['$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
        function($scope,$rootScope, $http, $window,$localStorage, HouseService) {
          $scope.loginError = false;
          vm = this;
          vm.email = "";
          vm.password = "";
          vm.enterEmail = true;
          vm.enterPassword = false;
          vm.userExist = false;
          vm.class = "";

          var formLogin = $("#form-login");
          $("#form-login").validate();
          if(formLogin.validate){
              formLogin.validate({
                  rules: {
                      email: {
                          required: true,
                          email: true
                      }
                  },
                  messages: {
                      email: {
                          required: 'Xin nhập email',
                          email: 'Email không hợp lệ'
                      }
                  }
              });    
          }


          $scope.loginbox.resetLoginBox = function(parent){
            vm.enterEmail = true;
            vm.userExist = false;
            vm.enterPassword = false;
            vm.password = "";
            $localStorage.relandToken = undefined;
          }
          vm.signin = function() {
            var loginForm = $('#form-login');
            var data = {
              email: vm.email,
              password: vm.password
            }
            if (loginForm.valid()) {
              // If the form is invalid, submit it. The form won't actually submit;
              if(vm.enterEmail == true){
                HouseService.checkUserExist(data).then(function(res){
                  vm.userExist = res.data.exist;
                  vm.enterPassword = true;
                  vm.enterEmail = false;  
                });
              } else if(vm.enterPassword == true){
                if(vm.userExist==true){//sign in
                  HouseService.login(data).then(function(res){
                    if(res.data.login==true){
                      //alert("signin with email " + $scope.email + " password " + vm.password + " and token: " + res.data.token);  
                      $window.token = res.data.token;
                      $localStorage.relandToken = res.data.token;
                      $rootScope.userName = res.data.userName;
                      vm.class = "has-sub";

                      $('#box-login').click();
                    }else{
                      alert(res.data.message);
                    }                    
                  });
                }else{//register
                  HouseService.signup(data).then(function(res){
                    alert("register with email " + $scope.email + " password " + vm.password);
                  });
                }
              }
            }
          }
        }
        ],
        controllerAs: 'lc',
      }
    }
    ]);