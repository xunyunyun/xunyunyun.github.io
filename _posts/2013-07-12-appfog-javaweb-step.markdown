---
layout: post
category: "web"
title:  "Appfog Java Web操作指南"
tags: [Appfog, Java Web]
---
按以下步骤操作：

1,注册appfog.com账号，创建应用xxx<br/>
2,安装Rubyinstaller，选择1.93版本的<br/>
3,升级gem，执行gem update --system<br/>
4,安装appfog.com部署工具af，执行gem install af<br/>
5,进入要上传的目录(其下可以放war包，也可以是Webroot下文件），执行af login，af update xxx

当修改后再次更新时，最好af logout一下，重新af login.
