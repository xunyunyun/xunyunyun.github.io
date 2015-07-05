---
layout: post
category: "linux"
title:  "Cramfs文件系统的制作"
tags: [Cramfs,linux]
---
当我们用Busybox制作好文件系统后，就可以用Cramfs工具制作自己的文件Cramfs文件系统了。
####一、主要步骤
1.下载Cramfs，去这个地址：http://sourceforge.net/projects/cramfs/，或
<pre>
$wget http://downloads.sourceforge.net/project/cramfs/cramfs/1.1/cramfs-1.1.tar.gz
</pre>

2.解压编译
<pre>
$tar zxvf cramfs-1.1.tar.gz
$mv cramfs-1.1 cramfs
$cd cramfs
$make
</pre>
到此生成了mkcramfs和cramfsck，分别用于分创建Cramfs文件系统和进行Cramfs文件系统的解释及检查。

3.制作Cramfs文件系统  
把用Busybox制作好的文件系统目录（rootfs）复制到本目录，然后执行
<pre>
$./mkcramfs rootfs Cramfs.img
</pre>
文件系统镜像Cramfs.img就可以烧写到目标板了。  
对于Jffs文件系统则类似的用mkfs.jffs2工具制作，Yaffs文件系统则需从网站：http://www.aleph1.co.uk/cgi-bin/viewcvs.cgi/下载，并配置内核，在fs中入对yaffs2编译选项，添加分区等。

####二、内核选项
1.内核配置的时候要加入对Cramfs的支持。  
Memory Technology Device (MTD) support[Y/m/n/?] Y 内存技术设备支持  
MTD partitioning support [Y/m/n/?] Y 支持MTD分区  
Direct char device access to MTD devices [Y/m/n/?] Y MTD字符设备直接访问  
Caching block device access to MTD device [Y/m/n/?] Y MTD块设备缓冲访问  

2.File System中配置  
Compressed ROM file support [Y/m/n/?] Y ROM文件系统支持。


