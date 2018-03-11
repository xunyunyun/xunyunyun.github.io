---
layout: post
category: "CSS"
title: "横向两列三列布局问题"
tags: ["布局"]
---

#### 一、两列布局情况

html如下：

{% highlight html %}
<body>
	<div id="parent">		
		<div class="left">
			<p>left</p>			
		</div>
		<div class="right">
			<p>right</p>
		</div>
	</div>
</body>
{% endhighlight %}

##### **1.利用浮动布局**


```
.left { float: left; display: inline; width: ***px;}
.right { float: right; display: inline; width: ***px;}
```

	仅用于两列固定宽度

##### **2.利用绝对定位**

```
.parent { position: relative;}
.left { position: relative; width: 200px;}
.right { position: absolute; left: 200px; top: 0; right: 0;}
```

    用于一列固定宽度，另一列自适应宽度。
    注意:这种情况下,如果需要父元素包裹住左右部分的话，需要满足固定宽度列的高度 > 自适应宽度列的高度
    （因为父元素的高度为固定宽度列的高度；由于自适应宽度列为绝对定位，脱离文档流）

##### **3.利用浮动和外边界**

```
.parent { width: 100%; overflow: hidden;}
.left { float: left; width: 200px;}
.right { margin-left: 200px;}
```

	用于一列固定宽度，另一列自适应宽度。
	这种方法通过给父元素设置overflow：hidden；可以使父元素包裹住左右部分；而不管其左右哪个更高。

#### 二、三列布局情况

根据html的三种情况：

##### **1.两列化处理**

两个并列的div，两层来实现：
{% highlight html %}
<body>
	<div id="parent">
		<div>
			<div class="left">
				<p>left</p>
			</div>
			<div class="main">
				<p>Main</p>	
			</div> 
		</div>		
		<div class="right">
			<p>right</p>
		</div>
	</div>
</body>
{% endhighlight %}
这种情况下可以看做是两个两列布局处理，用上面提到的方法很容易实现。
可以实现


##### **2.浮动布局**

三个并列的div，main居中
{% highlight html %}
<body>
	<div id="parent">		
		<div class="left">
			<p>left</p>
		</div>
		<div class="main">
			<p>Main</p>	
		</div> 
		<div class="right">
			<p>right</p>
		</div>
	</div>
</body>
{% endhighlight %}

CSS格式如下：

```
.left { float: left; display: inline; width: ***px;}
.main { float: left; display: inline; width: ***px;}
.right { float: left; display: inline; width: ***px;}
```
这种情况下需要知道每个div的宽度。

##### **3.圣杯布局（重要理解）**

三个并列的div，main在前
{% highlight html %}
<body>
	<div id="parent">		
		<div class="main">
			<p>Main</p>
		</div>
		<div class="left">
			<p>left</p>	
		</div> 
		<div class="right">
			<p>right</p>
		</div>
	</div>
</body>
{% endhighlight %}

CSS格式如下：

```
.parent { padding: 0 270px 0 190px;}
```

```
.main { float: left; width: 100%;}
```

```
.left { float: left; width: 190px; margin-left: -100%; position:relative; left:-190px;}
```

```
.right { float: left; width: 270px; margin-left: -270px; position:relative; left:270px;}
```

如果增加一个div包裹的话，html如下时：

{% highlight html %}
<body>
	<div id="parent">		
		<div class="main">
            <div class="wrap-main">
                <p>Main</p>
                <pre>.main { float: left; width: 100%; } </pre>
            </div>
        </div>		
		<div class="left">
			<p>left</p>	
		</div> 
		<div class="right">
			<p>right</p>
		</div>
	</div>
</body>
{% endhighlight %}

CSS格式会简化很多，不再需要相对定位，如下：

```
.main { float: left; width: 100%;}
```

```
.wrap-main { margin: 0 270px 0 190px;}
```

```
.left { float: left; width: 190px; margin-left: -100%;}
```

```
.right { float: left; width: 270px; margin-left: -270px;}
```

在这个基础上，继续引入相对定位，还可以实现三栏布局的各种组合
下面实现left、right、main的布局的CSS如下

```
.main { float: left; width: 100%;}
```

```
.wrap-main { margin: 0 0 0 460px;}
```

```
.left { float: left; width: 190px; margin-left: -100%;}
```

```
.right { float: left; width: 270px; margin-left: -100%; position: relative; left: 190px; }
```
	
	其优点：
	实现了内容与布局的分离.
	main部分是自适应宽度的，很容易在定宽布局和流体布局中切换。
	任何一栏都可以是最高栏，不会出问题。
	需要的hack非常少（就一个针对ie6的清除浮动hack:_zoom: 1;）
	在浏览器上的兼容性非常好，IE5.5以上都支持。
	其不足：
	main需要添加一个额外的包裹层。

参考于[双飞翼布局介绍-始于淘宝UED](http://www.imooc.com/wenda/detail/254035)

这种圣杯布局方式实现了两边定宽度，中间自适应宽度变化。

这里再提到一点:要想这三列等高布局,在后面加上：
```
.main,.left,.right {
	margin-bottom: -5000px;
	padding-bottom: 5000px;
}
.parent { overflow: hidden; }
```





