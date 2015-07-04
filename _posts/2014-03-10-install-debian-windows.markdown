---
layout: post
category: "linux"
title:  "Windows安装Debian Linux步骤"
tags: [linux,Debian,Windows]
---
本文中使用Win7，Xp应该类似；Debian使用7.4。

####一、下载文件
下载debian-7.4.0-i386-CD-1.iso,(http://cdimage.debian.org/debian-cd/7.4.0/i386/iso-cd/debian-7.4.0-i386-CD-1.iso)  
下载vmlinuxz,initrid.gz,boot.img.gz(http://ftp.debian.org/debian/dists/Debian7.4/main/installer-i386/20130613+deb7u1+b2/images/hd-media/)

####二、准备FAT32分区及Debian文件系统空间
备份F备数据并删除该盘，再重建一FAT32新F盘，用于存放debian-7.4.0-i386-CD-1.iso安装文件，并留多数空闲空间用作Debian文件系统空间。  
考备下载好的debian-7.4.0-i386-CD-1.iso文件到F盘，Daemon tool加载iso并运行setup.exe，选择常规模式(注意，最后一步先不忙立即重启)。
考备下载的vmlinuxz,initrid.gz,boot.img.gz，到C:\win32-loader目录，替换原有文件之后再重启。

####三、系统安装
重启进入引导入时，选择Continue to install process，即开始进入Debian图形化安装流程了。  
如果可连网，建议选择安装Gome等必须组件，否则安装完成只有基本系统了。

####四、部分问题
debian-7.4.0-i386-CD-1.iso必须存放在FAT32文件系统根目录下(DVD格式iso过大，FAT32文件系统不支持)。  
不能使用debian-7.4.0-i386-CD-1.iso自身解压出来的vmlinuxz,initrid.gz,boot.img.gz，必须替换。
