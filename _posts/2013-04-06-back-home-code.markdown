---
layout: post
category: "android"
title:  "返回系统HOME桌面"
tags: [Android,HOME]
---
在程序里不关闭应用，返回到系统HOME桌面的代码：

{% highlight java %}
Intent intent = new Intent();
intent.setAction(Intent.ACTION_MAIN);
intent.addCategory(Intent.CATEGORY_HOME);
startActivity(intent);
{% endhighlight %}

