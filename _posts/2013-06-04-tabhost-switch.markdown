---
layout: post
category: "android"
title:  "TabActivity子Activity以代码进行切换"
tags: [Android,TabActivity]
---
TabActivity子Activity直接以startActivity方式切换子Activity时会有些问题，不过可以这样解决：

1,在TabActivity中加入切换方法，如AppHostActivity.java中：
{% highlight java %}
public void setCurrentTab(int index) {
		try {
			this.tabHost.setCurrentTab(index);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
{% endhighlight %}

2,在AppHostActivity子Activity中这样切换到其它Activity:

{% highlight java %}
((AppHostActivity)getParent()).setCurrentTab(1);
{% endhighlight %}
