---
layout: post
category: "javascript"
title:  "javascript高级程序设计笔记-8章"
tags: ["javascript","BOM"]
---

### BOM

#### 1.window对象

（1）全局作用域

**全局变量不能通过delete操作符删除，而直接在window对象上定义的属性可以。**


var newValue = oldValue;//会抛出错误，因为oldValue未定义

var newValue = wondow.oldValue;//这里不会抛出错误，因为这是一次属性查询

（3）窗口位置

screenLeft：表示窗口相对于屏幕左边的位置
screenTop：表示窗口相对于屏幕上边的位置

跨浏览器兼容：(firefox不支持window.screenLeft)
	
	var leftPos = (typeof window.screenLeft == "number")? window.screenLeft: window.screenX;
	var topPos = (typeof window.screenTop == "number")? window.screenTop: window.screenY;

moveTo()
moveBy()

（4）窗口大小

```innerWidth```
```innerHeight```
在Opera中表示该容器中页面视图区的大小（减去边框宽度）
在chrome中表示视口的大小而非浏览器窗口的大小。

```outerWidth```
```outerHeight```
在IE9+/safari/Firefox中返回浏览器窗口本身的尺寸，
在Opera中表示该容器中页面视图区的大小，
在chrome中同上，即视口的大小而非浏览器窗口的大小。

```document.documentElement.clientWidth```
```document.documentElement.clientHeight```
在IE9+/safari/Firefox/Opera/Chrome中保存了页面视口的信息
但是在IE6中的标准模式下有效，而混杂模式下，就必须用
```document.body.clientWidth```
```document.body.clientHeight```

无法确定浏览器的窗口本身的大小

可得到浏览器兼容的页面视口的大小：

var pagewidth = window.innerWidth,
	pageHeight = window.innerHeight;

	if(typeof pageWidth != "number"){
		//CSS1Compat代表标准模式
		if(document.compatMode == "CSS1Compat"){
			pageWidth = document.documentElement.clientWidth；
			pageHeight = document.documentElement.clientHeight；
		}else{
			pageWidth = document.body.clientWidth；
			pageHeight = document.body.clientHeight；
		}
	}

这两个方法有可能被浏览器禁用
resizeTo()
resizeBy()

（5）导航和打开窗口

window.open()：该方法既可以导航到一个特定的URL，也可以打开一个新的浏览器窗口。

4个参数：URL、窗口目标、一个特定字符串、一个新页面是否取代浏览器历史记录中当前加载页面的布尔值。

通常只需传递第一个参数。

a.弹出窗口

window.open()

b.弹出窗口屏蔽程序

	var wrosWin = window.open('http://www.wrox.com','_blank');
	if(wrosWin == null){
		alert("The popup was blocked!");
	}

	var blocked = false;
	try {
		var wrosWin = window.open('http://www.wrox.com','_blank');
		if(wrosWin == null){
			blocked = true;
		}
		}catch(ex){
			blocked = true;
		}
		if(blocked){
			alert("The popup was blocked!");
		}
	






