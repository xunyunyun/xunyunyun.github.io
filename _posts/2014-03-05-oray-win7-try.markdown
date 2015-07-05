---
layout: post
category: "network"
title:  "Win7花生壳公网映射80端口的问题"
tags: [Win7,花生壳]
---
之前在一台Win XP上开启Tomcat(80端口)，选择花生壳“开启外网HTTP80端口”，映射完成后，通过域名是可以正常访问的。

但换了台Win7，同样的方法却失效了，提示“很抱歉，您访问的花生壳动态域名不在线，请稍后再尝试访问！”。可是，当不选择“开启外网HTTP80端口”，通过每次映射自动生成的端口号，则域名可以访问了。

搜索找到了解决办法：<http://blog.csdn.net/dahaidao/article/details/6442537>

这样一来，“开启外网HTTP80端口”又有效了。