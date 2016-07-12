(function() {
	'use strict';
	var controllerId = 'DetailCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window,$timeout){
		var vm = this;
		vm.viewMap = false;
		$scope.chat_visible = true;
		vm.likeAdsClass ="fa-heart-o";
		$scope.$on('$viewContentLoaded', function(){
			$timeout(function() {
				window.DesignCommon.adjustPage();				
			},0);
			if($state.current.data){
				$rootScope.bodyClass = "page-detail";
			}
		});	

		vm.marker = {
			id: 1,
			coords: {
				latitude: 	16.0439,
				longitude: 	108.199
			},
			content: undefined,
			data: 'test'
		}
		vm.center= [21.0363818591319,105.80105538518103];

		vm.diaChinh=  {};
		

		vm.goToPageSearch = function(){
			if(vm.placeSearchId){
				$state.go('search', { "place" : vm.placeSearchId, "loaiTin" : vm.ads.loaiTin, "loaiNhaDat" : vm.ads.loaiNhaDat }, {location: true});	
			}else{
				$state.go('searchdc', { "tinh" : vm.ads.place.diaChinh.tinhKhongDau, "huyen" : vm.ads.place.diaChinh.huyenKhongDau,"loaiTin" : vm.ads.loaiTin, "loaiNhaDat" : vm.ads.loaiNhaDat, "viewMode": "map"}, {location: true});	
			}
			
			
		}



		vm.showChat = function(user){
			if(!$rootScope.user.userID){
				$scope.$bus.publish({
	              channel: 'login',
	              topic: 'show login',
	              data: {label: "Đăng nhập để chat"}
		        });
		        return;
			}
			$scope.$bus.publish({
              channel: 'chat',
              topic: 'new user',
              data: {userID: user.userID,avatar: user.avatar, name: user.name,ads: {adsID:vm.ads.adsID, title: vm.ads.title, cover: vm.ads.image.cover}}
	        });
		};
		vm.likeAds = function(adsID){
	      if(!$rootScope.user.userID){
	        $scope.$bus.publish({
              channel: 'login',
              topic: 'show login',
              data: {label: "Đăng nhập để lưu BĐS"}
	        });
	        return;
	      }
	      HouseService.likeAds({adsID: vm.adsID,userID: $rootScope.user.userID}).then(function(res){
	        //alert(res.data.msg);
	        //console.log(res);
	        if(res.data.success == true || res.data.status==1){
	        	vm.likeAdsClass ="fa-heart";
	        }
	      });
	    };
		$timeout(function() {
			$('body').scrollTop(0);
		},0);
		vm.adsID = $state.params.adsID;
		HouseService.detailAds({adsID: vm.adsID}).then(function(res){
			//console.log("res.data " + res.data.ads);
			vm.ads = res.data.ads;
			vm.marker.coords.latitude = vm.ads.place.geo.lat;
			vm.marker.coords.longitude = vm.ads.place.geo.lon;
			vm.center = [vm.ads.place.geo.lat,vm.ads.place.geo.lon];
			vm.marker.content = vm.ads.giaFmt;
			// vm.diaChinh = vm.ads.place.diaChinh;
			$scope.email = vm.ads.dangBoi.email;
			vm.ads.place.diaChinh.tinhKhongDau =  window.RewayUtil.locDau(vm.ads.place.diaChinh.tinh);
			vm.ads.place.diaChinh.huyenKhongDau =  window.RewayUtil.locDau(vm.ads.place.diaChinh.huyen);
			vm.placeSearchText = vm.ads.place.diaChinh.huyen + "," + vm.ads.place.diaChinh.tinh;
			// vm.diaChinh = {
			// 	tinh:vm.ads.place.diaChinh.tinh,
			// 	tinhKhongDau: vm.ads.place.diaChinh.tinhKhongDau,
			// 	huyen: vm.ads.place.diaChinh.huyen,
			// 	huyenKhongDau: vm.ads.place.diaChinh.huyenKhongDau,
			// 	xa: vm.ads.place.diaChinh.xa,
			// 	xaKhongDau: vm.ads.place.diaChinh.xaKhongDau
			// }				
			if($rootScope.alreadyLike(vm.ads.adsID) ==  true)
				vm.likeAdsClass ="fa-heart";
			var price_min = 0;
			var price_max = window.RewayListValue.filter_max_value.value;
			var dien_tich_min = 0;
			var dien_tich_max = window.RewayListValue.filter_max_value.value;

		
			var pageSize = 8;

			vm.name ="";
			vm.phone="";
			vm.email="";
			vm.content = "Tôi muốn tìm hiểu thêm thông tin về bất động sản này";
			vm.requestInfoClass = "btn-submit";
			vm.clearInfoRequest = function(){
				vm.name ="";
				vm.phone="";
				vm.email="";
				vm.content = "Tôi muốn tìm hiểu thêm thông tin về bất động sản này";
			}

			vm.userLoggedIn = function(){
				vm.name = $rootScope.user.userName;
	                if($rootScope.user.phone)
						vm.phone = parseInt($rootScope.user.phone);
					vm.email = $rootScope.user.userEmail;
				if(vm.ads.dangBoi.userID == $rootScope.user.userID)
					vm.showLuotXem = true;
				if(vm.ads.dangBoi.email == $rootScope.user.userEmail)
					vm.showLuotXem = true;
			}
			
			$scope.$bus.subscribe({
            	channel: 'user',
	            topic: 'logged-in',
	            callback: function(data, envelope) {
	                //console.log('add new chat box', data, envelope);
	                vm.userLoggedIn();
	            }
	        });
	        if($rootScope.isLoggedIn()){	        	
	        	vm.userLoggedIn();
	        }

			vm.requestInfo = function(){
				if($('#form-info-request').valid()){
					vm.requestInfoClass = 'btn-submit-disabled';
					HouseService.requestInfo({
						name: vm.name,
						phone: vm.phone,
						email: vm.email,
						content: vm.content,
						adsUrl: window.location.href
					}).then(function(res){
						console.log(JSON.stringify(res.data));						
						vm.requestInfoClass = 'btn-submit';
						vm.clearInfoRequest();
					});
				}				
			}
			vm.requestInfoPopup = function(){
				if($('#form-info-request-popup').valid()){
					vm.requestInfoClass = 'btn-submit-disabled';
					HouseService.requestInfo({
						name: vm.name,
						phone: vm.phone,
						email: vm.email,
						content: vm.content,
						adsUrl: window.location.href
					}).then(function(res){
						console.log(JSON.stringify(res.data));
						vm.requestInfoClass = 'btn-submit';
						vm.clearInfoRequest();
					});
				}		
			}


			vm.goDetail = function(adsID){
        		$state.go('detail', { "adsID" : adsID}, {location: true});
        	}
        	//find bds cung loai moi dang
			var searchDataCungLoai = {
				"loaiTin": vm.ads.loaiTin,
				"loaiNhaDat": vm.ads.loaiNhaDat, 
				"diaChinh": {
					tinh: vm.ads.place.diaChinh.tinhKhongDau,
					huyen: vm.ads.place.diaChinh.huyenKhongDau
				},
				"limit": pageSize,
			  	"orderBy": "ngayDangTinDESC",
			  	"pageNo": 1
			};
			
			HouseService.findAdsSpatial(searchDataCungLoai).then(function(res){
				vm.bdsCungLoaiMoiDang = [];
				for(var i=0;i<res.data.length;i++){
					if(res.data.list[i].adsID == vm.ads.adsID){

					}else if(vm.bdsCungLoaiMoiDang.length<7){
						vm.bdsCungLoaiMoiDang.push(res.data.list[i]);
					}
				}
				
			});
			//find bds ngang gia
			var searchDataNgangGia  ={
				"loaiTin": vm.ads.loaiTin,
				"diaChinh": {
					tinh: vm.ads.place.diaChinh.tinhKhongDau,
					huyen: vm.ads.place.diaChinh.huyenKhongDau
				},
				"limit": pageSize,
				"orderBy": "ngayDangTinDESC",
				"giaBETWEEN": [vm.ads.gia-0.1*vm.ads.gia,vm.ads.gia+0.1*vm.ads.gia],
			  	"pageNo": 1
			}
			
			HouseService.findAdsSpatial(searchDataNgangGia).then(function(res){
				vm.bdsNgangGia = [];
				for(var i=0;i<res.data.length;i++){
					if(res.data.list[i].adsID == vm.ads.adsID){

					}else if(vm.bdsNgangGia.length<7){
						vm.bdsNgangGia.push(res.data.list[i]);
					}
				}
				
			});
			//find bds gia nho hon
			var searchDataGiaNhoHon  ={
				"loaiTin": vm.ads.loaiTin,
				"diaChinh": {
					tinh: vm.ads.place.diaChinh.tinhKhongDau,
					huyen: vm.ads.place.diaChinh.huyenKhongDau
				},
				"limit": pageSize,
				"orderBy": "ngayDangTinDESC",
				"giaBETWEEN": [0,vm.ads.gia],
			  	"pageNo": 1
			}
			HouseService.findAdsSpatial(searchDataGiaNhoHon).then(function(res){
				vm.bdsNgangNhoHon = [];
				for(var i=0;i<res.data.length;i++){
					if(res.data.list[i].adsID == vm.ads.adsID){

					}else if(vm.bdsNgangNhoHon.length<7){
						vm.bdsNgangNhoHon.push(res.data.list[i]);
					}
				}
				
			});


		});
		vm.selectPlaceCallback = function(place){
			vm.searchPlaceSelected = place;
			vm.placeSearchId = place.place_id;
			vm.goToPageSearch();
		}


		vm.init = function(){
			NgMap.getMap().then(function(map){
	        	// $scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
	        	window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"autoComplete",map);
	        	$scope.PlacesService =  new google.maps.places.PlacesService(map);
	        	/*$scope.PlacesService.getDetails({
	        		placeId: $scope.placeId
	        	}, function(place, status) {
	        		if (status === google.maps.places.PlacesServiceStatus.OK) {
	        			$scope.searchPlaceSelected = place;
			        		//var map = $scope.map.control.getGMap();
			        		var current_bounds = map.getBounds();
			        		//$scope.map.center =  
			        		vm.center = "["+place.geometry.location.lat() +"," +place.geometry.location.lng() +"]";
			        		if(place.geometry.viewport){
			        			//map.fitBounds(place.geometry.viewport);	
			        			//$scope.map
			        		} else if( !current_bounds.contains( place.geometry.location ) ){
			        			//var new_bounds = current_bounds.extend(place.geometry.location);
			        			//map.fitBounds(new_bounds);
			        			//$digest();
			        		}
			        		$scope.$apply();
			        		//vm.search();
		        	}
		        });*/

        	});
        	vm.findDuAnHot = function(){
				HouseService.findDuAnHotByDiaChinhForDetailPage(vm.searchData).then(function(res){
					if(res.data.success==true){
						vm.listDuAnHot =  res.data.listDuAnHot;
					}			
				});
			}
			vm.findDuAnHot();
        	
        	var infoRequestRules = {
	            email: {
	              	email: true,
	              	required: function(element) {
	        			return $("#form-info-request [name = 'phone']").val()=='';
	    			}
	            },
	            name:{
	            	required: true,
	            },
	            phone: {
	            	number: true,
	            	minlength: 9,
	            	required: function(element) {
	        			return $("#form-info-request [name = 'email']").val()=='';
	    			}
	            }
	        };
	        var infoRequestMessages = {
                email: {
                  required: "Nhập số điện thoại hoặc email",
                  email: 'Email không hợp lệ'
                },
                phone: {
                   	number:  'Số điện thoại không hợp lệ',
                    minlength: 'Số điện thoại ít nhất 9 ký tự',
                    required: "Nhập số điện thoại hoặc email"
                },
                name: {
                  required: 'Xin nhập họ tên'
                }
            };

        	var formRequest = $('#form-info-request');
            formRequest.validate({
              rules: infoRequestRules,
              messages: infoRequestMessages
            });  
            formRequest = $('#form-info-request-popup');
            formRequest.validate({
              rules: infoRequestRules,
              messages: infoRequestMessages
            });      
		}

		vm.init();

		vm.showPopupImage = function(e){
			e.preventDefault();
            $('#box-popup').fadeIn(500, function(){
                $('#total').html(vm.getSlider().getSlideCount());
                vm.getSlider().reloadSlider();
                vm.getSlider().goToSlide(0);
            })
		}
		vm.hidePopup = function(e){
			e.preventDefault();            
            $('#box-popup').fadeOut(500, function(){
                vm.getSlider().destroySlider();
            })
		}
		vm.showPopupRequestForm = true;
		vm.toggleContactPopup = function(e){
			e.preventDefault();
            var target = $(e.target).attr('href'),
                text = $(e.target).text(),
                change = $(e.target).data('toggle-text');
            $('#box-popup').toggleClass('open');
            vm.showPopupRequestForm = !vm.showPopupRequestForm;
            //$(this).data('toggle-text', text).html('<i class="fa fa-angle-right"></i> ' + change).attr('title', change);
            vm.getSlider().reloadSlider();
		}

		vm.getSlider = function(){
            if(vm.slider)
                return vm.slider;
            var slider_popup = $('#slider-popup');
            vm.slider = slider_popup.bxSlider({
                //mode: 'fade',
                preloadImages: 'visible',
                auto: false,
                speed: 1000,
                autoHover: true,
                pause: 5000,
                pager: false,
                minSlides: 1,
                maxSlides: 1,
                controls: true,
                onSliderLoad: function(currentIndex){
                    $('#count').html(currentIndex + 1);
                },
                onSlideAfter: function($slideElement, oldIndex, newIndex){
                    $('#count').html(newIndex + 1);
                }
            });
            return vm.slider;
        }

	});

})();