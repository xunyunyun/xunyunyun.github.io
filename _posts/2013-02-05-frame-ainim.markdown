---
layout: post
category: "android"
title:  "Android AnimationDrawable实现GIF效果动画"
tags: [Android,AnimationDrawable]
---
利用AnimationDrawable实现类似gif效果的动画：
{% highlight java %}
final AnimationDrawable drawable = new AnimationDrawable();
drawable.addFrame(activity.getResources().getDrawable(R.drawable.kaiguan), 750);//添加图片帧到AnimationDrawable
drawable.addFrame(activity.getResources().getDrawable(R.drawable.kaiguan2), 1250);
drawable.setOneShot(false);//设置为循环播放
ImageView imageView = (ImageView)findViewById(R.id.imageView);
imageView.setImageDrawable(drawable);//AnimationDrawable对象给imageView
drawable.start();//动画播放
drawable.stop();//动画停止
{% endhighlight %}

