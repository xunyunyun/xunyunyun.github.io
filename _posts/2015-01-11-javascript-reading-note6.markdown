layout: post
category: "javascript"
title:  "javascript高级程序设计笔记-13章"
tags: ["javascript","事件"]
---

####事件处理程序

兼容性的事件处理程序：

	var EventUtil = {
		addHandler:function(element,type,handler){
			if(element.addEventListener){
				element.addEventListener(type,handler,false)
			}else if(element.attachEvent){
				element.attachEvent("on"+type,handler);
			}else{
				element["on"+type] = handler;
			}
		},
		removeHandler:function(element,type,handler){
			if(element.removeEventListener){
				element.removeEventListener(type,handler,false);
			}else if(element.datachEvent){
				element.detachEvent("on"+type,handler);
			}else {
				element["on"+type] = null;
			}
		}
	}

####DOM中的事件对象

event对象包含与创建它的特定事件有关的属性和方法。触发的事件类型不一样，可用的属性和方法也不一样。

属性如下：

```bubbles```：事件是否冒泡
```cancalable```：是否可以取消事件的默认行为
```currentTarget```：其事件处理程序当前正在处理事件的那个元素。
```defaultPrevented```：为true表示已经调用了preventDefault()
```detail```：与事件相关的详细信息
```eventPhase```：调用事件处理程序的阶段：1表示捕获阶段，2表示处于目标，3表示冒泡阶段
```preventDefault()```:取消事件的默认行为
```stopImmediatePropagation()```：取消事件的进一步捕获或冒泡，同时阻止任何事件程序程序被调用
```stopPropagation()```：取消事件的进一步捕获或冒泡。
```target```：事件的目标
```trusted```：为表示事件时浏览器生成的，为false表示事件是由开发人员通过js创建的（DOM3）
```type```：被触发事件的类型
```view```：与事件关联的抽象视图。等同于发生事件的window对象。

####IE中的事件对象

属性：

```cancalBubble```读写 默认值为false，设置为true时就可以取消事件冒泡
```returnValue```读写 默认值为true，设置为false时就可以取消事件的默认行为
```srcElement```事件的目标
```type```被触发的事件的类型

####跨浏览器的事件对象

	var EventUtil = {
		addHandler:function(element,type,handler){
			if(element.addEventListener){
				element.addEventListener(type,handler,false)
			}else if(element.attachEvent){
				element.attachEvent("on"+type,handler);
			}else{
				element["on"+type] = handler;
			}
		},
		removeHandler:function(element,type,handler){
			if(element.removeEventListener){
				element.removeEventListener(type,handler,false);
			}else if(element.datachEvent){
				element.detachEvent("on"+type,handler);
			}else {
				element["on"+type] = null;
			}
		}，
		getEvent:function(event){
			return event ? event : window.event;
		},
		getTarget:function(event){
			return event.target || event.srcElement;
		},
		preventDefault:function(event){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = false;
			}
		},
		stopPropagation:function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancalBubble = true;
			}
		}
	}

####事件类型

UI事件：当用户也页面上的元素交互时触发
焦点事件
鼠标事件
滚轮事件
文本事件
键盘事件
合成事件
变动事件：当底层的DOM结构发生改变时触发

1.UI事件

```load```：当页面完全加载后在window上面触发，当所有框架都加载完毕时在框架集上触发，当图像加载完毕时在```<img>```上触发，或者当嵌入的内容加载完毕时在```<object>```元素上触发。

```unload```：卸载（与上面相反）

```abort```：在用户停止下载过程时，如果嵌入的内容没有加载完，则在```<object>```上面触发。

```error```：当发生javascript错误时在window上面触发，当无法加载图像时在```<img>```上触发。当无法加载嵌入内容时在```<object>```元素上触发。

```select```：当用户选择文本框（```<input>```或```<textarea>```）中的一或多个字符时触发。

```resize```：当窗口或框架的大小变化时在window或框架上面触发

