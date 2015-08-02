---
layout: post
category: "javascript"
title:  "模块化编程"
tags: ["javascript","模块化"]
---

####阮一峰的日志之模块化编程

#####浏览器环境

对于浏览器，模块都放在服务器端，等待时间取决于网速的快慢，可能要等待很长时间，浏览器处于假死状态。

因此，浏览器端的模块，不能采用“同步加载”，只能使用“异步加载”，这就是AMD规范诞生的背景。

#####AMD

AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

也采用require()语句加载模块，但是不同于CommonJS，它要求两个参数：

    require([module],callback);

第一个参数[module]，是一个数组，里面的成员就是要加载的模块；第二个参数callback，则是加载成功之后的回调函数。

    require(['math'], function (math) {
        math.add(2, 3);
    });

math.add()与math模块加载不是同步的，浏览器不会发生假死。所以很显然，AMD比较适合浏览器环境。

#####require.js的用法

1.require.js的加载

a.放网页底部加载

b.

    <script src="js/require.js" defer async="true"></script>

async属性表明这个文件需要异步加载，避免网页失去响应。IE不支持这个属性，只支持defer，所以把defer也写上。

记载自己的代码main.js如下：

    <script src="js/require.js" data-main="js/main"></script>

data-main属性的作用是，指定网页程序的主模块。在上例中，就是js目录下面的main.js，这个文件会第一个被require.js加载。由于require.js默认的文件后缀名是js，所以可以把main.js简写成main。

2、主模块的写法如下：

    //main.js
    require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC){
        // some code here
    });

加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块。

require()异步加载moduleA，moduleB和moduleC，浏览器不会失去响应；它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。

假定主模块依赖jquery、underscore和backbone这三个模块，main.js就可以这样写：

    require(['jquery', 'underscore', 'backbone'], function ($, _, Backbone){
        // some code here
    });

3、模块的加载

使用require.config()方法，我们可以对模块的加载行为进行自定义。require.config()就写在主模块（main.js）的头部。参数就是一个对象，这个对象的paths属性指定各个模块的加载路径。

    require.config({
        paths: {
            "jquery":"jquery.min",
            "underscore":"underscore.min",
            "backbone":"backbone.min"
        }
    });

上面的代码给出了三个模块的文件名，路径默认与main.js在同一个目录（js子目录）。如果这些模块在其他目录，比如js/lib目录，则有两种写法。一种是逐一指定路径。

    require.config({
        paths: {
            "jquery":"lib/jquery.min",
            "underscore":"lib/underscore.min",
            "backbone":"lib/backbone.min"
        }
    });

另一种则是直接改变基目录（baseUrl）。

    require.config({
        baseUrl: "js/lib",
        paths: {
            "jquery":"jquery.min",
            "underscore":"underscore.min",
            "backbone":"backbone.min"
        }
    });

如果某个模块在另一台主机上，也可以直接指定它的网址，比如：

    require.config({
        paths: {
　　　　　　"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min"
        }
    });

require.js要求，每个模块是一个单独的js文件。这样的话，如果加载多个模块，就会发出多次HTTP请求，会影响网页的加载速度。因此，require.js提供了一个优化工具，当模块部署完毕以后，可以用这个工具将多个模块合并在一个文件中，减少HTTP请求数。

4.AMD模块的写法

require.js加载的模块，采用AMD规范。模块必须按照AMD的规定来写。

模块必须采用特定的define()函数来定义。如果一个模块不依赖其他模块，可以直接定义在define()函数之中。

5.加载非规范的模块

理论上，require.js加载的模块，必须是按照AMD规范、用define()函数定义的模块。但是实际上，虽然已经有一部分流行的函数库（比如jQuery）符合AMD规范，更多的库并不符合。那么，require.js是否能够加载非规范的模块呢？

回答是可以的。

require.config()接受一个配置对象，这个对象除了有前面说过的paths属性之外，还有一个shim属性，专门用来配置不兼容的模块。具体来说，每个模块要定义（1）exports值（输出的变量名），表明这个模块外部调用时的名称；（2）deps数组，表明该模块的依赖性。

####为什么要用模块化的Javascript？

解决了两大问题：

1.恼人的命名冲突

通过exports暴露接口。这意味着不需要命名空间，更不需要全局变量。这是一种彻底的命名冲突解决方案。

2.繁琐的文件依赖

通过require引入依赖，则可以让依赖内置，开发者只关心当前模块的依赖，其他事情Seajs都会自动处理好。对模块开发者来说，这是一种很好的关注度分离。

####NodeJS

1.node要求一个js文件对应一个模块。可以把文件中的代码想象成是一个包在一个匿名函数中，所有代码都在匿名函数中，其它模块不可访问除exports外的私有变量。

2.使用exports导出API

3.使用require加载其他模块

####模块定义

AMD: Asynchronous Module Definition 异步模块定义 RequireJS

CMD：Common Module Definition 通用模块定义 SeaJS

AMD和CMD是不兼容的，不能在一个页面共存。

####SeaJs解决实现前端模块化

命名冲突和文件依赖，是前端开发过程中的两个经典问题。下来我们看如何通过模块化开发来解决。为了方便描述，我们使用 Sea.js 来作为模块化开发框架。

Sea.js 是一个成熟的开源项目，核心目标是给前端开发提供简单、极致的模块化开发体验。

使用Sea.js,在书写文件时，需要遵守CMD模块定义规范。

util.js变成如下：

    define(function(require,exports) {
        exports.each = function(arr) { };
        exports.log = function(str) { };
    });

通过exports就可以向外提供接口。这样就可以调用它，dialog.js 如下

    define(function(require,exports){
        var util = require('./util.js');
        exports.init = function() { };
    });

通过require('./util.js');就可以拿到util.js中通过exports暴露的接口。```require```可以认为是Sea.js给Javascript语言增加的一个语法关键字，通过```require```可以获取其他模块提供的接口。

在页面使用dialog.js 将变得很简单。

    <script src="sea.js"><script>
    <script>
        sea.use('dialog',function(Dialog) {
            Dialog.init( );
        });
    </script>

首先要在页面中引入 sea.js 文件，这一般通过页头全局把控，也方便更新维护。想在页面中使用某个组件时，只要通过 seajs.use 方法调用。

好好琢磨以上代码，我相信你已经看到了 Sea.js 带来的两大好处：

A.通过 exports 暴露接口。这意味着不需要命名空间了，更不需要全局变量。这是一种彻底的命名冲突解决方案。

B.通过 require 引入依赖。这可以让依赖内置，开发者只需关心当前模块的依赖，其他事情 Sea.js 都会自动处理好。对模块开发者来说，这是一种很好的 关注度分离，能让程序员更多地享受编码的乐趣。

**小结**

除了解决命名冲突和依赖管理，使用 Sea.js 进行模块化开发还可以带来很多好处：

A.模块的版本管理。通过别名等配置，配合构建工具，可以比较轻松地实现模块的版本管理。

B.提高可维护性。模块化可以让每个文件的职责单一，非常有利于代码的维护。Sea.js 还提供了 nocache、debug 等插件，拥有在线调试等功能，能比较明显地提升效率。

C.前端性能优化。Sea.js 通过异步加载模块，这对页面性能非常有益。Sea.js 还提供了 combo、flush 等插件，配合服务端，可以很好地对页面性能进行调优。

D.跨环境共享模块。CMD 模块定义规范与 Node.js 的模块规范非常相近。通过 Sea.js 的 Node.js 版本，可以很方便实现模块的跨服务器和浏览器共享。
