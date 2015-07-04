---
layout: post
category: "android"
title:  "Android NDK 编译"
tags: [Android,NDK]
---
安装cygwin，.bashprofile末加入：
{% highlight bash %}
ANDROID_NDK=/cygdrive/d/android/android-ndk-r6b
export ANDROID_NDK
{% endhighlight %}

一、生成.h文件
以Android工程为例，进到目录，执行：
{% highlight bash %}
javah -classpath bin/classes com.sample.test.HelloWorld
{% endhighlight %}

二、编译
进到目录，执行：
{% highlight bash %}
$ANDROID_NDK/ndk-build clean
$ANDROID_NDK/ndk-build
{% endhighlight %}