```scroll```：当用户滚动带滚动条的元素中的内容时，在该元素上面触发。 

	EventUtil.addHandler(window,"load",function(){
		var image = document.createElement("img");
		EventUtil.addHandler(image,"load",function(event){
			event = EventUtil.getEvent(event);
			alert(EventUtil.getTarget(event).src);
		});
		document.body.appendChild(image);
		image.src = "smile.jpg";
	});

**注意**  新图像元素不一定要从添加到文档后才开始下载，只要设置了src属性就会开始下载。

DOM0级的Image对象实现。使用image对象在客户端预加载图像。可以使用Image对象，只不过无法将其添加到DOM树中（因为image对象不是DOM元素）

	EventUtil.addHandler(window,"load",function(){
		var image = new Image();
		EventUtil.addHandler(image,"load",function(event){
			alert("Image loaded!");
		});
		image.src = "smile.jpg";
	});

```<script>```元素也会触发load事件，以便开发人员确定动态加载的javascript文件是否加载完毕。与图像不同，只是在设置了```<script>```元素的src属性并将该元素添加到文档后，才会开始下载javascript文件。换句话说，对于```<script>```元素而言，指定src属性和指定事件处理程序的先后顺序不重要了。

**注意**：
像resize事件（除了firefox下，都会重复触发）一样，scroll事件会在文档被滚动期间重复被触发，所以有必要尽量保持事件处理程序的代码简单。

2.焦点事件
利用这些事件和document.hasFocus()方法及document.activeElement属性配合，可以知晓用户在页面上的行踪。

```blur```：在元素失去焦点时触发。不会冒泡。
```focus```：在元素获得焦点时触发。不会冒泡。
```focusin```:在元素获得焦点时触发。同focus，但会冒泡（ff不支持）
```focusout```：在元素失去焦点时触发。同blur。

3.鼠标与滚动事件

click：在用户单击鼠标按钮或者**按下回车键时触发**
dbclick：在用户双击住鼠标按钮时触发
mousedown：在用户按下了任意鼠标按钮时触发
mouseup：在用户释放鼠标按钮时触发。不能通过键盘触发这个事件。
mouseenter：在鼠标光标从元素外部首次移动到元素范围之内时触发。不冒泡，**而且在光标移动到后代元素上不会触发。**
mouseleave：在位于元素上方的鼠标光标移动到元素范围之外时触发。这个事件不冒泡，**在光标移动到后代元素上不触发。**
mousemove：当鼠标指针在元素内部移动时重复的触发。不可通过键盘触发。
mouseout：在鼠标指针位于一个元素上方，然后用户将其移入一个元素时触发。又移入的另一个元素可能位于前一个元素的外部，**也可能是这个元素的子元素。**不可通过键盘触发。
mouseover：在鼠标指针位于一个元素外部，然后用户将其首次移入另一个元素边界之内时触发。不能通过键盘触发这个事件。

只有在同一个元素上相继触发了mousedown和mouseup事件，才会触发click事件。如果这两个事件中的一个被取消，就不会触发click事件。

类似地，只有触发两次click事件，才会触发一次dbclick事件。如组织了连续两次触发click事件，就不会触发dbclick事件。

mousedown->mouseup->click->mousedown->mouseup->click->dbclick

(用mouseenter和mouseleave可以解决之前放大图片带来的问题，只需要将小的遮罩层overlay设成为大图片的子元素。再通过mouseenter和mouseleave来控制，就不会发生之前图片和遮罩层来回跳转的问题。)

**(1)客户区坐标位置**

鼠标事件都是在浏览器视口中的特定位置上发生的。这个位置信息保存在事件对象的clientX和clientY属性中。所有浏览器均支持这两个属性。它们的值表示事件发生时鼠标指针在视口中的水平和垂直坐标。

	var div = document.getElementById("myDiv");
	EventUtil.addHandler("div",click,function(event){
		event = EventUtil.getEvent(event);
		alert("client coordinates:" + event.clientX + "," + event.clientY);
	});

