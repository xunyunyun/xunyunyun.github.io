---
layout: post
category: "android"
title:  "让Android ProgressDialog在按返回键可dismiss"
tags: [Android,ProgressDialog]
---
让ProgressDialog可按返回键时dismiss，但空白区不dismiss。
{% highlight java %}
progressDialog.setCanelable(true);
progressDialog.setCanceledOnTouchOutside(false)
{% endhighlight %}