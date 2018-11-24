---
layout: post
category: "构建工具"
title:  "构建工具对比"
tags: ["webpack4", "parcel", "rollup"]
---

主要对比以下三种构建工具进行介绍：

webpack

parcel

rollup

### 项目构建做什么？

代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 等。

文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。

代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。

模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。

自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。

代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。

自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

---《深入浅出webpack》

**总结来说**

线上: 代码转换 混淆 压缩 代码分割 模块合并 生成hash 处理文件的依赖关系等

本地：代码转换 代码分割 模块合并 处理文件的依赖关系 sourceMap 自动刷新

JS：代码转化 混淆 压缩 合并等等

CSS：代码转化  压缩 合并 预处理（postcss：加前缀处理浏览器兼容）等等

### 关于构建过程的名词

#### 1. sourmap

1）概念

代码会压缩、合并、编译等。调试时需要看到源代码来调试问题。Sourcemap就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。 ---（http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html）

2）构建工具

webpack：devtool属性，此选项控制是否生成，以及如何生成source map。使用 SourceMapDevToolPlugin 进行更细粒度的配置。查看 source-map-loader 来处理已有的 source map。

parcel：只可控制启用或禁用sourcemaps。精简版不支持sourmap

rollup：支持sourmap。

#### 2. HMR

（Hot Module Replacement）模块热替换。

1）概念

它允许在运行时更新各种模块，而无需进行完全刷新。

2）构建工具

webpack: webpack-dev-server | webpack-hot-middleware，需要webpack进行特定的配置才可以，不可直接使用。

parcel：parcel watch index.html | parcel index.html 开发环境自动启动，无需任何配置代码。

rollup：rollup.watch | watch配置    文件改变后，会重新走构建。

#### 3. Tree-shaking

1）概念

tree shaking是一个术语，通常用于描述移除JavaScript上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

rollup是天然支持tree shaking，tree shaking可以剔除依赖模块中没有被使用的部分，这对于第三方依赖（node_moduels依赖）非常有帮助，可以极大的降低包的体积。 ---来着网络。

使用ES6，静态分析代码中的import，并将排除任何未实际使用的代码。这允许您架构于现有工具和模块之上，而不会增加额外的依赖或使项目的大小膨胀。例如，在使用 CommonJS 时，必须导入(import)完整的工具(tool)或库(library)对象。

```js
// 使用 CommonJS 导入(import)完整的 utils 对象
var utils = require( 'utils' );
var query = 'Rollup';
// 使用 utils 对象的 ajax 方法
utils.ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

但是在使用 ES6 模块时，无需导入整个 utils 对象，我们可以只导入(import)我们所需的 ajax 函数：

```js
// 使用 ES6 import 语句导入(import) ajax 函数
import { ajax } from 'utils';
var query = 'Rollup';
// 调用 ajax 函数
ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

webpack：webpack2开始支持，webpack4扩展支持。
parcel：不支持
rollup：支持；因为rollup只引入最基本最精简代码，所以可以生成轻量、快速，以及低复杂度的 library 和应用程序。因为这种基于显式的 import 和 export 语句的方式，它远比「在编译后的输出代码中，简单地运行自动 minifier 检测未使用的变量」更有效。

#### 4. 处理模块依赖关系

gulp: 需要借助requireJS & browserify & webpack

webpack: 可以将入口的依赖文件合并到一个文件

parcel: 可以将入口的依赖文件合并到一个文件

rollup: 可以将入口的依赖文件合并到一个文件，也可以设置依赖的文件为单独文件。

#### 5. devServer

webpack: webpack-dev-server

parcel: parcel index.html 自动启动

rollup: 文档没有提到

但是我们一般都有node Server，为了保证启动两个服务器不影响用户的访问

webpack: webpack-dev-middleware | webpack-dev-server + proxy 将webpack服务器代理node服务器；访问webpack的端口就可以拿到所有的服务数据。

parcel: app.use(bundler.middleware()) + node服务器中使用服务端渲染html必须是构建生成的html（因为里面引入的JS/CSS才是构建后的静态文件）但是这样就需要先构建，在服务器端渲染；先parcel watch，再启动node服务；或者node服务器中使用服务端渲染html必须是构建前的html，根据构建的parcel-manifest再得到对应的静态JS/CSS文件。

rollup: 文档没有提到

#### 6. 输出文件大小

rollup < webpack < parcel

rollup远小于另两种构建方式。下面给出对比图片：

rollup打包生成文件：


全选后文件有174字符，打包时间 27ms。

webpack打包生成文件：

一屏没有截完，都没有截到我们想看到的代码。

全选后文件有4625字符，打包时间 122ms。

parcel:

一屏没有截完，都没有截到我们想看到的代码。

全选后文件有8421字符，打包时间 556ms。（其实第一次打包文件的效率并不高）。

上面看rollup的产出，简直完美有没有，模块完全消失了，rollup通过顺序引入到同一个文件来解决模块依赖问题，rollup的方案如果要做拆包的话就会有问题，因为模块完全透明了，但这对于库开发者来说简直就是最完美的方案。 ---网上找的

**上面的测试，可以得出结论：**

如果只是单纯的打包js文件及依赖的JS文件时，rollup一定是首选。

#### 7. 构建入口文件

1) webpack：

支持多入口配置入口只能是js文件，js可依赖CSS/模板语言（handlebars\ejs\nunjucks）只要有对应的loader.

2) parcel：

支持多入口先后构建  支持*.html  支持nunjucks入口支持js/html， js可依赖CSS， html可依赖js/cssjs是否支持模板语言的引入（nunjucks前端模板引擎直接使用有问题，安装了插件也不可以，需要自己手动配置模板引擎的编译过程）。

3) rollup：不支持多入口  不支持*.html  不支持nunjucks。

    报错：Multiple inputs are only supported for experimentalCodeSplitting（实验脱脂）

入口只能是js文件，js不可依赖CSS/html等。

就是一个js的打包器，通常用于打包npm包。

#### 8. 配置文件

webpack：支持配置文件

parcel：css/js 有单独配置文件

rollup：支持配置文件

#### 9. 支持typescript

webpack：支持typescript，需要配置loader

parcel：支持typescript，无需配置

rollup：支持typescript，需要引入插件：rollup-plugin-typescript

### **总结**

一个nunjucks实现前后端同构渲染的项目中构建示例得出的结论；还缺少单页应用中的构建示例

1. parcel 

基于html文件收集依赖，不用处理hashmap

适合小项目的快速构建，基本不需要配置；

零配置的缺点就是太多默认配置和实现。

不支持前端模板引擎(文档、源码都找了，以为posthtmlrc配置会支持)：资料太少，遇到问题不好解决；

官网说单入口，但是可以实现多入口。单页应用和其他应用都可以。

2. rollup

适合打包npm包 。

纯js文件的构建过程。

入口唯一。

或者用gulp来实现CSS相关的处理，但是感觉项目级别的构建不是这个工具的目标。

不适用于项目级别的构建，一般项目中不可能没有CSS文件。

3. webpack

 功能强大，插件丰富。

适合大项目的构建，自适应性强，可操作性强。
