---
layout: post
category: "http"
title:  "将url转化为对象"
tags: ["URL"]
---

####javascript程序如下：

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

####实现结果：
![house-icon]({{"/img/urlToObject.png" | prepend:site.baseurl}})