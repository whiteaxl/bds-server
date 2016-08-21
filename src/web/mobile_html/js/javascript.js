function update(){
	$wh = $(window).height();
	$ww = $(window).width();
	
	$(".modal-choose .modal-body").height($wh-46);
	$(".search, .post").height($wh);
	$(".wapper > .maps").height($wh-42);
		
	if($(".search").find("input").hasClass("input-fr")){
		if($(".input-fr").val().length>0) {
			$(".close-search").show();
			$(".input-fr").css("width", $ww-78);
		}else{
			$(".close-search").removeAttr("style");
			$(".input-fr").removeAttr("style");
		}
	}
	
	var postimg = ($ww-20)/4 - 10;
	$(".post .postimg ul li").width(postimg).height(postimg);
	$(".post .postimg input[type=file]+label").height(postimg-2).css("line-height", postimg+"px");
}

// check click detail
function detailMore(me, a, b, c){
	if($(a).css('display') == 'none'){
		$(me).html(c);
		$(a).css("display",'inline');
	}else {
		$(me).html(b);
		$(a).css("display",'none');
	}
}

// open popup
function relandPop(box,footer){
	$(box).animate({
		right: 0
	}, 120);
	$("body").addClass("bodySearchShow");
	$(box).scrollTop(0);
	overlay(".overlay");
	if(footer) $(box+"-footer").addClass("fixed");
}
// close popup
function relandPopClose(box,footer){
	$(box).removeAttr("style");
	$("body").removeClass("bodySearchShow");
	if(footer) $(box+"-footer").removeClass("fixed");
}

