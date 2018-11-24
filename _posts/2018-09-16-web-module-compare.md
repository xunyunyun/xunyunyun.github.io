---
layout: post
category: "module"
title:  "前端模块化"
tags: ["module"]
---


对于浏览器原生，预编译工具和node，不同环境中的模块化方案也不同；

由于浏览器环境不能够解析第三方依赖，所以浏览器环境需要把依赖也进行打包处理；

不同环境下引用的文件也不相同，下面通过一个表格对比下：

| 特征 |浏览器（script,AMD,CMD）|预编译工具（webpack,rollup）|Node|
| --------   | -----:  | -----:  | -----:  |
|引用文件|index.aio.js|index.esm.js|index.js|
|模块化方案|UMD|ES Module|commonjs|
|自身依赖|打包|打包|打包|
|第三方依赖|打包|不打包|不打包|

AMD & CMD & CommonJS & ES6

CommonJS 和 ES6的区别

CommonJS 值的拷贝 运行时加载。

ES6 值的引用 编译时输出接口。


babel编译的入口需要CommonJS（node支持），之后用ES6才可以。

|模块化方式 | 处理依赖方式 |
| --------  | :----:  |
| AMD | requireJS + 在构建时需要生成依赖Map文件，依赖关系传给require函数。 | 
| CommonJS | nodeJS可直接用，前端可以借助browserify来使用commonJs规范下的模块； |
| ES6 | babel编译后可使用在node端和浏览器端。babel可以将 ES6 模块转为 CommonJS 模块或 AMD 模块的写法，从而在浏览器中使用。 | 

CommonJS 和 ES6：

依赖管理方法browserify 将依赖的文件合并为一个文件，携带了所有模块的源码及其依赖关系，所以叫做模块map。

webpack 文件预处理，将依赖写入同一个文件。

requireJS 是运行时模块加载器，在构建阶段只需要进行依赖收集，运行时在进行依赖文件的加载。

browserify & webpack 是一个预编译的过程，在构建阶段需要预编译文件，将依赖文件和源文件合并。


```js
;(function (name, definition) {
// 检测上 文环境是否为AMD CMD
var hasDefine = typeof define === 'function',
// 检查上 文环境是否为Node
hasExports = typeof module !== 'undefined' && module.exports;
if (hasDefine) {
// AMD环境 CMD环境 define(definition);
} else if (hasExports) {
// 定义为 通Node模块 module.exports = definition();
} else {
// 将模块的执行结  在window 量中 在  器中this  window对象 this[name] = definition();
}
})('hello', function () {
var hello = function () {};
return hello; });
```