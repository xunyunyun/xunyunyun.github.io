window.onload=function(){
	waterfall('main','box');
	//json数据
	var dataInt={"data":[{"src":'1.jpg'},{"src":'2.jpg'},{"src":'3.jpg'},{"src":'4.jpg'},{"src":'5.jpg'},{"src":'6.jpg'}]};
	//拖动滚动条加载时间
	window.onscroll=function(){
		if(checkScrollSlide){
			var oParent=document.getElementById("main");
			//将数据块渲染到当前页面的尾部
			for(var i=0,max=dataInt.data.length;i<max;i++){
				var oBox=document.createElement("div");
				oBox.className="box";
				var oPic=document.createElement("div");
				oPic.className="pic";
				oBox.appendChild(oPic);
				var oImg=document.createElement("img");
				oImg.src="images/"+dataInt.data[i].src;
				oPic.appendChild(oImg);
				oParent.appendChild(oBox);
			}
			waterfall('main','box');
		}
	};
};
function waterfall(parent,box){
	//将main下的所有的class为box的元素取出来
	var oParent=document.getElementById(parent);
	var oBoxs=getByClass(oParent,box);
	//计算整个页面显示的列数（页面宽度/每一个box的宽）
	var oBoxW=oBoxs[0].offsetWidth;//用offsetWidth获取高度。
	var cols=Math.floor(document.documentElement.clientWidth/oBoxW);
	//设置main的宽度
	oParent.style.cssText="width:"+cols*oBoxW+"px; margin: 0 auto; position:relative";
	var hArr=[];
	for (var i=0,max=oBoxs.length;i<max;i++){
		if(i<cols){
			hArr.push(oBoxs[i].offsetHeight);
		}else{
			var minH=Math.min.apply(null,hArr);
			var index=getMinhIndex(hArr,minH);
			oBoxs[i].style.position="absolute";
			oBoxs[i].style.top=minH+"px";
			//oBoxs[i].style.left=index*oBoxW+"px";
			oBoxs[i].style.left=oBoxs[index].offsetLeft+"px";
			hArr[index]=oBoxs[i].offsetHeight+minH;
		}
	}
	//console.log(hArr);
}
function getByClass(parent,clsName){
	var boxArr=new Array(),//用来存储获取到的所有class为box的元素
		oElements=parent.getElementsByTagName("*");
	for(var i=0,max=oElements.length;i<max;i++){
		if(oElements[i].className==clsName){
			boxArr.push(oElements[i]);
		}
	}
	return boxArr;
}
 function getMinhIndex(arr,val){
 	for(var i=0;i<arr.length;i++){
 		if(arr[i]==val){
 			return i;
 		}
 	}
 }
//检测是否具备了加载数据块的条件
 function checkScrollSlide(){
 	var oParent=document.getElementById("main");
 	var oBoxs=getByClass(oParent,'box');
 	var lastBoxH=oBoxs[oBoxs.length-1].offsetTop+Math.floor(oBoxs[oBoxs.length-1].offsetHeight/2);
 	//document.body.scrollTop为混杂模式下获取body的滚动位置；document.documentElement.scrollTop为标准模式下获取滚动位置。
 	var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
 	var height=document.body.clientHeight||document.documentElement.clientHeight;
 	return (lastBoxH<scrollTop+height)?true:false;
 }