/**
 * 页面加载完成
*/
$(document).ready(function(){
	categoryDisplay();
});


/**
 * 分类展示
 * 点击右侧的分类展示时
 * 左侧的相关裂变展开或者收起
 * @return {[type]} [description]
 */
function categoryDisplay() {
    /*only show All*/
    console.log($('.post-list-item>ul[post-cate!=All]'));
    $('.post-list-item>ul[post-cate!=All]').hide();
    /*show category when click categories list*/
    $('.categories-list').delegate("a","click",function(){
    	var $cate = $(this).attr('cate');
    	console.log($cate);

    	$('.post-list-item>ul[post-cate!=' + $cate + ']').hide(250);
        $('.post-list-item>ul[post-cate=' + $cate + ']').show(400);
    });

}