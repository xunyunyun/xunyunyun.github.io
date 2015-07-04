// JavaScript Document

var main=function(){
		//将大图片图片收起
		/*$(".shouqi").click(function(){
			$(this).parents(".change_big").css({visibility:'hidden',position:'absolute'});
			$(this).parents(".change_big").siblings(".picture").css({visibility:'visible',position:'relative'});
		});
		$(".zoom-in").click(function(){
			$now=$(this).parents(".change_big");
			$now.css({visibility:'hidden',position:'absolute'});
			$nowsib=$now.siblings(".picture");
			$nowsib.css({visibility:'visible',position:'relative'});
		});*/

		//程序简化版
		$(".shouqi,.zoom-in").click(function(){ zoomInPic($(this));});
		function zoomInPic( that ){
			$(that).parents(".change_big").css({visibility:'hidden',position:'absolute'});
			$(that).parents(".change_big").siblings(".picture").css({visibility:'visible',position:'relative'});
		}



		//将小图片图片放大
		$(".zoom-out").click(function(){

			$now=$(this).parents(".picture");
			$nowsib=$now.siblings(".change_big");

			$now.css({visibility:'hidden',position:'absolute'});

			$index=$(this).parents("li").index()+1;
			$title=$now.attr("name");
			$src="image/"+$title+"/big_"+$index+".jpg";
			$nowsib.find("img").attr("src",$src);

			$nowsib.css({visibility:'visible',position:'relative'});
		});
	};
	$(document).ready(main);