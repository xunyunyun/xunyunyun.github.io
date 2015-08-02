---
layout: post
category: "javascript"
title:  "闭包"
tags: ["闭包"]
---

####理解闭包的两种情况

1.函数作为返回值

    function fn() {
        var max = 10;
        return function bar(x) {
            if(x >max) {
                console.log(x);
            }
        };
    }
    var f1 = fn();//bar作为返回值，赋值给f1变量
    f1(15);//执行f1时，用到了fn作用域下的max变量的值。

2.函数作为参数传递

    var max = 10，
        fn = function (x) {
            if(x > max) {
                console.log(x);
            }
        };
    (function(f) {
        var max = 100;
        f(15);//执行f(15)时，max变量的取值为10，而不是100；
        //从创建函数fn的作用域取值。
    })(fn);//fn函数作为一个参数被传递进入另一个函数，赋值给f参数。

自由变量块作用域取值时，**要去创建这个函数的作用域取值，而不是“父作用域”。**

执行上下文栈时，我们提到当一个函数被调用完成之后，其执行上下文环境将被销毁，其中的变量也会被同时销毁。有些情况下，函数调用完成之后，其执行上下文环境也不会被销毁。这就是需要理解闭包的核心内容。