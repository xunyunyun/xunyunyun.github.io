---
layout: post
category: "javascript"
title:  "javascript高级程序设计笔记-10章"
tags: ["javascript","DOM"]
---

### DOM

#### Node类型

1.元素属性：

```nodeName```：元素的标签名tagName

```nodeValue```：

2.节点关系：

childNodes属性：保存着一个NodeList对象，NodeList是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。

	var firstChild = someNode.childNodes[0];
	var secondChild = someNode.childNodes.item(1);
	var count = someNode.childNodes.length;

可以通过对arguments对象使用Array.prototype.slice()方法可以将其转化为数组。采用同样的方法，也可以将NodeList对象转化为数组。

	var arrayOfNodes = Array.prototype.slice.call(someNode.childNodes,0);//IE8+

兼容性的：

	function convertToArray(nodes){
		var array = null;
		try{
			array = Array.prtotype.slice.call(nodes,0);
		}catch(ex){
			array = new Array();
			for(var i = 0, len = nodes.length; i < len; i++){
				array.push(nodes[i]);
			}
		}
		return array;
	}

parentNode属性：

该属性指向文档树中的父节点。

previousSibling属性:同胞节点上一个

nextSibling属性:同胞节点下一个

firstChild属性

lastChild属性

hasChildNodes()方法：有子节点返回true，比查询childNodes列表的length属性更简单。

ownerDocument属性：指向表示整个文档的文档节点。

3.操作节点

(1)插入节点

```appendChild()```用于向childNodes列表的末尾添加一个节点。

```insertBefore()```两个参数：要插入的节点，作为参照的节点。插入到被参照节点的前一个位置，同时将插入节点返回。

(2)移除节点

```replaceChild()```方法：两个参数：要插入的节点，要替换的节点。要替换的节点将由这个方法返回并从文档树中被移除，同时由要插入的节点占据其位置。

```removeChild()```方法。这个方法接收一个参数：要移除的节点。被移除的节点作为返回值。

4.其他方法

```cloneNode()```，用于创建调用这个方法的节点的一个完全相同的副本。

接收一个参数：true：执行深复制，也就是复制节点和其整个子节点数；
			  false：执行浅复制，即只复制节点本身。

复制的节点没有父节点。孤儿

可用过appendchild()、insertBefore()、replaceChild()添加到文档中。

```normalize()```：唯一的作用就是处理文档树中的文本节点。由于解析器的实现或DOM操作等原因，可能会出现文本节点不包含文本，或者接连出现链各个文本节点的情况。如空文本节点，则删除；如找到相邻的文本节点，则将他们合并为一个文本节点。

#### Document类型

1.文档的子节点

documentElement属性，该属性始终指向HTML页面中的```<html>```元素
	
	var html = document.documentElement;

body属性，指向```<body>```

	var body = document.body;

doctype属性,来访问```<!Document>```标签的信息

	var doctype = document.doctype;

不同浏览器的支持性不同，用处有限。

2.文档信息

title属性

	var originalTitle = document.title;//获取文档标题
	document.title = "New page title";//设置文档标题

URL属性：包含页面完整的URL
domain属性：只包含页面的域名
referrer属性：保存着连接到当前页面的那个页面的URL，如果没有，空字符串。

所有这些信息都保存与请求的HTTP头部，通过js访问他们。



3.查找元素

	getElementById()

不让表单的name与其他元素的ID相同；对于IE7的怪癖

	getElementByTagName()

返回的是包含0个或多个元素的NodeList。会返回一个HTMLCollection对象，作为一个“动态”集合，该对象与NodeList类似。

```HTMLCollection```对象：

item()方法来访问HTMLCollection对象中的项。数量通过length属性取得。

namedItem()方法，可以通过元素的name特性取得集合中的项。

	getElementByName()

只有HTMLDocument类型才有这个方法，这个方法返回带有给定name特性的所有元素。为一个HTMLCollection对象。

4.特殊集合

document.anchors:包含文档中所有带name特性的```<a>```元素
document.forms
document.images
document.links

5.DOM一致性检测

document.implementation属性提供了相应信息和功能的对象，与浏览器的dom实现直接对应。

document.implementation.hasFeature()接收两个参数：DOM功能的名称，版本号。如果支持给定的版本名称和版本功能，则该方法返回true.

	document.implementation.hasFeature('XML','1.0');

6.文档写入

	document.write();
	document.writeln();//换行

在页面加载的过程中，可以使用这两个方法向页面动态地加入内容。

可加载字符串、变量、html元素（会创建一个DOM元素）

还可以使用这两个方法动态的包含外部资源，例如js文件等。在包含js文件时，不能直接写```</script>```，会导致该字符串被解释为脚本块的结束，导致他后面代码无法执行。

	 <script type="text/javascript">
	 	document.write("<script type=\"text/javascript\" src=\"file.js\">"+"<\/script>");
	 </script>

需要转义！

**注意**

