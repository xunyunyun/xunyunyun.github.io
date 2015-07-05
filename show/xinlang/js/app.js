var main=function() {
	$(".menu-icon").click(function(){
		//$(".menu").toggle();
		$(".menu").animate({
			left:"0"
		},200);
		$("body").animate({
			left:"10%"
		},200);
	});

	$(".icon-close").click(function(){
		$(".menu").animate({left:"-10%"},200);
		$("body").animate({left:"0"},200);
	});
};

$(document).ready(main);
