---
layout: post
category: "web"
title:  "性能优化"
tags: ["web"]
---

####雅虎WEB前端网站优化----34条军规

1.最少的HTTP请求

图片、CSS、script、flash等这些都会增加http请求数，减少这些元素的数量就能减少相应时间。把多个JS和CSS在可能的情况下写在一个文件中，页面里直接写入图片也是不好的做法，应该写进CSS里，利用CSS sprite将小图合并后background来定位。

２.利用CDN技术

CDN（内容分发网络）

３.设置头文件过期或静态缓存

浏览器会用缓存来减少http请求数来加快页面加载的时间，如果页面头部加一个很长的过期时间，浏览器就会一直缓存页面里的元素。不过这个如果里面的内容变换的话，需要修改名字，否则用户端不会主动刷新，看自己衡量了。

４.Gzip压缩

Gzip格式是一种很普遍的压缩技术，几乎所有的浏览器都有解压缩Gzip格式的能力，而且它可以压缩的比例非常大，一般压缩率为85%。

５.把CSS放顶部

６.把JS放底部

７.避免CSS表达式

８.将JS和CSS外链

前面讲到了缓存，用一些比较公用的JS或CSS，就可以使用外链的形式，如从google上外链来的Jquery文件，如果浏览器在别的网页中下载并缓存了这个文件，那么就不用再次下载了

９.减少ＤＮＳ查找

减少网站从外部调用资源

１０.精简CSS和JS

１１.避免跳转（重定向）

１２.剔除重复的JS和CSS

１３.配置Etags

Entity tags（ETags）（实体标签）是web服务器和浏览器用于判断浏览器缓存中的内容和服务器中的原始内容是否匹配的一种机制（“实体”就是所说的“内容”，包括图片、脚本、样式表等），是比last-modified date更更加灵活的机制，单位时间内文件被修过多次，Etag可以综合Inode(文件的索引节点(inode)数)，MTime(修改时间)和Size来精准的进行判断，避开UNIX记录MTime只能精确到秒的问题。 服务器集群使用，可取后两个参数。使用ETags减少Web应用带宽和负载。

１４.使用AJAX可缓存

利用时间戳，更精巧的实现相应可缓存与服务器数据同步更新

１５.尽早刷新输出缓存

尤其对CSS，JS文件的并行下载更有意义

１６.使用GET来完成AJAX请求

当使用XMLHttpRequest时，浏览器中的post方法是一个“两步走”的过程：首先发送文件头，然后才发送数据。在URL小于2Ｋ时使用GET获取数据时更加有意义。
POST型

	ajax.open("POST", url, true);
	ajax.onreadystatechange = function()
	{
		if (ajax.readyState == 4 && ajax.status == 200)
		{
			func_succ(ajax.responseText);
		}
		else
		{
			alert('ajax faild readyState:'+ajax.readyState+" status:"+ajax.status);
		}
	};
	//调用XHR（ajax）对象的setRequestHeader()方法，可以设置自定义的请求头部信息
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	//post_datas发送的数据信息
	ajax.send(post_datas);

POST型：

	ajax.open("GET", url, true);
	ajax.onreadystatechange = function()
	{
		if (ajax.readyState == 4 && ajax.status == 200)
		{
			//调用传过来的func_succ()函数，传入响应主体返回的文本
			func_succ(ajax.responseText);
		}
		else
		{
			//alert("ajax faild readyState:"+ajax.readyState+" status:"+ajax.status);
		}
	};
	//send才是真正发送。send后，请求被分派到服务器。如果不需要发送数据，直接设置参数为null
	ajax.send(null);

１８.延迟加载

确定页面运行正常后，再加载脚本来实现如拖放和动画，或者是隐藏部分的内容以及折叠内容等。

１９.预加载

２０.减少DOM元素个数

使用更合适或者在语义上更贴切的标签，要考虑大量DOM元素中循环的性能开销。

２１.根据域名划分页面内容

很显然，是最大限度的实现平行下载

２２.尽量减少iframe的个数

考虑即使内容为空，加载也需要时间，会阻止页面加载，没有语意，注意iframe相对于其他DOM元素高出1-2个数量级的开销，它会在典型方式下阻塞onload事件，IE和Firefox中主页面样式表会阻塞它的下载。

２３.避免404

ＨＴＴＰ请求时间消耗是很大的

２４.减少Cookie的大小

２５.使用无Cookie的域

２６.减少DOM访问

缓存已经访问过的有关元素。线下更新完节点之后再将它们添加到文档树中。避免使用JS来修改页面布局。

２７.开发智能事件处理程序

事件代理（利用事件冒泡机制）

２８.用<link>代替@import

在IE中，页面底部@import和使用<link>是一样的，但最好不要用。

29.避免使用滤镜

30.优化图像

将GIF转化为png

３１.优化CSS　sprite

在Sprite中水平排列你的图片，垂直排列会稍稍增加文件大小;

Sprite中把颜色较近的组合在一起可以降低颜色数，理想状况是低于256色以便适用PNG8格式;

便于移动，不要在Sprite的图像中间留有较大空隙。这虽然不大会增加文件大小但对于用户代理来说它需要更少的内存来把图片解压为像素地图。 

100×100的图片为1万像素，而1000×1000就是100万像素。

３２.不要再HTML中缩放图像

不要为了在HTML中设置长宽而使用比实际需要大的图片。如果你需要：

	<img width='100' height='100' src='mycat.jpg' alt='My Cat' />

那么你的图片（mycat.jpg）就应该是100×100像素而不是把一个500×500像素的图片缩小使用。

３３.favicon.ico要小而且可缓存

34.保持单个内容小于25K

35.打包组件成复合文本
