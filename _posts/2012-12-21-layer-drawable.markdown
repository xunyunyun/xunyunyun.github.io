---
layout: post
category: "android"
title:  "Android Resource下图片合成(LayerDrawable)"
tags: [Android,LayerDrawable]
---
###给一个背景,背景中的一部分可变的,以下方法可以从Resouce中合成(动态改变userimg图片):
{% highlight java %}
public LayerDrawable test(Context context, dynamicImg) {
	LayerDrawable layerDrawable =(LayerDrawable) context.getResources().getDrawable(R.drawable.layerlist);
	Drawable drawable = context.getResources().getDrawable(R.drawable.ic_launcher);
	layerDrawable.setDrawableByLayerId(R.id.userimage, dynamicImg);
	return layerDrawable;
}
{% endhighlight %}

###drawable下的layerlist.xml文件:
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/ic_launcher"/>
    <item android:drawable="@drawable/ic_launcher"
    android:id="@+id/userimage"
    android:left="10dp" android:right="10dp"
    android:bottom="10dp"
    />
</layer-list>
{% endhighlight %}
