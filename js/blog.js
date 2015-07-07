/**
 * 页面加载完成
*/
$(document).ready(function(){
	// 按标签分类
	categoryDisplay();
	// 时间轴实现
	timeline();
});

/**
 * 分类展示
 * 点击右侧的分类展示时
 * 左侧的相关裂变展开或者收起
 * @return {[type]} [description]
 */
function categoryDisplay() {
    /*only show All*/
    $('.post-list-item>ul[post-cate!=All]').hide();
    /*show category when click categories list*/
    $('.categories-list').delegate("a","click",function(){
    	var $cate = $(this).attr('cate');
    	$('.post-list-item>ul[post-cate!=' + $cate + ']').hide(250);
        $('.post-list-item>ul[post-cate=' + $cate + ']').show(400);
    });
}

/**
 * 分类展示
 * 点击右侧的年份时
 * 右侧的相关裂变展开或者收起月份
 * @return {[type]} [description]
 */
 function timeline(){
 	$('.monthline>li').hide();
 	$('.base-year').hide();
 	// $('.monthline>li[class!="date-tag"]').appendTo($('.dateline'));
 
 	$('.yearline').delegate("li","click",function(){
 		console.log("yearline");

 		$('.yearline>li').removeClass('active');
 		$(this).addClass("active"); 
 		$year = $(this).attr('id');

 		if($year == "near"){
 			// 左侧展示
 			$('.base-year').hide();
 			$('.near').show();
 			$('.monthline>li').hide();
 		}
 		else {
 			// 左侧展示区，显示base-year类
 			$('.near').hide();
 			$('.base-year').show();
 			// 先隐藏所有，再显示应该显示的左侧条目
 			$('.dateline>li').hide();
	 		$('.dateline>li[class^='+$year+'-]').show();
	 		// 先隐藏所有，再显示应该显示的右侧月份
	 		$('.monthline>li').hide();		
	 		$('.monthline').appendTo($(this)); 
	 		$('.monthline>li[id^='+$year+'-]').show();		
	 	}
	 					
 	});

	$('.monthline').delegate("li","click",function(e){
		e = e || window.event;
		console.log("monthline");
		$yearmonth = $(this).attr('id');
		$('.dateline>li').hide();
		$('.dateline>li[class='+$yearmonth+']').show();
		e.stopPropagation();

	});


 }