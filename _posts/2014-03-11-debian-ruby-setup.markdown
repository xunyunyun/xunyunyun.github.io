---
layout: post
category: "linux"
title:  "Debian/Linux ruby setup"
tags: [linux,Debian,ruby]
---
有别于Windows下的rubyinstall+devkit安装与配置。Debian/Linux下方便多了。

####一、安装Git
{% highlight bash %}
sudo apt-get install git
{% endhighlight %}

####二、安装C/C++开发环境
{% highlight bash %}
sudo apt-get install build-essential
{% endhighlight %}

####三、安装ruby开发环境
{% highlight bash %}
sudo apt-get install ruby irb rdoc ruby-dev
{% endhighlight %}

####四、安装ruby gem
安装好ruby的基本开发环境后，就可以安装ruby gem了，如jekyll：<br/>
{% highlight bash %}
sudo gem install rdiscount jekyll redcarpet
{% endhighlight %}
