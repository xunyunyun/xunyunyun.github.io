---
layout: post
category: "html"
title:  "canvas学习"
tags: ["html5","canvas"]
---

####canvas学习（2）

1.绘制图形

	var image = document.images[0]; //选择一个<img>
	context.drawImage(image,10,10); //传入这个元素，以及绘制该图像的起点的x和y坐标。

2.渐变

	var gradient = context.createLinearGradient(30,30,70,70);
	gradient.addColorStop(0,"white");
	gradient.addColorStop(1,"black");
	//绘制红色矩形
	context.fillStyle = "#f00";
	context.fillRect(10,10,50,50);
	//绘制渐变矩形
	context.fillStyle = gradient;
	context.fillRect(30,30,50,50);

3.模式

重复的图像，可以用来填充或描边图形。要创建一个新模式，可以调用createPattern()方法并传入两个参数：一个HTML```<img>```元素和一个表示如何重复图像的字符串。其中，第二个参数的值和CSS的background-repeat属性相同repeat、repeat-x、repeat-y和no-repeat。第一个参数可以是一个```<video>```元素，或另一个```<canvas>```元素。

4.使用图像数据

getImageData()取得原始图像数据。这个方法接收4个参数：要取得其数据的画面区域的x，y坐标以及该区域的像素宽度和高度。

	var imageData = context.getImageData(10,5,50,50);

返回的imageData的实例。每个ImageData对象都有三个属性：width、height、data。其中data属性是一个数组，保存着图像中的每一个像素的数据。在data数组中，每一个像素用四个元素来保存，分别表示红、绿、蓝、透明度值。因此，第一个像素的数据就保存在数组的第0到第3个元素中。

	var drawing = document.getElementById('draw');
	if(drawing.getContext){
		var context = drawing.getContext('2d'),
		image = document.images[0],
		imageData,data,i,len,average,
		red,green,blue,alpha;
		//绘制原始图像
		context.drawImage(image,0,0);
		//取得图像数据
		imageData = context.getImageData(0,0,100,100);
		data = imageData.data;
		for(i = 0, len = data.length; i < len; i+=4){
			red = data[i];
			green = data[i+1];
			blue = data[i+2];
			alpha = data[i+3];
			average = Math.floor((red + green + blue) / 3);
			//设置颜色值，透明度不变
			data[i] = average;
			data[i+1] = average;
			data[i+2] = average;
		}
		//回写图像数据并显示结果
		imageData = data;
		context.putImageData(imageData,0,0);
	}

5.合成

2D上下文中所有绘图操作的属性：globalAlpha和globalCompositionOperation。其中，globalAlpha是一个介于0和1之间的值（包括0和1），用于指定所有绘图的透明度。默认值为0.如果所有后续操作都要基于相同的透明度，就可以先把globalAlpha设置为适当值，然后绘制，最后再把它设置回默认值0。

	context.fillStyle = '#f00';
	context.fillRect(10,10,50,50);
	//修改全局透明度
	context.globalAlpha = 0.5;
	//绘制蓝色矩形
	context.fillStyle = 'rgba(0,0,255,1)';
	context.fillRect(30,30,50,50);
	//重置全局透明度。
	context.globalAlpha = 0;

globalCompositionOperation表示后绘制的图形怎么和先绘制的图形结合。
source-over(默认值)：后绘制的图形位于先绘制的图形上方。
source-in：后绘制的图形与先绘制的图形重叠的部分可见，两者的其他分部完全透明。
source-out：后绘制的图形与先绘制的图形不重叠部分可见，先绘制的图形完全透明。
...




