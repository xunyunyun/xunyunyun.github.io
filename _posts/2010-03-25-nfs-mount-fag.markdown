---
layout: post
category: "linux"
title:  "NFS挂载记事"
tags: [NFS]
---
虚拟机下因为网路不通未能挂上(以前好像可以，现在见鬼了挂不上了)，只好在全LINUX尝试了。当网络可以相互PING通了，进行以下操作：

1,设置/etc/exports，添加 /dir/ domain(rw,async,no_root_squash)。<br/>
2,然后关掉iptables，再开rpcbind(2.4内核中为portmap)，再开nfs服务。<br/>
3,注意，rpcbind必须在nfs之前开启，最后再在目标机上挂载吧。<br/>
4,挂载 mount -t nfs IP:/dir /mnt，将/dir目录挂载到/mnt，然后 cd /mnt 就可以看到/dir目录下的文件了。

一点感悟：在全Linux下你的技术才会进展得快，Windows下虽然可以用虚拟机来使用Linux，开了Windows多半就用不上几下Linux又回Windows下了，要想翻过院墙，先把帽子扔过去吧，这样才你会全力以赴。