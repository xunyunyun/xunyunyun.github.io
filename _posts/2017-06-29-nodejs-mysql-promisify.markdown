---
layout: post
category: "promise"
title:  "node中mysql异步操作的promise化"
tags: ["promise","promisify"]
---

#### 背景介绍
上节介绍的各种数据库操作都是异步操作，但是提供的query函数是回调函数的形式，而我们希望通过promise对象的形式进行操作。避免多级嵌套函数的出现。因此，我们需要将这种回调函数的形式进行promise化，转化成一个promise对象。
```js
pool.query(SQL, callback)
```

#### 如何把callback接口包装成Promise接口

现在实现这个方法的库：
1. bluebird模块里的promisify方法
2. es6-promisify模块
3. ThinkJS里面的promisify方法

这些都需要引入一下不必要的东西，为了更轻量的实现，我们直接通过如下函数实现：
```js
// ES6
let promisify = (fn, receiver) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn.apply(receiver, [...args, (err, res) => {
                return err ? reject(err) : resolve(res);
            }])
        })
    }
}
// ES5
var promisify = function(fn, receiver){
    return function(){
        var args = [].slice.call(arguments);
        return newPromise(function(resolve, reject){
            fn.apply(receiver, [].concat(args, [function(err, res){
                return err ? reject(err) : resolve(res);
            }]));
        })
    }
}
```
很容易理解，返回的函数的结果是一个promise对象。

举个callback的栗子
```js
var fs =  require('fs');
fs.readFile('foo.json', 'utf8', function(err, content){
    if(err){
        // todo something1
    }else{
        // todo something2
    }
})
// 通过上面的readFile函数转成promise接口如下：
var fs =  require('fs');
promisifyReadFile = promisify(readFile, fs);
promisifyReadFile('foo.json', 'utf8').then((res)=>{
    // todo something2
}).catch((err)=>{
    // todo something1
});
```
