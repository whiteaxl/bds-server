'use strict';
angular.module('bds')
.directive("loginForm", [
  function() {
    return {
      restrict: 'E',
      scope: {loginbox: "=loginbox"},
        // template: '<div class="box-login" id="box-login"><div class="inner"><form action="index.html" method="post" id="form-login" novalidate><div ng-if="$root.token" class="head">Đăng nhập/Đăng ký để lưu thông tin tìm kiếm</div><div ng-if="!$root.token" class="head">Chào mừng bạn quay lại với Reland. Xin nhập mật khẩu</div><a href="#box-login" class="btn-close" data-login="close"><i class="fa fa-times"></i></a><div ng-if="$root.token" class="control"><input type="email" ng-model="lc.email" placeholder="Enter email address" class="form-control" name="email" required/></div><div ng-if="!$root.token" class="control"><input type="password" ng-model="lc.password" class="form-control" required> </input></div><div class="handle"><button type="button" ng-click="lc.signin();" class="btn-login">Đăng nhập</button></div><div class="rule">Tôi đồng ý với các điều khoản <a href="/terms/" target="_blank">sử dụng</a> và <a href="/privacy/" target="_blank">bản quyền của Reland</a>.</div><div class="register">Bạn có phải là môi giới BĐS? <a href="/agent_signup/?redirect_url=http://www.trulia.com/"> Đăng ký tại đây.</a></div></form></div></div>',
        templateUrl: "/web/common/directives/loginTemplate.html",
        replace: 'true',
        controller: ['socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService',
        function(socket,$scope,$rootScope, $http, $window,$localStorage, HouseService) {
          $scope.loginError = false;
          angular.extend(this,{
            email: "",
            password: "",
            enterEmail: true,
            enterPassword: false,
            userExist: false,
            class: "",
            exitLoginBox: function($event){
              if($event.target.id == "box-login"){
                this.enterEmail = true;
                this.userExist = false;
                this.enterPassword = false;
                this.password = "";
                $localStorage.relandToken = undefined;  
              }
            },
            signin: function(){
              var loginForm = $('#form-login');
              var data = {
                email: this.email,
                matKhau: this.password
              }
              if (loginForm.valid()) {
                // If the form is invalid, submit it. The form won't actually submit;
                var vm = this;
                if(this.enterEmail == true){
                  HouseService.checkUserExist(data).then(function(res){
                    vm.userExist = res.data.exist;
                    vm.enterPassword = true;
                    vm.enterEmail = false;  
                  });
                } else if(this.enterPassword == true){
                  if(this.userExist==true){//sign in
                    HouseService.login(data).then(function(res){
                      if(res.data.login==true){
                        //alert("signin with email " + $scope.email + " password " + this.password + " and token: " + res.data.token);  
                        //$window.token = res.data.token;
                        $localStorage.relandToken = res.data.token;
                        $rootScope.userName = res.data.userName;
                        $rootScope.userID = res.data.userID;
                        //hung dummy here to set userID to email so we can test chat
                        $rootScope.userID = res.data.email;
                        $rootScope.userEmail = res.data.email;
                        vm.class = "has-sub";
                        vm.enterPassword = false;
                        vm.enterEmail = true;  
                        vm.userExist = false;
                        vm.password = "";

                        socket.emit('new user',{email: $rootScope.userEmail, userID:  $rootScope.userID, username : $rootScope.userName, userAvatar : undefined},function(data){
                          console.log("register socket user " + $rootScope.userName);
                        });
                        $('#box-login').hide();
                      }else{
                        alert(res.data.message);
                      }                    
                    });
                  }else{//register
                    HouseService.signup(data).then(function(res){
                      $localStorage.relandToken = res.data.token;
                      $rootScope.userName = res.data.userName;
                      vm.class = "has-sub";
                      socket.emit('new user',{email: $rootScope.userEmail, userID:  $rootScope.userID, username : $rootScope.userName, userAvatar : undefined},function(data){
                          console.log("register socket user " + $rootScope.userName);
                      });
                      $('#box-login').hide();
                    });
                  }
                }
              }
            }
          });          

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


        }
        ],
        controllerAs: 'lc',
      }
    }
    ]);