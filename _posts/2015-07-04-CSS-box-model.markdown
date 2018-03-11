---
layout: post
category: "CSS"
title: "关于盒模型的属性"
tags: ["盒模型"]
---

#### 一、border

##### 实现一个三角形

html如下：
{% highlight html %}
<div class="triangle-up">
</div>
<div class="triangle-down">
</div>	
{% endhighlight %}
CSS 

{% highlight css %}
<style>
	.triangle-up,.triangle-down {
		width: 0;
		height: 0;
		border-left: 50px solid transparent;
		border-right: 50px solid transparent;

	}
	.triangle-up {
		border-bottom: 50px solid #000;

	}
	.triangle-down {	
		border-top: 50px solid #000;
	}
</style>
{% endhighlight %}

#####实现一个小房子
html
{% highlight html %}
<div class="house-icon">
</div>
{% endhighlight %}
CSS 

{% highlight css %}
<style>
	.house-icon {
		width: 0;
		height: 0;
		border-left: 100px solid transparent;
		border-right: 100px solid transparent;
		border-bottom: 50px solid #000;
	}
	.house-icon:after {
		position: relative;
		top: 50px;
		left: -60px;
		content: "";
		display: block;
		width: 40px;
		height: 40px;
		color: transparent;
		border-left: 40px solid #000;
		border-right: 40px solid #000;
		border-top: 20px solid #000;
	}
	</style>
{% endhighlight %}
效果图如下：

![house-icon]({{"/img/house-icon.png" | prepend:site.baseurl}})

#### 二、margin

##### **外边界合并问题**

1.两个div都是float：left；的两个水平div的左边的margin-right和右边的margin-left是否会合并？

答案：不会合并! 因为float:left;的div为一个BFC，不与他相邻的元素的margin发生合并。

2.两个div都是float：left；的垂直div的上面的margin-bottom和下面的margin-top是否会合并？（两个div宽度大于屏幕宽度时）

答案：不会合并! 因为float:left;的div为一个BFC，不与他相邻的元素的margin发生合并。

3.没有float的情况下的两个div在垂直方向上会怎样？

答案：会合并！

4.没有float的情况下的两个div在水平方向上又会怎样？（让div的display: inline-block;）

答案：不会合并！因为display: inline-block;的div为一个BFC，不与他相邻的元素的margin发生合并。

总结一下：
毗邻的两个或多个margin会合并成一个margin，叫做外边距折叠。规则如下：

1. 两个或多个毗邻的普通流中的块元素垂直方向上的margin会折叠
2. 浮动元素/inline-block元素/绝对定位元素的margin不会和垂直方向上的其他元素的margin折叠
3. 创建了块级格式化上下文的元素，不会和它的子元素发生margin折叠
4. 元素自身的margin-bottom和margin-top相邻时也会折叠



##### **外边界为负值时**

可以通过margin为负值，实现两列三列布局需要和等高设置,在上篇[横向两列三列布局问题]({{"/css/CSS-rows-position.html" | prepend:site.baseurl}})有介绍。







