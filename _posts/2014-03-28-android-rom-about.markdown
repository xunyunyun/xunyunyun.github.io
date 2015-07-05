---
layout: post
category: "android"
title:  "Android ROM包制作及刷机过程简介"
tags: [android, ROM]
---
####一、Android ROM种类
1.Bootloader ROM，连接PC刷机，面向技术人员。  
2.Recovery ROM，Recovery模式刷机，面向普通用户。

####二、Bootloader ROM的组成（img为linux镜像文件）
1.系统镜像：system.img，相当于linux下的system下的所有文件及目录，确定内核空间大小。  
2.用户镜像：userdata.img，包含用户的数据，确定用户空间大小。  
3.Linux内核镜像：boot.img，Linux内核镜像。  
4.Recovery镜像: recovery.img  
5.Bootloader镜像:bootloader.img  
前三个镜像是必须的，后面两个可选。可单独一个一个刷，也可整体刷写。

Bootloader ROM的制作，参考<http://www.cyanogenmod.org/>。  
下载编译后，生成system.img,userdata.img,boot.img,recovery.img，用fastboot进行刷机操作。  
不建议刷bootloader.img，可能刷成砖头。

system.img解压system.img.raw  
mount system.img.rao ./system，可修改img中的内容。  
重新打包成原始system.img。

####三、Recovery ROM的组成（实质为一个ZIP文件，关键制作Edify脚本）
META-INFO目录：包含存储签名文件及更新脚本文件。  
system目录：要复制到system分区的文件。  
boot.img：镜像文件。  
比较多适合制作升级文件。

制作Recovery ROM，参考<http://www.clockworkmod.com/>  
进入Recovery模式(电源+音量键)进行刷机。

####参考
<http://edu.51cto.com/lesson/id-13375.html>  
<http://www.miui.com/thread-1271033-1-1.html>