//reset search
function searchreset(){
	$(".btn-more").removeAttr("style");
	$(".more-box").addClass("more-box-hide");
	$(".spinner").addClass("spinner-hide");
	$(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
	$(".btn-group .btn").removeClass("active");
	$(".btn-group .btn:first-child").addClass("active");
	$(".search input").val('');
	//$("select.drum").drum('setIndex', 1);

}
// search function
function searchfr(){
	$(".search").removeAttr("style");
	$("body").removeClass("bodySearchShow");
	searchreset();
}
// search open
function searchopen(){
	if(!$('.search_mobile').hasClass("active")){
		$(".search").animate({
			right: 0
		}, 120);
		$("body").addClass("bodySearchShow");
		$(".search").scrollTop(0);
		$(".search-footer").addClass("fixed");
		overlay(".overlay");
	}else{
		searchfr();
	}	
}

// open post
function post(){
	$(".post").animate({
		right: 0
	}, 120);
	$("body").addClass("bodySearchShow");
	$(".post").scrollTop(0);
	$(".post-footer").addClass("fixed");
	overlay(".overlay");
}
// close post
function postExit(){
	$(".post").removeAttr("style");		
	$("body").removeClass("bodySearchShow");
	$(".post-footer").removeClass("fixed");
}

// click layer overlay
function overlay(me){
	$(me).removeAttr("style");
	$(".nav_mobile").removeClass("active").find("i").removeClass("iconLeftOpen").addClass("iconMenu");
	$("body").removeClass("bodyNavShow").removeAttr("style");
	$("nav.main").removeAttr("style");
}

// function open content click title
function spinner(me, box, item){
	if($(me).parent().find($(box)).hasClass(item)) {
		$(me).parent().find($(box)).removeClass(item);
		$(me).find("i").addClass("iconUpOpen").removeClass("iconDownOpen");
		$('html, body').animate({scrollTop:$(me).offset().top-44},300);
	}
	else {
		$(me).parent().find($(box)).addClass(item);
		$(me).find("i").addClass("iconDownOpen").removeClass("iconUpOpen");
	}
}

// toggle class box click
function boxClassToggle(box, clas){
	$(box).toggleClass(clas);
}

// show toggle box click
function showhide(box){
	$(box).toggle();
}
// show hide click item box 1, box 2
function showhidebox(box1, box2){
	$(box1).hide();
	$(box2).show();
}

// show notify
function showNotify(text, box, item, itemtext){
	if(item!==null || item != "") $(item).html(itemtext);
	if(text!==null || text != "") $(".notifyBox").html(text);
	if(box!==null || box != ""){
		$(box).fadeIn(100).delay(1800).slideUp(150);
	}
	else{
		$(".notifyBox").fadeIn(100).delay(900).slideUp(150);
	}
}


$(function(){
	$ww = $(window).width();
	
	 update();
	 $(window).resize(function(){
		 update();	 
	});
	
	$(".reland-title.fixed h3").html($(".wapper .reland-box:first-child h3").html());
	$(".reland-title.fixed h4").html($(".wapper .reland-box:first-child h4").html());
	$(".reland-title.fixed h5").html($(".wapper .reland-box:first-child h5").html());
	
	// menu click icon
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
	
	// overlay click
	$(".overlay").click(function(){
		overlay(this);
	});
	
	// icon search click
	$(".search_mobile").click(function(){
		if(!$(this).hasClass("active")){
			$(".search").animate({
				right: 0
			}, 120);
			$("body").addClass("bodySearchShow");
			$(".search").scrollTop(0);
			$(".search-footer").addClass("fixed");
		}else{
			searchfr();
		}
	});
	$(".search-footer a").click(function(){
		searchfr();
	});
	
	$("header.main a").click(function(){
			$(this).toggleClass("active");
	});
	//type list click item
	$(".type-list li a, .list-sort li a").click(function(){
		$(this).parent().parent().find("a").removeClass("active");
		$(this).addClass("active");
	});
	$("#typeBox .type-list li a").click(function(){
		$(".type-box .collapse-title span label").html($(this).html());
	});
	//trend list click item
	$("#trendBox .type-list li a").click(function(){
		$(".trend-box .collapse-title span label").html($(this).html());
	});
	//project list click item
	$("#projectBox .type-list li a").click(function(){
		$(".project-box .collapse-title span label").html($(this).html());
	});
	//address list click item
	$("#addressBox .type-list li a").click(function(){
		$(".address-box .collapse-title span label").html($(this).html());
	});
	//contact list click item
	$("#contactBox .type-list li a").click(function(){
		$(".contact-box .collapse-title span label").html($(this).html());
	});
	//detail list click item
	$("#detailBox .type-list li a").click(function(){
		$(".detail-box .collapse-title span label").html($(this).html());
	});
	
	// click button more in search
	$(".btn-more .collapse-title").click(function(){
		$(this).parent().hide();
		$(this).parent().parent().find(".more-box").removeClass("more-box-hide");
	});
	// click button reset in search
	$(".btn-reset .collapse-title").click(function(){
		$(this).parent().parent().find(".btn-more").removeAttr("style");
		$(this).parent().parent().find(".more-box").addClass("more-box-hide");
		$(this).parent().parent().find(".spinner").addClass("spinner-hide");
		$(this).parent().parent().find(".spinner").parent().find(".collapse-title i").addClass("iconDownOpen").removeClass("iconUpOpen");
		$(this).parent().parent().find(".btn-group .btn").removeClass("active");
		$(this).parent().parent().find(".btn-group .btn:first-child").addClass("active");
		$(this).parent().parent().find(".search").val('');
	});
	// add class list check
	$(".list-check li a").click(function(){
		$(this).toggleClass("active");
	});
	// set active lien he in post
	$("#contactBox .contact-list li a").click(function(){
		$(this).toggleClass("active");
	});
	
	// reset value input other in post page
	$(".btn-group .btn").click(function(){
		if(!$(this).hasClass("other")) {
			$(this).parent().find("input").val('');
		}
	});
	
	// set active packet
	$(".pack-box .btn-group .btn").each(function(){
		if ($(this).hasClass("active")) $(this).parent().parent().find(".iconCheck").addClass("actived");
	});
	$(".pack-box .btn-group .btn").click(function(){
		$(".pack-box .iconCheck").removeClass("actived");
		$(".pack-box .collapse-title").removeClass("actived");
		$(this).parent().parent().find(".iconCheck").addClass("actived");
		$(this).parent().parent().find(".collapse-title").addClass("actived");
	});
	
	$(".pack-box a").click(function(){
		$(".pack-box .collapse-title").removeClass("actived");
		$(".pack-box .iconCheck").removeClass("actived");
		$(".pack-box .btn-group .btn").removeClass("active");
		$(this).parent().find(".collapse-title").addClass("actived");
		$(this).parent().find(".iconCheck").addClass("actived");
		$(this).parent().find(".btn-group .btn:nth-child(2)").addClass("active");
	});
	
	// input search click in search
	$(".input-fr").keyup(function(){
		if($(this).val().length>0) {
			$(".close-search").show();
			$(this).css("width", $ww-78);
		}else{
			$(".close-search").removeAttr("style");
			$(".input-fr").removeAttr("style");
		}
	});
	// close input search
	$(".close-search").click(function(){
		$(this).removeAttr("style");
		$(".input-fr").removeAttr("style").val("");
	});
	
	// search tabs click
	$(".search .nav-tabs li a").click(function(){
		var curr = $(this).attr("aria-controls");
		var currb = "";
		$(".search .nav-tabs li").removeClass("active");
		$(this).parent().addClass("active");
		$(".search .tab-content .tab-pane").removeClass("active");
		$(".search .tab-content .tab-pane").each(function(){
			if (curr == $(this).attr("id")) {
				currb = $(this).attr("id");
				return;
			}
		});
		$("#"+currb).addClass("active");
	});
	
	//heart click
	$(".heart").click(function(){
		$(this).find(".icon-heart").toggleClass("active");
		if($(this).find(".icon-heart").hasClass("active")){
			showNotify("Lưu tin thành công", ".heartNotify");
			return;
		}
		else{
			showNotify("Bỏ lưu tin thành công", ".heartNotify");
			return;
		}
	});

	// post tabs click
	$(".post-box .nav-tabs li a").click(function(){
		var curr = $(this).attr("aria-controls");
		var currb = "";
		$(".post-box .nav-tabs li").removeClass("active");
		$(this).parent().addClass("active");
		$(".post-box .tab-content .tab-pane").removeClass("active");
		$(".post-box .tab-content .tab-pane").each(function(){
			if (curr == $(this).attr("id")) {
				currb = $(this).attr("id");
				return;
			}
		});
		$("#"+currb).addClass("active");
	});
	
	// get numb title
	var box = 0;
	var tfix = $(".reland-title.fixed");
	$(".wapper .reland-box").each(function() {
		box++
	})
	// set title text for window scroll
	$(window).scroll(function (event) {
        event.stopPropagation();
        windowPos = $(window).scrollTop();
		if($(".reland-title").hasClass("fixed")){
			for(var i=1; i<=box; i++){
				var items = $(".wapper .reland-box_"+i);
				var pos = items.offset().top-120;
				var hg = items.height();
				
				if (windowPos >= pos && windowPos < (pos + hg)) {
					tfix.show();
					tfix.find("h3").html(items.find("h3").html());
					tfix.find("h4").html(items.find("h4").html());
					tfix.find("h5").html(items.find("h5").html());
				}
			}
			$(".wapper .reland-box").each(function() {
				var curr = "."+$(this).attr("reland-item");
				if ($(curr).offset().top < windowPos && $(curr).offset().top + $(curr).height()-40 > windowPos){
					if(windowPos > $(curr).find(".btn-box").offset().top-124)	
						tfix.hide();
				}
			});
		}
		if($("div").hasClass("detail-page")){
			if(windowPos > 300) $("header.main").removeClass("gradient").addClass("blue");
			else  $("header.main").removeClass("blue").addClass("gradient");
		}
	});
	
	// picker scroll
	Hammer.plugins.fakeMultitouch();
	$("select.drum").drum({
		onChange : function (selected) {
			if (selected.value !=0) $("#" + selected.id + "_value").html($("#"+selected.id+" option:selected").text());
		},
		setIndex:function(index){
			console.log(index);
		}
	});
	
	// setting toggle
	$('.toggle').toggles({on:false});
	$('.toggle.on').toggles({on:true});
});

// create chart
;(function($, undefined) {
  $.fn.drawDoughnutChart = function(data, options) {
    var $this = this,
      W = $this.width(),
      H = $this.height(),
      centerX = W/2,
      centerY = H/2,
      cos = Math.cos,
      sin = Math.sin,
      PI = Math.PI,
      settings = $.extend({
        segmentShowStroke : false,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 1,
        baseColor: "rgba(0,0,0,0)",
        baseOffset: 1,
        edgeOffset : 0,//offset from edge of $this
        percentageInnerCutout : 75,
        animation : true,
        animationSteps : 90,
        animationEasing : "easeInOutExpo",
        animateRotate : true,
        tipOffsetX: -8,
        tipOffsetY: -45,
        tipClass: "doughnutTip",
        summaryClass: "doughnutSummary",
        summaryTitle: "Tổng tài khoản",
        summaryTitleClass: "doughnutSummaryTitle",
        summaryNumberClass: "doughnutSummaryNumber",
        beforeDraw: function() {  },
        afterDrawed : function() {  },
        onPathEnter : function(e,data) {  },
        onPathLeave : function(e,data) {  }
      }, options),
      animationOptions = {
        linear : function (t) {
          return t;
        },
        easeInOutExpo: function (t) {
          var v = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
          return (v>1) ? 1 : v;
        }
      },
      requestAnimFrame = function() {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 6);
          };
      }();

    settings.beforeDraw.call($this);

    var $svg = $('<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo($this),
        $paths = [],
        easingFunction = animationOptions[settings.animationEasing],
        doughnutRadius = Min([H / 2,W / 2]) - settings.edgeOffset,
        cutoutRadius = doughnutRadius * (settings.percentageInnerCutout / 100),
        segmentTotal = 0;

    //Draw base doughnut
    var baseDoughnutRadius = doughnutRadius + settings.baseOffset,
        baseCutoutRadius = cutoutRadius - settings.baseOffset;
    $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
      .attr({
        "d": getHollowCirclePath(baseDoughnutRadius, baseCutoutRadius),
        "fill": settings.baseColor
      })
      .appendTo($svg);

    //Set up pie segments wrapper
    var $pathGroup = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
    $pathGroup.attr({opacity: 0}).appendTo($svg);

    //Set up tooltip
    var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
        tipW = $tip.width(),
        tipH = $tip.height();

    //Set up center text area
    var summarySize = (cutoutRadius - (doughnutRadius - cutoutRadius)) * 2,
        $summary = $('<div class="' + settings.summaryClass + '" />')
                   .appendTo($this)
                   .css({ 
                     width: summarySize + "px",
                     height: summarySize + "px",
                     "margin-left": -(summarySize / 2) + "px",
                     "margin-top": -(summarySize / 2) + "px"
                   });
   
    var $summaryNumber = $('<p class="' + settings.summaryNumberClass + '"></p>').appendTo($summary).css({opacity: 0});
     var $summaryTitle = $('<p class="' + settings.summaryTitleClass + '">' + settings.summaryTitle + '</p>').appendTo($summary);

    for (var i = 0, len = data.length; i < len; i++) {
      segmentTotal += data[i].value;
      $paths[i] = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
        .attr({
          "stroke-width": settings.segmentStrokeWidth,
          "stroke": settings.segmentStrokeColor,
          "fill": data[i].color,
          "data-order": i
        })
        .appendTo($pathGroup)
        .on("mouseenter", pathMouseEnter)
        .on("mouseleave", pathMouseLeave)
        .on("mousemove", pathMouseMove);
    }

    //Animation start
    animationLoop(drawPieSegments);

    //Functions
    function getHollowCirclePath(doughnutRadius, cutoutRadius) {
        //Calculate values for the path.
        //We needn't calculate startRadius, segmentAngle and endRadius, because base doughnut doesn't animate.
        var startRadius = -1.570,// -Math.PI/2
            segmentAngle = 6.2831,// 1 * ((99.9999/100) * (PI*2)),
            endRadius = 4.7131,// startRadius + segmentAngle
            startX = centerX + cos(startRadius) * doughnutRadius,
            startY = centerY + sin(startRadius) * doughnutRadius,
            endX2 = centerX + cos(startRadius) * cutoutRadius,
            endY2 = centerY + sin(startRadius) * cutoutRadius,
            endX = centerX + cos(endRadius) * doughnutRadius,
            endY = centerY + sin(endRadius) * doughnutRadius,
            startX2 = centerX + cos(endRadius) * cutoutRadius,
            startY2 = centerY + sin(endRadius) * cutoutRadius;
        var cmd = [
          'M', startX, startY,
          'A', doughnutRadius, doughnutRadius, 0, 1, 1, endX, endY,//Draw outer circle
          'Z',//Close path
          'M', startX2, startY2,//Move pointer
          'A', cutoutRadius, cutoutRadius, 0, 1, 0, endX2, endY2,//Draw inner circle
          'Z'
        ];
        cmd = cmd.join(' ');
        return cmd;
    };
    function pathMouseEnter(e) {
      var order = $(this).data().order;
      $tip.text(data[order].title + ": " + data[order].value)
          .fadeIn(200);
      settings.onPathEnter.apply($(this),[e,data]);
    }
    function pathMouseLeave(e) {
      $tip.hide();
      settings.onPathLeave.apply($(this),[e,data]);
    }
    function pathMouseMove(e) {
      $tip.fadeIn(200).css({
        top: e.pageY + settings.tipOffsetY,
        left: e.pageX - $tip.width() / 2 + settings.tipOffsetX
      });
    }
    function drawPieSegments (animationDecimal) {
      var startRadius = -PI / 2,//-90 degree
          rotateAnimation = 1;
      if (settings.animation && settings.animateRotate) rotateAnimation = animationDecimal;//count up between0~1

      drawDoughnutText(animationDecimal, segmentTotal);

      $pathGroup.attr("opacity", animationDecimal);

      //If data have only one value, we draw hollow circle(#1).
      if (data.length === 1 && (4.7122 < (rotateAnimation * ((data[0].value / segmentTotal) * (PI * 2)) + startRadius))) {
        $paths[0].attr("d", getHollowCirclePath(doughnutRadius, cutoutRadius));
        return;
      }
      for (var i = 0, len = data.length; i < len; i++) {
        var segmentAngle = rotateAnimation * ((data[i].value / segmentTotal) * (PI * 2)),
            endRadius = startRadius + segmentAngle,
            largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
            startX = centerX + cos(startRadius) * doughnutRadius,
            startY = centerY + sin(startRadius) * doughnutRadius,
            endX2 = centerX + cos(startRadius) * cutoutRadius,
            endY2 = centerY + sin(startRadius) * cutoutRadius,
            endX = centerX + cos(endRadius) * doughnutRadius,
            endY = centerY + sin(endRadius) * doughnutRadius,
            startX2 = centerX + cos(endRadius) * cutoutRadius,
            startY2 = centerY + sin(endRadius) * cutoutRadius;
        var cmd = [
          'M', startX, startY,//Move pointer
          'A', doughnutRadius, doughnutRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
          'L', startX2, startY2,//Draw line path(this line connects outer and innner arc paths)
          'A', cutoutRadius, cutoutRadius, 0, largeArc, 0, endX2, endY2,//Draw inner arc path
          'Z'//Cloth path
        ];
        $paths[i].attr("d", cmd.join(' '));
        startRadius += segmentAngle;
      }
    }
    function drawDoughnutText(animationDecimal, segmentTotal) {
      $summaryNumber
        .css({opacity: animationDecimal})
        .text((segmentTotal * animationDecimal).toFixed(0)+"k");
    }
    function animateFrame(cnt, drawData) {
      var easeAdjustedAnimationPercent =(settings.animation)? CapValue(easingFunction(cnt), null, 0) : 1;
      drawData(easeAdjustedAnimationPercent);
    }
    function animationLoop(drawData) {
      var animFrameAmount = (settings.animation)? 1 / CapValue(settings.animationSteps, Number.MAX_VALUE, 1) : 1,
          cnt =(settings.animation)? 0 : 1;
      requestAnimFrame(function() {
          cnt += animFrameAmount;
          animateFrame(cnt, drawData);
          if (cnt <= 1) {
            requestAnimFrame(arguments.callee);
          } else {
            settings.afterDrawed.call($this);
          }
      });
    }
    function Max(arr) {
      return Math.max.apply(null, arr);
    }
    function Min(arr) {
      return Math.min.apply(null, arr);
    }
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function CapValue(valueToCap, maxValue, minValue) {
      if (isNumber(maxValue) && valueToCap > maxValue) return maxValue;
      if (isNumber(minValue) && valueToCap < minValue) return minValue;
      return valueToCap;
    }
    return $this;
  };
})(jQuery);