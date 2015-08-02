---
layout: post
category: "ajax"
title:  "ajax全接触[慕课网]"
tags: ["ajax","json"]
---

####ajax原理

XHR对象来向服务器发异步请求，从服务器获得数据，然后用JS来操作DOM而更新页面的过程。

####XHR(XMLHttpRequest)对象

用XHR和web服务器进行数据的异步交换。

	var request = new XMLHttpRequest();
 
 但这种方法不适用于IE6，解决方案为：

 	if(window.XMLHttpRequest) {
 		request = new XMLHttpRequest();
 	}esle{
 		request = new ActiveObject("Microsoft.XMLHTTP");
 	}

####一个完整的HTTP请求：

 1.建立TCP连接（3次握手）
 2.web浏览器向web服务器发送请求头部发送请求
 3.web浏览器向web服务器发送请求头部
 4.web服务器应答
 5.web服务器发送响应头部
 6.web服务器向浏览器发送数据
 7.web服务器关闭TCP连接

####XMLHttpRequest发送请求

	open(method,url,async);

method:get|post;
async:true|false;true为异步

	send(string);  

执行发送到服务器。对于get来说，是不发送send语句的，可直接写成：

	request.open('get','index.php',true);
	request.send();

若有参数时，需要加一条头部信息语句,写成如下：

	request.open('post','index.php',true);
	request.setRequestHeader("Context-type","application/x-www-form-urlencoded");
	request.send("name='张三'&sex='男'");

 ####XMLHttpRequest获得响应

```responseText```：获得字符串形式的响应数据

```responseXML```:获得XML形式的响应数据

```status``` 和 ```statusText```：以数字和文本的形式返回HTTP状态码

```getAllResponseHeader()```： 获取所有的响应头部

```getResponseHeader()```:  获取响应头部的某个字段值

```readyState```：属性值为:
	
	0:请求未初始化，open未调用
	1：服务器连接已建立，open已调用
	2：请求已连接，接收到响应数据
	3：请求处理中，接收到响应主体
	4：请求已完成，响应已完成。

{% highlight javascript %}
request.open("GET", "server.php?number=" + document.getElementById("keyword").value);
request.send();
request.onreadystatechange = function(){
	if(request.readyState === 4 && request.status === 200 ){
		console.log(request.responseText);
	}else{
		alert('request readyState:'+request.readyState+" status:"+request.statusText);
	}
}
{% endhighlight %}

####服务器端实现

1.对于get型：

{% highlight php %}
	Header("Content-Type:text/plain;charset=utf-8");
	if ($_SERVER["REQUEST_METHOD"] == "GET") {
		search();
	} elseif ($_SERVER["REQUEST_METHOD"] == "POST"){
		create();
	}

function search(){
	//检查是否有员工编号的参数
	//超全局变量 $_GET 和 $_POST 用于收集表单数据
	if (!isset($_GET["number"]) || empty($_GET["number"])) {
		echo "参数错误";
		return;
	}
	//获取number参数
	$number = $_GET["number"];
	$result = '{"success":false,"msg":"没有找到员工。"}';

}
{% endhighlight %}

2.对于post型

{% highlight php %}
function create(){
	//判断信息是否填写完全
	if (!isset($_POST["name"]) || empty($_POST["name"])
		|| !isset($_POST["number"]) || empty($_POST["number"])
		|| !isset($_POST["sex"]) || empty($_POST["sex"])
		|| !isset($_POST["job"]) || empty($_POST["job"])) {
		echo "参数错误，员工信息填写不全";
		return;
	}
	//TODO: 获取POST表单数据并保存到数据库
	。。。
	//提示保存成功
	echo "员工：" . $_POST["name"] . " 信息保存成功！";
}
{% endhighlight %}

####用Jquery实现ajax

```jquery.ajax([settings])```

	type: post|get等
	url：地址
	data：一个对象，发送的数据
	dataType：预期服务器返回类型
	success：function，请求成功后执行，传入返回的数据及包含成功代码的字符串
	error：function，请求失败后执行，传入XMLHttpRequest对象。

{% highlight javascript %}
$.ajax({
	type:'POST',
	url:'serverjson.php',
	data:{
			name:$("#name").val(),
			number:$("#number").val(), 
			...
		 },
	dataType:'json',
	success:function(data){
		if(data.success){
			$("#result").html(data.msg);
		}esle{
			$("#result").html("出现错误："+data.msg);
		}
	}

})

{% endhighlight %}


####跨域处理方式

#####**什么是跨域？**

http://www.abc.com:8080/scripts/jquery.js
	
```http://``` :协议 

```www```：子域名

```abc.com```：主域名

```8080```：端口号

```scripts/jquery.js```：请求资源地址

当协议，子域名，主域名，端口号中有人一个不同时，则为不同域；不同域之间相互请求资源为跨域。

出于安全起见，不允许跨域调用其他页面的对象。

#####**处理跨域的三种方式**

**1.代理**：

在同域名的web服务器上创建一个代理（属于后台技术）

**2.jsonp**

借用```<script>```标签可跨域访问的特性。

对于原生js实现

在www.aaa.com页面中：

	<script>
		function jsonp(json){
			alert(json["name"]);
		}
	</script>
	<script src="www.bbb.com/jsonp.js"></script>

在第一个```<script>```标签中定义函数jsonp()
第二个```<script>```可向不同域名www.bbb.com提交http请求，请求jsonp.js文件；而这个文件中会调用jsonp()这个方法。

在www.bbb.com页面中：

	jsonp({"name":"张三"，"age":23});


对于jQuery来实现：
	
前端代码：	
	
	$.ajax({
			type:'GET',
			dataType:'jsonp',
			jsonp:'callback',//只是一个与后端匹配的名字
			...
		})

后台代码：
	
	$jsonp = $_GET["callback"]; //对应前端名字
	$result = $jsonp.'({"success":false,"msg":"没有找到员工。"})';

这就是jsonp方法的实现过程

缺点是：jsonp只能对get请求起效果，不支持post请求。

**3.XHR2(html5新特性)**

在客户端不需要改动

在服务器端仅需修改header头部即可。

	header("Access-Control-Allow-Origin:*");
	header("Access-Control-Allow-Method:POST,GET");

第一句表示所有域名的服务器均可访问；后面也可以设置特定的域名。

第一句表示只对POST和GET方法可访问；

XHR2缺点:IE10以下版本不支持。