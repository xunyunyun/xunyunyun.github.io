---
layout: post
category: "jQuery"
title:  "jQuery技术内幕学习-1-2章"
tags: ["jQuery","源码解析"]
---

### 总体架构

1.3自调用匿名函数

    (function(window,undefined){
        var jQuery = ...
        //
        window.Query = window.$ = jQuery;
    })(window);

手动把jQuery添加到window对象上，明确地使变量jQuery成为公开的全局变量，而其他的部分是私有的。

2）传入window对象

 可以使window对象变成局部变量（即把函数参数作为局部变量使用），这样当在jquery代码块中访问window对象时，不需要将作用域链回退到顶级作用域，从而更快的访问window对象。

### 构造jQuery对象

jQuery对象由构造函数jQuery()创建，$()是jQuery()的缩写。

2.1 构造函数jQuery()

(5) jQuery(callback)
如果传入一个函数，则在document上绑定一个ready事件监听函数，当DOM结构加载完成时执行。ready事件的触发要早于load事件。ready事件并不是浏览器原生事件，而是DOMContentLoaded事件、onreadystatechange事件和函数doScrollCheck()的统称。

jQuery.fn.init.prototype = jQuery.fn时，用构造函数jQuery的原型对象覆盖了构造函数jQuery.fn.init()的原型对象，从而使构造函数jQuery.fn.init()的实例也可以访问构造函数jQuery的原型方法和属性。


#####未完成