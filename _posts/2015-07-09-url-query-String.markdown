---
layout: post
category: "http"
title:  "URL中查询语句解析"
tags: ["url","http"]
---

####查询语句解析的javascript实现

{% highlight javascript %}
// 找出url中的查询语句
function parseQueryString(url){
	var obj = {};
	var keyvalue = [];
	var key = "";
	var value = "";
	if(url.indexOf('?') === -1) return null;
	var paraString = url.slice(url.indexOf('?')+1,url.length).split("&");
	for(var i = 0,len = paraString.length; i < len; i++){
		keyvalue = paraString[i].split("=");
		key = keyvalue[0];
		value = keyvalue[1];
		obj[key] = value;
	}
	return obj;

}

var url2 = "https://developer.mozilla.org/en-US/search?q=trim";
console.log(parseQueryString(url2));

{% endhighlight %}