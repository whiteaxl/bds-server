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
        controller: ['socket','$scope','$rootScope', '$http', '$window','$localStorage','HouseService','jwtHelper',
        function(socket,$scope,$rootScope, $http, $window,$localStorage, HouseService,jwtHelper) {
          $scope.loginError = false;
          var vm = this;
          vm.login = true;
          vm.reset = false;
          vm.ENTER_EMAIL = 1;
          vm.ENTER_PASSWORD = 2;
          vm.LOGGED_IN = 3;
          vm.FORGOT_PASSWORD = 4;
          vm.SENT_PASSWORD = 5;
          vm.RESET_PASSWORD = 6;
          vm.state = vm.ENTER_EMAIL;
          vm.head = "Đăng nhập/Đăng ký để lưu thông tin tìm kiếm";
          vm.subHead = "";
          $scope.$bus.subscribe({
            channel: 'login',
            topic: 'logged out',
            callback: function(data, envelope) {
                vm.userExist = false;
                vm.password = "";
                $localStorage.relandToken = undefined;  
                $rootScope.userID = undefined;
                vm.changeState(vm.ENTER_EMAIL,vm.userExist);
            }
          });

          $scope.$bus.subscribe({
            channel: 'login',
            topic: 'show login',
            callback: function(data, envelope) {
                var token = data.token;
                if(token){
                  var mydecode = jwtHelper.decodeToken(token);
                  vm.resetPasswordToken = token;
                  vm.resetUserID = mydecode.userID;
                  vm.resetHead = "Xin nhập mật khẩu mới"
                  vm.reset = true;
                  vm.login = false;
                  vm.state = vm.RESET_PASSWORD;
                }else{
                  vm.state = vm.ENTER_EMAIL;
                  vm.userExist = false;
                  vm.password = "";
                  $localStorage.relandToken = undefined;  
                  vm.head = data.label;
                  vm.subHead = "";  
                }                
                $('#box-login').fadeIn(500);
            }
          });


          vm.exitLoginBox = function($event){
            if($event.target.id == "box-login"){
              vm.userExist = false;
              vm.changeState(vm.ENTER_EMAIL,false);
            }
          }
          vm.forgotPassword = function(){
            vm.changeState(vm.FORGOT_PASSWORD);
          }

          vm.changeState = function(state,userExist){
            vm.state = state;
            if(state == vm.FORGOT_PASSWORD){
              vm.head  = "Quên mật khẩu?";
              vm.subHead = "Hãy nhập email, Reland sẽ gửi mật khẩu tới email";
            }
            if(vm.state == vm.SENT_PASSWORD){
              vm.subHead = "Reland đã gửi mật khẩu tới email của bạn. Hãy kiểm tra và nhập mật khẩu mới để đăng nhập";
            }
            if(vm.state == vm.ENTER_EMAIL){
              vm.head = "Đăng nhập/Đăng ký để lưu thông tin tìm kiếm";
              vm.subHead = "";
            }
            if(vm.state == vm.ENTER_PASSWORD){
              vm.head = "Đăng nhập/Đăng ký để lưu thông tin tìm kiếm";
              if(userExist == true)
                vm.head = "Chào mừng bạn quay lại với Reland. Xin nhập mật khẩu";
              else if(userExist == false)
                vm.head = "Tạo mật khẩu";
            }

          }


          vm.signin = function(){
            var loginForm = $('#form-login');
              var data = {
                email: vm.email,
                matKhau: vm.password
              }
              if (loginForm.valid()) {
                if(vm.state == vm.RESET_PASSWORD){
                  HouseService.resetPassword({token: vm.resetPasswordToken,pass: vm.resetPassword}).then(function(resp){
                    if(resp.data.success == true){
                      //need to auto login here
                      HouseService.login({userID: vm.resetUserID, matKhau: vm.resetPassword}).then(function(res){
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
                          vm.state = vm.LOGGED_IN;
                          vm.userExist = false;
                          vm.password = "";
                          socket.emit('new user',{email: $rootScope.userEmail, userID:  $rootScope.userID, username : $rootScope.userName, userAvatar : undefined},function(data){
                            console.log("register socket user " + $rootScope.userName);
                          });
                          $('#box-login').hide();
                        }else{
                          //alert(res.data.message);
                          vm.head = res.data.message;
                        }                    
                      });
                    }else{
                      alert(resp.data.msg);
                    }
                  });
                }else if(vm.state == vm.FORGOT_PASSWORD){
                  HouseService.forgotPassword({
                    email: vm.email,
                    newPass: vm.password
                  }).then(function(res){                               
                    vm.changeState(vm.SENT_PASSWORD);
                  });
                } else if(vm.state == vm.ENTER_EMAIL){
                  HouseService.checkUserExist(data).then(function(res){
                    vm.userExist = res.data.exist;
                    vm.changeState(vm.ENTER_PASSWORD,vm.userExist);
                  });
                } else if(vm.state == vm.ENTER_PASSWORD || vm.state == vm.SENT_PASSWORD){
                  if(vm.userExist==true){//sign in
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
                        vm.state = vm.LOGGED_IN;
                        vm.userExist = false;
                        vm.password = "";
                        socket.emit('new user',{email: $rootScope.userEmail, userID:  $rootScope.userID, username : $rootScope.userName, userAvatar : undefined},function(data){
                          console.log("register socket user " + $rootScope.userName);
                        });
                        $('#box-login').hide();
                      }else{
                        //alert(res.data.message);
                        vm.head = res.data.message;
                      }                    
                    });
                  }else{//register
                    HouseService.signup(data).then(function(res){
                      $localStorage.relandToken = res.data.token;
                      $rootScope.userName = res.data.userName;
                      vm.class = "has-sub";
                      vm.state = vm.LOGGED_IN;
                      socket.emit('new user',{email: $rootScope.userEmail, userID:  $rootScope.userID, name : $rootScope.userName, userAvatar : undefined},function(data){
                          console.log("register socket user " + $rootScope.userName);
                      });
                      $('#box-login').hide();
                    });
                  }

                }
              }
          }

          var formLogin = $("#form-login");
          // $("#form-login").validate();
          // if(formLogin.validate){
            formLogin.validate({
              rules: {
                email: {
                  required: true,
                  email: true
                },
                password: {
                  required: true
                },
                passwordConfirm: {
                  required: function(element){
                    var pass = $("#form-login [name = 'password']").val();
                    var passConfirm = element.value;
                    if(pass){
                      return !(pass == passConfirm);
                    }else
                      return false;
                  }
                }                
              },
              messages: {
                email: {
                  required: 'Xin nhập email1',
                  email: 'Email không hợp lệ'
                },
                password: {
                  required: 'Xin nhập mật khẩu'
                },
                passwordConfirm: {
                  required: 'Mật khẩu không khớp',
                }
              }
            });    
          // }


        }
        ],
        controllerAs: 'lc',
      }
    }
    ]);