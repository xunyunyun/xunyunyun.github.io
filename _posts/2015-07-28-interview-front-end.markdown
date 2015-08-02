---
layout: post
category: "interview"
title:  "前端面试题整理"
tags: ["interview"]
---

[前端开发面试题](http://segmentfault.com/a/1190000000465431)

[寒冬winter的面试题](http://www.moejser.com/post/qian-duan-kai-fa/han-dong-winterde-mian-shi-ti)

[github-interview](https://github.com/h5bp/Front-end-Developer-Interview-Questions)

####[rem和em](http://www.w3cplus.com/css/when-to-use-em-vs-rem.html)

```em``` 和 ```rem```都是相对单位，由浏览器转换为像素值，具体取决于您的设计中的字体大小设置。 如果你使用值 1em 或 1rem，它可以被浏览器解析成 从16px到 160px 或其他任意值。

**最大问题：**

使用```em``` 和 ```rem```单位可以让我们的设计更加灵活，能够控制元素整体放大缩小，而不是固定大小。 我们可以使用这种灵活性，使我们在开发期间，能更加快速灵活的调整，允许浏览器用户调整浏览器大小来达到最佳体验。

**主要区别**

```em``` 和 ```rem```单位之间的区别是浏览器根据谁来转化成```px```值，理解这种差异是决定何时使用哪个单位的关键。

当使用rem单位，转化为像素大小取决于叶根元素的字体大小，即html元素的字体大小。
被设置的大小=根元素字体大小乘以rem值。

当使用em单位时，像素值将是em值乘以使用em单位的元素的字体大小。

*注意：不要误认为em单位是相对于父元素的字体大小。实际上，根据W3C标准，他们是相对于使用em单位的元素的字体大小。*

**浏览器设置HTML元素对字体大小的影响**

默认情况下浏览器通常有字体大小16px，但是可以被用户更改为9px到72px。

**总结 rem与 em 差异**

rem 单位翻译为像素值是由 html 元素的字体大小决定的。 此字体大小会被浏览器中字体大小的设置影响，除非显式重写一个具体单位。

em 单位转为像素值，取决于他们使用的字体大小。 此字体大小受从父元素继承过来的字体大小，除非显式重写与一个具体单位。

####排序问题

####性能优化

####模块化编程

####nodeJS

####渐进增强、优雅降级

渐进增强：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

优雅降级：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

区别：优雅降级是从复杂的现状开始，并试图减少用户体验的供给，而渐进增强则是从一个非常基础的，能够起作用的版本开始，并不断扩充，以适应未来环境的需要。

####link和@import的区别

1.link是HTML方式，@import是CSS方式

2.link最大限度支持并行下载，@import过多嵌套导致串行下载，出现FOUC

3.link可以通过rel='alternate stylesheet'指定候选样式

4.浏览器对link支持遭遇@import，可以使用@import对老式浏览器隐藏样式。

5.@import必须在样式规则之前，可以在CSS文件中引用其他文件

6.总体来说：link优于@import

####sessionStorage，localStorage，cookie区别

1.都会在浏览器保存，有大小限制，同源限制

2.cookie会在请求时发送到服务器，作为会话标识，服务器可修改cookie；web storage不会发送到服务器

3.cookie有path概念，子路径可以访问父路径cookie，父路径不可访问子路径cookie

4.有效期：cookie在设置的有效期内有效，默认为浏览器关闭；sessionStorage在窗口关闭前有效，localStorage长期有效，直到用户删除。

5.共享：sessionStorage不能共享，localStorage在同源文档之间共享，cookie在同源且符合path规则的文档之间共享

6.localStorage的修改会触发其它文档窗口的update事件

7.cookie有secure属性要求HTTPS传输

8.浏览器不能保存超过300个cookie，单个服务器不能超过20个，每个cookie不能超过4K。web stotrage大小支持达到5M。

####浏览器内核

IE的内核为Trident   ```-ms```

firefox的内核为Gecko   ```-moz```

Safari的内核为Webkit   ```webkit```

chrome的内核为Blink(Webkit的分支)   ```webkit```

Opera的内核为Blink   ```webkit```

####如何处理HTML5新标签的浏览器兼容问题？如

IE8/7/6支持通过document.createElement方法产生的标签，可以利用这一特性让浏览器支持HTML5新标签，浏览器支持新标签后，还需要添加标签默认的样式。

当然最好的方式是直接使用成熟的框架、使用最多的是htmlshim框架

    <!--[if IE 9]>
    <script src="http://html5shim.google.com/svn/trunk/html5.js"></script>
    <![endif]-->

####语义化的理解

html语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；在没有样式CSS情况下也以一种文档格式显示，并且是容易阅读的。搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于SEO。使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

####iframe的缺点

iframe会阻塞主页的onload事件

iframe和主页共享连接池，而浏览器对相同域的链接有限制，所以会影响页面的并行加载

使用iframe之前需要考虑这两个缺点。如果需要使用iframe，最好是通过javascript动态给iframe添加src属性值，可避开上面两个问题。

####可继承的样式

font-size，font-family，color，cursor，visible 等。

####nodeJS的适用场景

高并发、聊天、实时消息推送

####js的数据类型

number，string，boolean，object，undefined

####模块化怎么做？（高级程序设计第7章模块模式）

立即执行函数，不暴露私有成员

var module = (function(){
    var count = 0;
    var m1 = function(){};
    var m2 = function(){};
    return {
        m1:m1,
        m2:m2
    };
})();

####Jquery与jQuery UI 有啥区别？

jQuery是一个js库，主要提供的功能是选择器，属性修改和事件绑定等等。

jQuery UI则是在jQuery的基础上，利用jQuery的扩展性，设计的插件。 提供了一些常用的界面元素，诸如对话框、拖动行为、改变大小行为等等

####jquery中如何讲述组转化为json字符串，然后再转化回来

    $.fn.stringifyArray = function(array) {
        return JSON.stringify(array)
    }
    $.fn.parseArray = function(array) {
        return JSON.parse(array)
    }


####那些操作会造成内存泄露

内存泄露是指任何对象在您不在拥有或需要它之后仍然存在。垃圾回收器定期扫描对象，并计算引用了每个对象的其他对象的数量。如果一个对象的引用属性为0，或对该对象的唯一引用是循环的，那么该对象的内存即可回收。