**(2)页面坐标位置**

页面坐标位置通过事件对象的pageX和pageY属性，能告诉你事件是在页面中的什么位置发生的。这两个属性表示鼠标光标在页面中的位置，**因此坐标是从页面本省而非视口的左边和顶边计算的。**

	var div = document.getElementById("myDiv");
	EventUtil.addHandler("div",click,function(event){
		event = EventUtil.getEvent(event);
		alert("client coordinates:" + event.pageX + "," + event.pageY);
	});

在页面没有发生滚动的情况下，clientX（Y）和pageX（Y）的值相同。

IE8-不支持事件对象上的页面坐标，可以使用客户区坐标和滚动信息计算出来。这时候需要用到document.body（混杂模式）或document.documentElement（标准模式）中的scrollLeft和scrollTop属性。

浏览器兼容下的页面坐标：

	var div = document.getElementById("myDiv");
	EventUtil.addHandler("div",click,function(event){
		event = EventUtil.getEvent(event);
		var pageX = event.pageX;
		var pageY = event.pageY;
		if(pageX === undefined){
			pageX = event.clientX + (document.body.scrollLeft||document.documentElement.scrollLeft);
			pageY = event.clientY + (document.body.scrollTop||document.documentElement.scrollTop);
		}
		alert("client coordinates:" + pageX + "," + pageY);
	});

**(3)屏幕坐标位置**

相对于整个电脑屏幕的位置。screenX和screenY属性就可确定鼠标事件发生时鼠标指针相对于整个屏幕的坐标位置。

（4）修改键

shift、Ctrl、Alt、Meta。它们经常用于修改鼠标事件的行为。DOM规定了4个属性，表示这个修改键的状态：shiftKey、ctrlKey、altKey、metaKey。这些属性中包含的都是布尔值，响应的键被按下了，其值为true，否则为false。当某个鼠标事件发生时，通过检测这几个属性就可以知道是否同时按下了其中的键。

	var div = document.getElementById("myDiv");
	EventUtil.addHandler("div",click,function(event){
		event = EventUtil.getEvent(event);
		var keys = new Array();
		if(event.shiftKey){
			keys.push("shift");
		}
		if(event.ctrlKey){
			keys.push("ctrl");
		}
		if(event.altKey){
			keys.push("alt");
		}
		alert("keys: "+keys.join(","));
	});


（5）.相关元素

在发生mouseover和mouseout事件时，还会涉及更多的元素。

对于mouseover事件：事件的主目标是获得光标的元素，而相关元素就是失去光标的元素。
mouseout事件：事件的主目标是失去光标的元素，而相关元素就是获得光标的元素。

DOM通过event对象的relatedTarget属性提供了相关元素的信息。这个属性只对于mouseover和mouseout事件才包含值；对于其他时间，这个属性的值是null。IE8-不支持，提供了保存着同样信息的不同属性。在mouseover事件触发时，IE的fromElement属性中保存了相关元素。在mouseout事件触发时，IE的toElement属性中保存着相关元素。

兼容的方法：

	var EventUtil = {
		getRelatedTarget:function(event){
			if(event.relatedTarget){
				return event.relatedTarget;
			}else if(event.fromElement){
				return event.fromElement;
			}esle if(event.toElement){
				return event.toElement;
			}else{
				return null;
			}
		}	
	}

（6）鼠标按钮

只有在主鼠标按钮被单击时才会触发click事件，因此检测按钮的信息也有必要。

DOM的button属性：0表示主鼠标按钮
				1.表示中间鼠标按钮（滚轴）
				2.表示次数表按钮

IE8下差别很大...

