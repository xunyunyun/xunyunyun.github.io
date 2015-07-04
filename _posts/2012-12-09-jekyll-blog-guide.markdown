---
layout: post
category: "network"
title:  "Windows下Jekyll指南"
tags: [Jekyll,Windows]
---

提示：尽量用1.9.x版本的RubyInstaller，已含运行Jekyll所需的yajl依赖包。RubyInstallerv2.0以上版本需自行安装yajl-ruby，容易出错。

一、安装Ruby执行环境

rubyinstaller-1.9.3-p392.exe,安装，很简单。

DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe，解压到C:\DevKit，然后cmd进入该目录执行：
{% highlight bash %}
ruby dk.rb init
ruby dk.rb review
ruby dk.rb install
ruby --version
{% endhighlight %}

输出ruby 1.9.3p392 (2013-02-22) [i386-mingw32]则表明Ruby安装成功。

二、安装Rdiscount及Jekyll

{% highlight bash %}
gem install rdiscount
gem install jekyll
jekyll --version
{% endhighlight %}

输出类似Jekyll 0.12.1信息则Jekyll安装成功。

三、执行Jekyll

进入Jekyll所在目录

{% highlight bash %}
jekyll --server
{% endhighlight %}

浏览器输入http://localhost:4000/看到设置的主页则Jekyll运行成功。
备注：

Jekyll网站文件最好以UTF-8无BOM格式存储 。

Jekyll运行报invalid byte sequencd in GBK时，可修改jekyll安装目录下convertible.rb第28行为self.content = File.read(File.join(base, name),:encoding=>"utf-8")即可。(C:\Ruby193\lib\ruby\gems\1.9.1\gems\jekyll-0.12.1\lib\jekyll\convertible.rb)。

Jekyll运行报Liquid error: incompatible character encodings: UTF-8 and GBK时，可添两个环境变量：LC_ALL=en_US.UTF-8，LANG=en_US.UTF-8。(在安装ruby成功后添加）
