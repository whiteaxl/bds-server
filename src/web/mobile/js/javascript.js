function update(){
	$wh = $(window).height();
	$ww = $(window).width();
	
	$(".modal-body").height($wh-46);
	$(".search").height($wh);
	
	if($(".input-fr").val().length>0) {
		$(".close-search").show();
		$(".input-fr").css("width", $ww-78);
	}else{
		$(".close-search").removeAttr("style");
		$(".input-fr").removeAttr("style");
	}
}

function reset(){
	$(".btn-more").removeAttr("style");
	$(".more-box").addClass("more-box-hide");
	$(".spinner").addClass("spinner-hide");
	$(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
	$(".btn-group .btn").removeClass("active");
	$(".btn-group .btn:first-child").addClass("active");
}

function searchfr(){
	$(".search").removeAttr("style");
	$(".search_mobile").find("i").removeClass("iconCancel").addClass("iconSearch");
	$("body").removeClass("bodyNavShow");
	$(".search-footer").removeClass("fixed");
	reset();
}

function spinner(me, box, item){
	if($(me).parent().find($(box)).hasClass(item)) {
		$(me).parent().find($(box)).removeClass(item);
		$(me).find("i").addClass("iconUpOpen").removeClass("iconDownOpen");
	}
	else {
		$(me).parent().find($(box)).addClass(item);
		$(me).find("i").addClass("iconDownOpen").removeClass("iconUpOpen");
	}
}


$(function(){
	$ww = $(window).width();
	
	 update();
	 $(window).resize(function(){
		 update();	 
	});
	
	$(".nav_mobile").click(function(){
		$(".overlay").show();
		$(this).find("i").removeClass("iconMenu").addClass("iconLeftOpen");
		$("body").addClass("bodyNavShow").animate({
        	left: 270
        }, 120);
		$("nav.main").animate({
        	left: 0
        }, 120);
	});
	$(".overlay").click(function(){
		$(this).removeAttr("style");
		$(".nav_mobile").find("i").removeClass("iconLeftOpen").addClass("iconMenu");
		$("body").removeClass("bodyNavShow").removeAttr("style");
		$("nav.main").removeAttr("style");
	});
	
	$(".search_mobile").click(function(){
		if($(this).find("i").hasClass("iconSearch")){
			$(".search").animate({
				right: 0
			}, 120);
			$(".search_mobile").find("i").removeClass("iconSearch").addClass("iconCancel");
			$("body").addClass("bodyNavShow");
			$(".search").scrollTop(0);
			$(".search-footer").addClass("fixed");
		}else{
			searchfr();
		}
	});
	$(".search-footer a").click(function(){
		searchfr();
	});
	
	$(".type-list li a").click(function(){
		$(".type-list li a").removeClass("active");
		$(this).addClass("active");
	});
	$("#typeBox .type-list li a").click(function(){
		$(".type-box .collapse-title span label").html($(this).html());
	});
	$("#trendBox .type-list li a").click(function(){
		$(".trend-box .collapse-title span label").html($(this).html());
	});
	
	$(".btn-more .collapse-title").click(function(){
		$(this).parent().hide();
		$(".more-box").removeClass("more-box-hide");
	});
	$(".btn-reset .collapse-title").click(function(){
		reset();
	});
	
	$(".input-fr").keyup(function(){
		if($(this).val().length>0) {
			$(".close-search").show();
			$(this).css("width", $ww-78);
		}else{
			$(".close-search").removeAttr("style");
			$(".input-fr").removeAttr("style");
		}
	});
	$(".close-search").click(function(){
		$(this).removeAttr("style");
		$(".input-fr").removeAttr("style").val("");
	});
	
	/*var searchadd = [
      {
        diadiem: "CT1B1 - KDT Xa La",
		diadiemlbl: "Địa điểm",
		diadiemicon: "iconLocation gray",
        label: "Hà Đông",
		quanlbl: "Quận",
		quanicon: "iconStar red",
        tinh: "Hà Nội",
		tinhlbl: "Tỉnh",
		tinhicon: "iconStar red"
      },
      {
        diadiem: "CT1B1 - KDT Dương Nội",
		diadiemlbl: "Địa điểm",
		diadiemicon: "iconLocation gray",
        label: "Hà Đông",
		quanlbl: "Quận",
		quanicon: "iconStar red",
        tinh: "Hà Nội",
		tinhlbl: "Tỉnh",
		tinhicon: "iconStar red"
      },
      {
        diadiem: "CT1B1 -KDT Linh Đàm",
		diadiemlbl: "Địa điểm",
		diadiemicon: "iconLocation gray",
        label: "Hoàng Mai",
		quanlbl: "Quận",
		quanicon: "iconStar red",
        tinh: "Hà Nội",
		tinhlbl: "Tỉnh",
		tinhicon: "iconStar red"
      },
    ];
	$("#searchadd").autocomplete({
      minLength: 0,
      source: searchadd,
      focus: function( event, ui ) {
        $( "#searchadd" ).val( ui.item.label );
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>")
        .append("<p><i class='" + item.diadiemicon + "'>" + item.diadiem + "<span>" + item.diadiemlbl + "</span></p>")
		.append("<p><i class='" + item.quanicon + "'>" + item.label + "<span>" + item.quanlbl + "</span></p>")
		.append("<p><i class='" + item.tinhicon + "'>" + item.tinh + "<span>" + item.tinhlbl + "</span></p>")
        .appendTo( ul );
    };
	*/
	Hammer.plugins.fakeMultitouch();
	$("select.drum").drum({
		onChange : function (selected) {
			if (selected.value !=0) $("#" + selected.id + "_value").html($("#"+selected.id+" option:selected").text());
		} 
	});
});