使用document.write()在页面被呈现的过程中直接向其中输入了内容。如果在文档加载结束后再调用document.write(),那么输出的内容将会重写整个页面。

	<script type="text/javascript">
		window.onload = function(){//等到页面加载完成后执行函数
			document.write("hello world");
		}
	 </script>


	document.open();//打开网页的输入流
	document.close();//关闭网页的输出流



高级选择器：（和jquery相似）

```querySelector()```
```querySelectorAll()```
下文中详细介绍

#### Element类型

元素的标签名 ：nodeName 或 tagName属性

1.HTML元素

	id：
	title：
	lang：元素内容的语言代码
	dir：语言的方向
	className：类名

2.取得特性

	getAttribute()
	setAttribute()
	removeAttribute()

	getAttribute("id");
	getAttribute("class");

4.attributes属性

attributes属性中包含一个NamedNodeMap，与NodeList类似，也是一个动态的集合。元素的每一个特性都由一个At唐人街店表示，每个节点都保存在NameNodeMap对象中。

5.创建元素

document.createElement()方法可以创建新元素。一个参数：要创建元素的标签。

	var div = document.createElement("div");

在使用createElement()方法创建新元素的同时，也为新元素设置了ownerDocument属性。

	div.id = "myNewDiv";
	div.className = "box"; 

得到的新元素尚未被添加到文档树中，要把新元素添加到文档树，可以使用appendChild()/insertBefore()/replaceChild()方法。

	document.body.appendChild(div);

一旦添加到文档树中，浏览器立马呈现该元素。

6.元素的子节点

#### Text类型

nodeType:3
nodeName:#text
nodeValue:节点所包含的文本
parentNode是一个Element
不支持子节点

```nodeValue```属性或```data```属性访问Text节点中包含的文本，这两个属性的值相同。

appendData(text):将text添加到节点末尾
deleteData(offset,count)：从offset指定的位置开始删除count个字符
insertData(offset,text)：在offset指定的位置插入text
replaceData(offset,count,text)：用text替换从offset指定位置到offset+count为止处的文本
splitText(offset)：从offset指定的位置将当前文本分成两个文本节点。
substringData(offset,count)：提取从offset指定的位置开始到offset+count为止处的字符串

div.firstChild.nodeValue = "Some other message";

1.创建文本节点

document.createTextNode()创建新文本节点，这个方法接收一个参数-要插入节点中的文本。

	var element = document.createElement("div");
	element.className = "message";
	var textNode = document.createTetxNode("hello world");
	element.appendChild(textNode);
	document.body.appendChild(element);

2.规范化文本节点
	
```normalize()```如果在一个包含两个或多个文本节点的父元素上调用normalize()方法，则会将所有的文本节点合并成一个节点。

	var element = document.createElement("div");
	element.className = "message";
	var textNode = document.createTetxNode("hello world!");
	element.appendChild(textNode);
	var anothertextNode = document.createTetxNode("xunyunyun");
	element.appendChild(anothertextNode);
	document.body.appendChild(element);
	alert(element.childNodes.length);//2
	element.normalize();
	alert(element.childNodes.length);//1
	alert(element.firstChild.odeValue);//"hello world!xunyunyun"

浏览器永远不会创建相邻的文本节点。这种情况只会作为执行DOM操作的结果出现。

3.分割文本节点

splitText():这个方法将一个文本节点分成两个文本节点。

	var element = document.createElement("div");
	element.className = "message";
	var textNode = document.createTetxNode("hello world");
	element.appendChild(textNode);
	document.body.appendChild(element);
	var newNode = element.firstChild.splitText(5);
	alert(element.firstChild.nodeValue);//"hello"
	alert(newNode.nodeValue);  //" world!"
	alert(element.childNodes.length);//2

分割文本节点是从文本节点中提取数据的一种常用DOM解析技术

#### Comment类型

nodeType:8
nodeName:#commment
nodeValue:注释内容
parentNode：可能是Document或Element
不支持（没有）子节点

与Text类型类似，除了splitText()方法之外的所有字符串操作方法。

### DOM操作技术

#### 动态脚本

	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "client.js";
	document.body.appendChild(script);

	function loadScript(url) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		document.body.appendChild(script);
	}
	loadscript("client.js");

在兼容模式下：

	function loadScriptString(code){
		var script = document.createElement("script");
		script.type = "text/javascript";
		try{
			script.appendChild(document.createTextNode(code));
		}catch(ex){
			script.text = code;
		}
		document.body.appendChild(script);
	}

#### 动态样式

	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = "style.css";
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(link);

	function loadStyles(url) {
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = url;
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(link);
	}
	loadStyles("style.css");

外部加载样式文件的过程时异步的，也就是加载样式与执行javascript代码的过程没有固定的次序。

	var style = document.createElement("style");
	style.type = "text/css";
	try{
		style.appendChild(document.createTextNode("body{background-color:red}"));
		}catch(ex){
			style.styleSheet.cssText = "body{background-color:red}";
		}
	}
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(link);

#### 操作表格

#### 使用NodeList

NodeList、NamedNodeMap、HTMLCollection。每当文档结构发生改变时，它们都会得到更新。

