---
layout: post
category: "android"
title:  "Android View及ViewGroup知识"
tags: [View,ViewGroup]
---
####一、基本知识
Adroid的UI界面都是由View和ViewGroup及其派生类组合而成的。其中，View是所有UI组件的基类，ViewGroup是容纳这些组件的容器。ViewGroup本身从View派生出来，作为各Layout的基类。

View代表了用户界面组件的一块可绘制的空间块。每一个View在屏幕上占据一个长方形区域。在这个区域内，这个View对象负责图形绘制和事件处理。

ViewGroup可以包含作为叶子节点的View，也可以包含作为更低层次的子ViewGroup，而子ViewGroup又可以包含下一层的叶子节点的View和ViewGroup。

####二、自定义ViewGroup
1.继承ViewGroup。  
2.重写onLayout(根据orientation）及onMeasure。

参考：  
1.<http://www.2cto.com/kf/201109/104633.html>  
2.<http://bbs.csdn.net/topics/370144745>
