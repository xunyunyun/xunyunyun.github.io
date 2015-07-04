---
layout: post
category: "android"
title: "友盟统计正式包无数据问题"
tags: ["友盟统计"]
---
若发现debug包运行时有数据上报，而签名打包后无数据上报，则是由于混淆造成的。  
需要对umeng的jar包的类保持不被混淆，proguard.cfg文件中加入：  

    -keep class com.umeng.** { *;}
    -keep class u.aly.** { *;}


（完~）
