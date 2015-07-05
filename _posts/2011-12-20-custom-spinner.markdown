---
layout: post
category: "android"
title:  "Android Spinner自定义适配器"
tags: [Android]
---
想让Android的Spinner+Adapter也能像ListView+Adapter那样自由适配任意(信息)列表数据，直接继承ArrayAdapter或BaseAdapter的方法来重写Adapter是不行的，必须实现Android提供的SpinnerAdapter接口来定制Spinner的Adapter才能达到所需效果。

Github：<https://github.com/allthelucky/android-develop-kits/tree/master/CustomSpinner>