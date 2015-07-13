---
layout: post
category: "Javascript"
title:  "Javascript事件监听，事件委托"
tags: ["事件"]
---

####事件监听

#####DOM事件包含捕获（capture）和冒泡（bubble）两个阶段：

捕获阶段事件从window开始触发事件然后通过祖先节点一次传递到触发事件的DOM元素上；

冒泡阶段事件从初始元素依次向祖先节点传递直到window


#####1.onevent方法(DOM0级)

每个元素都有自己的事件处理程序属性：
	
	btn.onclick = function(){
		alert(this.id);
	}

用this代表触发事件的对象，指向当前元素。

#####2.标准事件监听(DOM2级)

**IE9+及其他浏览器均支持**

	elem.addEventListener(type, handler, capture)
	elem.removeEventListener(type, handler, capture)

handler接收保存事件信息的event对象作为参数

event.target为触发事件的对象

handler调用上下文this为绑定监听器的对象

event.preventDefault()取消事件默认行为

event.stopPropagation()取消事件传递，一般为取消冒泡


#####3.老版本IE事件监听

**只支持IE下**

	elem.attachEvent('on'+type, handler)
	elem.detachEvent('on'+type, handler)

handler不接收event作为参数，事件信息保存在window.event中，触发事件的对象为event.srcElement。

handler执行上下文this为window使用闭包中调用handler.call(elem, event)可模仿标准模型，然后返回闭包，保证了监听器的移除。

event.returnValue为false时取消事件默认行为

event.cancleBubble为true时取消时间传播


**通常利用事件冒泡机制托管事件处理程序提高程序性---事件委托**

####事件委托

举例来说，如果你有一个很多行的大表格，在每个<tr>上绑定点击事件是个非常危险的想法，因为性能是个大问题。流行的做法是使用事件委托。事件委托描述的是将事件绑定在容器元素上，然后通过判断点击的target子元素的类型来触发相应的事件。

	var myTable = document.getElementById('my-table');
	myTable.onclick = function (e) {
	    // 处理浏览器兼容
	    e = e || window.event;
	    var targetNode = e.target || e.srcElement;
	    // 测试如果点击的是TR就触发
	    if (targetNode.nodeName.toLowerCase() === 'tr') {
	        alert('You clicked a table row!');
	    }
	}

```str = node.nodeName```:The Node.nodeName read-only property returns the name of the current node as a string.

```elementName = element.tagName```:Returns the name of the element.

 都一样，得到大写的标签名。

事件委托依赖于事件冒泡，如果事件冒泡到table之前被禁用的话，那上面的代码就无法工作了。

#####持续更新中！