### DOM扩展

#### 选择符API

1.querySelector()方法

接收一个CSS选择符，返回与该模式匹配的**第一个元素**，如果没有找到匹配的元素，返回null。
通过document类型调用querySelector()方法时，会在文档元素的范围内查找匹配元素。通过Element类型调用querySelector()方法时，只会在该元素后代元素的范围内查找匹配的元素。

2.querySelectorAll()方法

querySelectorAll()方法和querySelector()方法参数相同，但返回的是**所有匹配的元素**，为一个NodeList的实例。

3.matchesSelector()方法

接受一个参数：CSS选择符;匹配，返回true，否则，返回false。

#### 元素遍历

属性：

childElementCount：返回子元素的个数
firstElementChild：指向第一个子元素；firstChild的元素版
lastElementChild：指向最后一个子元素；lastChild的元素版
previousElementSibling:指向前一个同辈元素；previousSibling的元素版
nextElementSibling:指向后一个同辈元素；nextSibling的元素版

#### HTML5

1.getELementsByClassName()方法

可以通过document对象及所有HTML元素调用该方法。

getElementsByClassName()方法接收一个参数，即包含一或多个类名的字符串，返回带有指定类的所有元素的NodeList。传入多个类名时，类名的先后顺序不重要。

使用这个方法可以更方便地为带有某些类的元素添加事件处理程序。

2.classList属性

className属性添加、删除和替换类名。因为className中是一个字符串，所以即使只修改字符串的一部分，也必须每次都设置整个字符串的值。

	<div class="bd user disabled">。。。 </div>

	var classNames = div.className.split(/\s+/);
	var pos = -1,i,len;
	for(i = 0, len = classNames.length; i < len; i++ ){
		if(classNames[i] == "user"){
			pos = i;
			break;
		}
	} 
	//删除类名
	classNames.splice(i,1);
	div.className = classNames.join(" ");

HTML5新增了一种操作类名的方式，可以让操作更加简单也更加安全，就是所有的元素添加classList属性。这个属性是新集合类型DOMTokenList的实例。方法如下：

add(value):将给定的字符串值添加到列表中。如果值已经存在，就不添加了。
contains(value)：表示列表中是否存在给定的值，如果存在则返回true，否则返回false
remove(value)：从列表中删除给定的字符串
toggle(value)：如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，添加他。

上面的代码可以简化为：

	div.classList.remove("user");

 //迭代类名

 	for(var i = 0,len = div.classList.lenth; i < len; i++){
 	dosomething(div.classList[i]);
 	}

 支持浏览器firefox和chrome

 3.焦点管理

document.activeElement属性：始终会引用DOM中当前获得了焦点的元素。

document.hasFocus()方法，用于确定文档是否获得了焦点。

4.HTMLDocument的变化

（1）readyState属性

document.readyState属性值：

loading：正在加载文档

complete：已经加载完文档

	if(document.readyState == "complete"){}

（2）兼容模式

检测页面的兼容模式就是成为浏览器的必要功能。IE为此给document添加了一个名为compatmode的属性，这个属性就是为了告诉开发人员浏览器采用了哪种渲染模式。

在标准模式下document.compatMode为```CSS1Compat```
混杂模式下document.compatMode为```BackCompat```

	if(document.compatMode == "CSS1Compat"){
		alert("standards mode");
	}else{
		alert("Quirks mode");
	}

（3）head属性

HTML5新增。引用文档的```<head>```元素。

	var head = document.head || document.getElementByTagName("head")[0];

#### 字符集属性

	alert(document.charset);//"UTF-16"
	document.charset = "UTF-8";

document.defaultCharset属性，表示浏览器默认字符集

5.自定义数据属性

HTML5规定可以为元素添加非标准的属性，但要添加前缀data-，目的是为了元素提供与渲染无关的信息，或者提供语义信息。

	<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>

6.插入标记

（1）innerHTML属性

（2）outerHTML属性

（3）insetAdjacentHTML()方法

两个参数：插入位置、要插入的HTML文本

#### 专有扩展

1.文档模式

要强制浏览器以某种模式渲染页面，可使用HTTP头部信息X-UA-Compatible。或通过等价的```<meta>```标签来设置：

	 <meta http-equiv="X-UA-Compatible" content="IE=IEVersion">

 IEVersion有以下不同的值：

 Edge：
 EmulateIE9：

```document.documentMode```属性可以知道给定页面使用的什么文档模式。

2.children属性

	var childCount = element.children.length;
	var firstCount = element.children[0];

3.contains()方法

调用这个方法的是祖先节点，接收一个参数，即要检测的后代节点。若是，返回true；否则，返回false。

4.插入文本

（1）innerText属性

通过innerText属性可以操作元素中包含的所有文本内容，包括子文档树中的文本。他会由浅到深，将子文档数中的所有文本拼接起来。

当用它写入时，结果会删除元素的所有子节点。

（2）outerText属性

写入时，outerText就完全不同了：outerText不只替换调用它的子节点，而且会替换掉整个元素。





