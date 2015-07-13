---
layout: post
category: "http"
title:  "将url转化为对象"
tags: ["URL, 正则表达式"]
---


####方法一

	/* 
	 *<javascript语言精粹>中的例子：用来匹配URL的正则表达式
	 *
	 *分开下面的正则表达式如下分析
	 *
	 *对于(?:([A-Za-z]+):)?
	 *这个可选的因子匹配的是协议名scheme，其中(?:   )表示非捕获型分组，最后的?表示可选，重复0次到1次。
	 *里面的（ ）表示一个捕获型分组。将会复制它所匹配的文本，并将其放入result数组中。
	 *每个捕获型分组都有一个编号，依次为1,2,3,4.。。该分组为result[1]。
	 *[ ]中表示匹配A-Za-z任意的字符，+表示匹配一次或多次。
	 *
	 *对于(\/{0,3})
	 *这个因子匹配的是slash。捕获/，用\表示转义。{0,3}表示匹配0到3次。
	 *
	 *对于([0-9.\-A-Za-z]+)
	 *这个因子匹配的是主机名host。由一个或多个的数字、字母、或.或-组成；-需要\来转义。
	 *
	 *对于(?::(\d+))?
	 *这个可选的因子将匹配端口号port，它由一个前置:加上1个或多个数字而组成的序列。\d表示一个数字字符。
	 *
	 *对于(?:\/([^?#]*))?
	 *可选因子将匹配文件路径path，它由/开始。之后的字符类[^?#]以一个^开始，表示不包含？和#之外的所有字符。
	 * *表示这个字符将被匹配0次或多次。
	 *
	 *(?:\?([^#]*))?
	 *可选因子将匹配查询语句query，这个分组包含0个或多个非#字符。
	 *
	 *(?:#(.*))?
	 *可选分组将匹配hash，以#开始，.将匹配除行结束符之外的所有字符。
	 */ 

{% highlight javascript %}
var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = "http://www.ora.com:80/goodparts?q#fragment";
// 调用parse_url的exec方法。如果能够成功的匹配，它将返回一个数组，该数组包含了这个url中提取出来的片段。
var result = parse_url.exec(url);
var names = ['url','scheme','slash','host','port','path','query','hash'];
var blanks = '      ';
var i;
// blanks.slice(names[i].length)是为了显示的时候，结果的左边是左对齐的。
for (i = 0; i < names.length; i++) {
	console.log(names[i]+':'+blanks.slice(names[i].length),result[i]);
}
{% endhighlight %}

#####实现结果：

![house-icon]({{"/img/urlToObject0.png" | prepend:site.baseurl}})


####方法二

#####javascript程序如下：

	/**
	 * 解析一个url并生成window.location对象中包含的域
	 * location:
	 * {
	 *      href: '包含完整的url',
	 *      origin: '包含协议到pathname之前的内容',
	 *      protocol: 'url使用的协议，包含末尾的:',
	 *      username: '用户名', // 暂时不支持
	 *      password: '密码',  // 暂时不支持
	 *      host: '完整主机名，包含:和端口',
	 *      hostname: '主机名，不包含端口'
	 *      port: '端口号',
	 *      pathname: '服务器上访问资源的路径/开头',
	 *      search: 'query string，?开头',
	 *      hash: '#开头的fragment identifier'
	 * }
	 *
	 * @param {string} url 需要解析的url
	 * @return {Object} 包含url信息的对象
	 */
	 
{% highlight javascript %}
function parseUrl(url) {
    var result = {};
    var keys = ['href', 'origin', 'protocol', 'host',
                'hostname', 'port', 'pathname', 'search', 'hash'];
    var i, len;
    var regexp = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

    var match = regexp.exec(url);

    if (match) {
        for (i = keys.length - 1; i >= 0; --i) {
            result[keys[i]] = match[i] ? match[i] : '';
        }
    }

    return result;
}
var url = "http://bbs.byr.cn/#!default";
console.log(parseUrl(url));
{% endhighlight %}

#####实现结果：

![house-icon]({{"/img/urlToObject.png" | prepend:site.baseurl}})

这种方法来自网络，未详细看，测试未发现问题。
