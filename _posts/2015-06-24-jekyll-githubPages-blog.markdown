---
layout: post
title:  "Jekyll和github Pages搭建博客"
categories: "blog"
tags: ["jekyll"]
---

#### 配置jekyll环境

需要安装Ruby -> 安装RubyGems —> 安装jekyll

使用RubyGems安装Jekyll：

    gem install jekyll

创建jekyll工作环境

    jekyll new my-awesome-site

进入工作环境中：

    cd my-awesome-site

实时监控数据变换：

    jekyll server --watch

此服务器的默认端口号为4000，下面就可以通过访问：

    http://localhost:4000

来实时的查看jekyll搭建的博客的显示状况

#### github Pages

github Pages可以被认为是用户编写的、托管在github上的静态网页。

github提供模板，允许站内生成网页，但也允许用户自己编写网页，然后上传。有意思的是，这种上传并不是单纯的上传，而是会经过Jekyll程序的再处理。

    mkdir jekyll_demo

对该目录进行git初始化

    cd jekyll_demo
    git init 

创建一个没有父节点的分支gh-pages。因为github规定，只有该分支中的页面，才能生成网页文件。

    git checkout --orphan gh-pages

#### jekyll

jekyll是一个简单免费的Blog生成工具，类似于wordPress。它只是一个生成一个静态网页的工具，不需要数据库提供支持。可免费部署到github上。

##### 1.默认文件夹组成如下图：

![jekyll网站目录]({{"/img/jekyll-docs.png" | prepend:site.baseurl}})

| 文件/目录 |    描述  |
| :-------- | :--------|
|_config.yml | 配置文件,保存配置数据 |
|_includes | 可以加载这些部分到布局或文章中以方便重用。通过这个标签 \{ %include aaa.html %\} 来把文件 ```_includes/aaa.html``` 包含进来 |
|_layouts | 是包裹在文件外部的模板。布局可以在YAML头信息中根据不同文章进行选择。标签\{\{ content \}\} 可以将content插入页面中 |
|_posts |存放实际的文章内容。文件名必须为YEAR-MONTH—DATE-TITLE.markdown格式。|
|_site |存放最终生成的文件|
|index.html | 如果这些中包含YAML头信息部分，jekyll就会自动将它们转换。 |

对于目录下的每个文件，使用YAML头信息之后，都会被转化格式，然后生成最终文件。

##### 2.YAML头信息

任何只要包含YAML头信息的文件在jekyll中都能被当做一个特殊的文件来处理。

预定义的全局变量

| 变量名称 |    描述  |
| :-------- | :--------|
|```layout```| 如果设置的话，会指定使用该模板文件。制定模板文件的时候不需要扩展名。模板文件需要放在```_layout``` 目录下 |
|```permalink```| 让博客中URL不同于config.yml中默认值，当设置这个变量后，就会使用最终的URL地址 |
|```published```| 当站点生成时，如果不需要展示一个具体的博客，可以设置这个变量为false |
|```category```| 指定类别 |
|```tags```| 指定标签 |

下面都省去了\{ % % \}来避免显示问题

1.文章的目录

    for post in site.posts
        //post.url等
    endfor 

2.文章摘要

    post.excerpt

如果你不喜欢自动生成摘要，你可以在文章的YAML中增加excerpt来覆盖它。完全禁止掉可以将excerpt_separator设置成"".

3.高亮代码

     highlight javascript 
     endhighlight 

也可改为html，css等。

##### 4.常用变量

site：来自_config.yml文件，全站范围的信息+配置

page：页面专属的信息+YAML头文件信息，通过YAML头文件自定义的信息都可以在这里被获取。

content：被layout包裹的那些Post或者Page渲染生成的内容。但是又没定义在Post或者Page文件中的变量

paginator：每当paginate配置选项被设置了的时候，这个变量就可用了。**用于分页**


1).对于全站（site）变量

site.time：当前时间（跑jekyll这个命令的时间点）。

site.pages：所有 Pages 的清单。

site.posts：一个按照时间倒叙的所有 Posts 的清单。

2).对于页面（page）变量

page.content：页面内容的源码。

page.title：页面的标题。

page.excerpt：页面摘要的源码。

page.url：帖子以斜线打头的相对路径，例子：/2008/12/14/my-post.html。

page.date：帖子的日期。日期的可以在帖子的头信息中通过用以下格式 YYYY-MM-DD HH:MM:SS (假设是 UTC), 或者 YYYY-MM-DD HH:MM:SS +/-TTTT ( 用于声明不同于 UTC 的时区， 比如 2008-12-14 10:30:00 +0900) 来显示声明其他日期/时间的方式被改写，

page.id：帖子的唯一标识码（在RSS源里非常有用），比如 /2008/12/14/my-post

page.categories：这个帖子所属的 Categories。Categories 是从这个帖子的 ```_posts``` 以上 的目录结构中提取的。距离来说, 一个在``` /work/code/_posts/2008-12-24-closures.md``` 目录下的 Post，这个属性就会被设置成 ['work', 'code']。不过 Categories 也能在YAML头文件信息中被设置。

page.tags:这个Post所属的所有tags。Tags是在YAML头文件信息中被定义的。

page.path:Post或者Page的源文件地址。举例来说，一个页面在GitHub上得源文件地址。 这可以在YAML头文件信息中被改写。

page.next：当前位置post在site.posts中后一个post

page.previous：当前位置post在site.posts中前一个post

3).对于分页器（Paginator）

paginator.per_page：每一页Posts的数量。

paginator.posts：这一页可用的Posts。

paginator.total_posts：Posts的总数。

paginator.total_pages：Pages的总数。

paginator.page：当前页号。

paginator.previous_page：前一页的页号。

paginator.previous_page_path：前一页的地址。

paginator.next_page：下一页的页号。

paginator.next_page_path：下一页的地址

本博客搭建的过程中没有使用分页器。



