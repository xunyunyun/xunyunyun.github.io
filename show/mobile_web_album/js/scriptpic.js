var main=function(){
	var total = 18;
	var zWin = $(window);
	var render = function(){
		var padding = 2;
		var winWidth = zWin.width();
		var picWidth = Math.floor((winWidth-padding*3)/4);
		var tmpl='';
		for (var i = 1; i <= total; i++) {
			var p = padding;
			var imgSrc = "image/"+i+".jpg";
			if(i%4==1){
				p=0;
			}
			/*tmpl +='<li style="width:'+picWidth+'px;height:'+picWidth+'px;padding-left:'+p+'px;padding-top:'+padding+'px"><img src="'+imgSrc+'"/></li>';*/
			//引入为animated 动画效果为bounceIn
			tmpl +='<li data-id="'+i+'" class="animated bounceIn" style="width:'+picWidth+'px;height:'+picWidth+'px;padding-left:'+p+'px;padding-top:'+padding+'px"><canvas id="cvs_'+i+'"></canvas></li>';	//通过使用canvas来做渲染，来触发物理设备的GPU渲染
			var imageObj = new Image();
			imageObj.index = i;
			imageObj.onload = function(){//必须在onload事件之后才可以画图
				var cvs = $('#cvs_'+this.index)[0].getContext('2d');
				cvs.width=this.width;
				cvs.height=this.height;
				cvs.drawImage(this,0,0);

			};
			imageObj.src=imgSrc;

		}
		$("#container").html(tmpl);
	};
	render();

	var cid;
	var wImage = $("#large_img");
	var domImage = wImage[0];
	var loadImg = function(id,callback){
		$('#container').css({height:zWin.height(),'overflow':'hidden'})
		$("#large_container").css({width:zWin.width(),height:zWin.height()}).show();
		var imgsrc = 'image/'+id+'.jpg';
		var imageObj = new Image();
		imageObj.onload=function(){
			var w = this.width;
			var h = this.height;
			var winWidth = zWin.width();
			var winHeight = zWin.height();
			var realw = winHeight*w/h;
			var realh = winWidth*h/w;
			var paddingLeft = parseInt((winWidth-realw)/2);	
			var paddingTop = parseInt((winHeight-realh)/2);
			wImage.css('width','auto').css('height','auto');
			wImage.css('padding-left','0px').css('padding-top','0px');
			if(h/w>1.8){//认为是竖图
				wImage.attr('src',imgsrc).css('height',winHeight).css('padding-left',paddingLeft);
			}else{//  认为是横图
				wImage.attr('src',imgsrc).css('width',winWidth).css('padding-top',paddingTop);
			}
			callback&&callback();
		};
		imageObj.src = imgsrc;
	}; 

	//事件代理
	$('#container').delegate('li','tap',function(){//不要使用click，因为是手机端
		var _id = cid = $(this).attr("data-id");		
		loadImg(_id);
	});

	$('#large_container').tap(function(){
		$(this).hide();
	}).swipeLeft(function(){
		cid++;
		if(cid>total){
			cid = total;
		}else{
			loadImg(cid,function(){
				domImage.addEventListener("webkitAnimationEnd",function(){
					wImage.removeClass("animated bounceInRight");
					domImage.removeEventListener("webkitAnimationEnd");
				},false);
				wImage.addClass("animated bounceInRight");
			});
		}
	}).swipeRight(function(){
		cid--;
		if(cid<1){
			cid = 1;
		}else{
			loadImg(cid,function(){
				domImage.addEventListener("webkitAnimationEnd",function(){
					wImage.removeClass("animated bounceInLeft");
					domImage.removeEventListener("webkitAnimationEnd");
				},false);
				wImage.addClass("animated bounceInLeft");
			});
		}
	});

}
$(document).ready(main);