兼容性的处理：

	var EventUtil = {
		getButton：function(event){
			if(document.implement.hasFeature("MouseEvnet",'2.0')){
				return event.button;
			}else{
				switch(event.button){
					case 0:
					case 1:
					case 3:
					case 5:
					case 7:
						return 0;
					case 2:
					case 6:
						return 2;
					case 4:
						return 1;
				}
			}
		}
	}

（7）更多的事件信息

DOM中，对于鼠标事件来说，detail中包含了一个数值，表示在给定位置上发生了多少次单击。

（8）鼠标滚动事件

mousewheel事件，

对应的event.wheelDelta属性:

	EventUtil.addHandler(document,"mousewheel",function(event){
		event = EventUtil.getEvent(event);
		var delta = (client.engine.opera && client.engine.opera <9.5?-event.wheelDelta:event.wheelDelta);
		alert(delta);
	});


（9）触摸设备

不支持dbclick事件。双击浏览器窗口会放大画面，而且没有办法改变该行为。

轻击可单击元素会触发mousemove事件。轻击不可点击的元素不会触发任何事件。

mousemove事件也会触发mouseover和mouseout

两个手指放在屏幕上且页面上随手指一动而滚动时会触发mousewheel和scroll事件。

（10）无障碍性问题（对于盲人）

a.使用click事件执行代码。

b.不要使用onmouseover向用户显示新的选项

c.不要使用dbclick执行重要的操作。

4.键盘与文本事件

3个键盘事件

```keydown```:当用户按下键盘上的**任意按键**时触发，按住不放，会重复触发事件。
```keypress```:当用户按下键盘上的**字符键**时触发，按住不放，会重复触发事件。
```keyup```:当用户释放键盘上的按键时触发。

（1）键码

keydown和keyup事件时，event对象的keyCode属性中会包含一个代码，与键盘上一个特定的键对应。

	var textbox = document.getElementById("mtText");
	EventUtil.addHandler(textbox,"keyup",function(event){
		event = EventUtil.getEvent(event);
		alert(event.keyCode);
	});


