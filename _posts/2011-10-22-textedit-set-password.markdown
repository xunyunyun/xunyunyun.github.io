---
layout: post
category: "android"
title:  "Android EditText控件的密码输入框可见性设置："
tags: [Android,EditText]
---
{% highlight java %}
public void showAsPassword(show) {
    if (show) {
     passEdit.setInputType(0x90);
    } else {
     passEdit.setInputType(0x81);
    }
}
{% endhighlight %}
