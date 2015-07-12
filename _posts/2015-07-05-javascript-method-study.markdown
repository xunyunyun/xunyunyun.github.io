---
layout: post
category: "Javascript"
title: "实现一些小功能"
tags: ["月影课堂问题"]
---

####1.判断是否为素数

{% highlight javascript %}

function isPrime(number){
    var temp = Math.sqrt(number);
    if(number <= 1){ return false;}
    for(var i = 2; i <= temp;i++){
        if(number%i===0){
            result=false;
            break;
        }
    }
    return result;
}
console.log(isPrime(7));

{% endhighlight %}