兼容下的按键码获取（非ASCII）

	getCharCode:function(event){
		if(typeof event.charCode == "number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	}

7.HTML5事件

（1）contextmenu事件
	
	var menu = document.getElementById("myMenu");
	EventUtil.addHandler(window,"load",function(event){
		var div = document.getElementById("myDiv");
		EventUtil.addHandler(div,"contextmenu",function(event){
			event = EventUtil.getEvent(event);
			EventUtil.preventDefault(event);
			
			menu.style.left = event.clientX + "px";
			menu.style.top = event.clientY + "px";
			menu.style.visibility = "visible";
		});

		EventUtil.addHandler(document,"click",function(event){
			menu.style.visibility = "hidden";
		});	
	});


支持这个事件的浏览器IE、ff、safari、chrome和Opera 11+

（2）beforeunload事件

这个事件将控制权交给用户。显示的消息会告诉用户页面将被卸载，是否真正要关闭，还是继续留下来。

	EventUtil.addHandler(document,"beforeunload",function(event){
		event = EventUtil.getEvent(event);
		var message = "I'm ready going to miss you if you go";
		event.returnValue = message;
		return message;
	});

3.DOMContentLoaded事件

window的load事件会在页面中的一切都加载完了触发。而DOMContentLoaded事件则在形成完整的DOM数之后就会触发，不理会图像，javascript文件、CSS文件或其他资源是否加载完毕。与load不同，DOMContentLoaded支持在页面下载的早期添加事件处理程序，尽早的与页面交互。

DOMContentLoaded事件会冒泡到window，目标为document。

	EventUtil.addHandler(document,"DOMContentLoaded",function(event){
		alert("Content loaded");
	});


DOMContentLoaded事件对象不会提供任何额外的信息（其target为document）

IE9+、ff、chrome、safari、opera都支持DOMContentLoaded事件，通常这个事件既可以添加事件处理程序，也可以执行执行其他操作。始终都在load事件之前触发。

对于不支持的浏览器，设置一个时间为0毫秒的超时调用
	
	setTimeOut(function(){
		//事件处理程序
	},0);


（4）readystatechange事件

IE为DOM文档中的某些部分提供了readystatechange事件。这个事件的目的是提供与文档或元素加载装填有关的信息。

支持这个事件的每个对象都有一个readyState属性,取值为:

uninittialized(未初始化)：对象存在但未初始化
loading（正在加载）
loaded（加载完毕）
interactive（交互）
complete（完成）

（5）pageshow和pagehide事件

（6）hashchange事件

在URL测参数列表发生变化时通知开发人员。设置这个事件，是因为在Ajax应用中，开发人员经常要利用URL参数列来保存状态或导航信息。

hashchange事件处理程序添加给window对象，然后URL参数列表只要变化就会调用他。此时的event对象包含两个属性：oldURL和newURL。这两个属性保存着参数列表变化前后的完整URL。

8.设备事件

（1）orientationchange事件

safari

window.oriantation属性包含3个值：0 、90 、90

（2）MozOrientation事件

firefox

（3）deviceorientation事件

（4）devicemotion事件

9.触摸与手势事件

（1）触摸事件

touchstart: 当手指触摸屏幕时触发；即使已经有一个手指放在了屏幕上也会触发
touchmove：当手指在屏幕上滑动时连续地触发。这个时间发生期间，调用preventDefault()可以阻止滚动。
touchend：当手指从屏幕上移开时触发
touchcancel：当系统停止跟踪触摸时触发。

除了常见的属性，触摸事件还包含三个用于跟踪触摸的属性

touches:表示当前跟踪的触摸操作的touch对象的数组
targetTouches:特定于事件目标的touch对象的数组
changeTouches:表示自上次触摸以来发生了什么改变的Touch对象的数组

其中的每一个touch对象包含以下属性：

clientX
clientY
identifier
pageX
pageY
screenX
screenY
target

这些事件发生的顺序：

touchstart
mouseover
mousemove
mousedown
mouseup
click
touchend

（2）手势事件

当两个手指触摸屏幕时就会产生手势

gesturestart：当一个手指已经按在屏幕上而另一个手指又触摸屏幕时触发
gesturechange：当触发的任意一个手指的位置发生变化时触发
gestureend：当任何一个手指从屏幕上移开时触发。

手势事件的event对象都包含标准的鼠标事件属性之外，还有rotation和scale

```rotation```属性表示手指变化引起的旋转角度。负值表示逆时针旋转，正值表示顺时针旋转

```scale```属性表示两个手指间距离的变化情况

####内存和性能

1.事件委托

利用事件冒泡，所有用到按钮的事件都适合事件委托技术。

最适合采用事件委托技术的事件有：click、mousedown、mouseup、keydown、keyup、keypress。

2.移除事件处理程序

空事件处理程序也是造成web应用程序内存与性能问题的主要原因。

		btn.onclick = function(){
			btn.onclick = null; //移除事件处理程序
			document.getElementById("myDiv").innerHTML = "Processing...";
		};

注意，在事件处理程序中删除按钮也能阻止事件冒泡。目标元素在文档中是事件冒泡的前提。

事件委托技术优势：需要跟踪的时间处理程序越少，移除他们就越容易。

####模拟事件

在测试web应用程序，，模拟触发事件是一种极其有用的技术。

1.DOM中的事件模拟

createEvent()方法创建event对象。接收一个参数，即表示要创建的事件类型的字符串。

触发事件：dispatchEvent()方法，所有支持事件的DOM节点都支持这个方法。

（1）模拟鼠标事件

返回的对象有一个名为initMouseEvent()方法，用于指定与该鼠标事件有关的信息。

	var btn = document.getElementById("myBtn");
	var event = document.createEvent("MouseEvents");//创建事件对象
	event.initMouseEvent(....);//初始化事件对象
	btn.dispatchEvent(event);//触发事件

（2）模拟键盘事件

1.IE中的事件模拟

