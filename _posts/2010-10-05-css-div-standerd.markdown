---
layout: post
category: "web"
title:  "web标准设计规范(XHTML+CSS)"
tags: [Web,CSS]
---
以下内容摘自《CSS禅意花园》，www.csszengarden.com。

1,为使浏览器正确解析及通过CSS检验，所有文档都必须声明它们所使用的编码语言。
{% highlight html %}
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
{% endhighlight %}

2,用小写书写所有标签，XML对大小写敏感。

3,为图片添加有意义的alt属性。
{% highlight html %}
<img src="logo.png" alt="websit web logo"/>
{% endhighlight %}

4,关闭所有标签，单标签也应该关闭。
{% highlight html %}
<hr/> <br/> <img src="pic.jpg" alt="pic"/>
{% endhighlight %}

5,为所有的属性值加引号，HTML中无需，而XHTML中必须加上。

6,用id属性代替name属性，XHTML中不能使用name属性，应该用id代替。

7,CSS盒模型.<br/>
一个元素的实际宽度：左边界+左加框+左填充+内容宽度+右填充+右边框+右边界。

