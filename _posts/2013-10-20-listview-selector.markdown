---
layout: post
category: "android"
title:  "Android GridView去边距"
tags: [Android,GridView]
---

为GridView添加android:listSelector="@null"可去掉其与item的间距。

当动态为item设置背景时，用android:listSelector="@null"时，条目的选中效果不是自己所设置的，各种尝试后，发现设置成@android:color/transparent又正常了。

难道"@android:color/transparent"和"@null"不都是表示透明吗？