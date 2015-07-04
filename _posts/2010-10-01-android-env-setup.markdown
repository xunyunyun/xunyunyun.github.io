---
layout: post
category: "android"
title:  "Android开发环境搭建 "
tags: [Android]
---
几个月前就想试一试Android开发环境，当时觉得麻烦就没有动手。现在闲时把所用文件下载之后安装了一下，原来事实并没有想像中的那样烦琐。

###1.安装JDK，JRE是不够的。
下载jdk-6u21-windows-i586.exe<br/>
安装到C:\Program Files\Java\jdk1.6.0_21<br/>
添加环境变量JAVA_HOME，值为C:\Program Files\Java\jdk1.6.0_21<br/>
环境变量PATH中填添%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;<br/>
添加环境变量CLASSPATH，值设为.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar<br/>

###2.下载Android SDK，解压。
解压后Android sdk目录为D:\Androidand\sdk

###3.下载eclipse，解压。
解压后eclipse目录为D:\Androidand\eclipse

###4.进入eclipse目录
运行eclipse.exe，在Help>Install New Software下添加ADT插件，所用网址http://dl-ssl.google.com/android/eclipse，安装Android Development Tools。

####5.eclipse添加Android SDK路径。
Windows>Preference>Android>Android SDK设置为D:\Androidand\sdk<br/>
大致就完成了，结下来就可以在eclipse开发Android应用程序了。

原文：<http://blog.chinaunix.net/uid-22985736-id-130137.html>