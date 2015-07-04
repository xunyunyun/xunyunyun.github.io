var main=function(){
	waterfall();
	var dataInt={"data":[{"src":'1.jpg'},{"src":'2.jpg'},{"src":'3.jpg'},{"src":'4.jpg'},{"src":'5.jpg'},{"src":'6.jpg'}]};
	$(window).on("scroll",function(){
		if(checkScrollSlide){
			/*var $par=$("#main");
			//将数据块渲染到当前页面的尾部
			for(var i=0,max=dataInt.data.length;i<max;i++){
				var $box=$("<div></div>").attr("class","box");
				var $pic=$("<div></div>").attr("class","pic");
				var $img=$("<img></img>").attr("src","images/"+dataInt.data[i].src);
				$img.appendTo($pic);
				$pic.appendTo($box);
				$box.appendTo($par);
			}*/

			$.each(dataInt.data,function(key,value){
				var oBox=$("<div>").addClass("box").appendTo($('#main'));
				var oPic=$("<div>").addClass("pic").appendTo(oBox);
				//$("<img>").attr("src","images/"+$(value).attr("src")).appendTo(oPic);
				//console.log($(value).attr("src"));
			});
			waterfall();
		}
	});
	
};
function waterfall(){
	$box=$("#main>.box");
	var BoxW=$box.eq(0).outerWidth();
	var cols=Math.floor($(window).width()/BoxW);
	//设置main的宽度
	//$("#main").css({"width":cols*BoxW,"margin":"0 auto","position":"relative"});
	$("#main").width(cols*BoxW).css({"margin":"0 auto","position":"relative"});

	var hArr=[];
	/*for (var i=0,max=$box.length;i<max;i++){
		if(i<cols){
			hArr.push($box.eq(i).outerHeight());
		}else{
			var minH=Math.min.apply(null,hArr);
			var index=$.inArray(minH,hArr);
			$box.eq(i).css({"position":"absolute","top":minH+"px","left":$box[index].offsetLeft+"px"});
			hArr[index]=$box.eq(i).outerHeight()+minH;
		}
	}*/
	$box.each(function(index,value){
		var h=$box.eq(index).outerHeight();
		if(index<cols){
			hArr[index]=h;
		}else{
			var minH=Math.min.apply(null,hArr);
			var minHIndex=$.inArray(minH,hArr);//可以求出minH在数组hArr中的索引
			//由于value是一个dom对象，没有办法使用jquery对象的方法；必须转化成jQuery对象才行；
			$(value).css({
				"position":"absolute",
				"top":minH+"px",
				"left":minHIndex*BoxW+"px"
				//"left":$box.eq(minHIndex).offset().left-$box.eq(0).offset().left+"px"
			});
			hArr[minHIndex]=$(value).outerHeight()+minH;			
		}
	});
};

 //检测是否具备了加载数据块的条件
 function checkScrollSlide(){
 	var $lastbox=$("#main>.box").last();
 	//在js中的元素的属性offsetTop，在jquery中用offset()方法及其属性top共同实现
 	var lastBoxH=$lastbox.offset().top+Math.floor($lastbox.Height()/2);
 	//document.body.scrollTop为混杂模式下获取body的滚动位置；document.documentElement.scrollTop为标准模式下获取滚动位置。
 	/*js实现方式*/ //var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
 	var scrollTop=$(window).scrollTop();
 	/*js实现方式*/ //var height=document.body.clientHeight||document.documentElement.clientHeight;
 	var documentH=$(window).height();
 	return (lastBoxH<scrollTop+documentH)?true:false;
 }

$(document).ready(main);
