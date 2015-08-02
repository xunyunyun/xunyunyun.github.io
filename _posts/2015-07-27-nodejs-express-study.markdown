---
layout: post
category: "nodejs"
title:  "nodejs+express学习"
tags: ["nodejs", "express"]
---


###NodeJs(NodeJs入门)

####一个完整的基于NodeJs的web应用

a.提供web页面，需要一个HTTP服务器

b.对于不同的请求，根据请求的URL，我们的服务器需要给予不同的响应，需要一个路由，用于把请求对应到请求处理程序

c.当请求被服务器接收并通过路由传递之后，需要可以对其进行处理，因此我们需要最终的请求处理程序

d.路由还应该能处理POST数据，并且把数据封装成为更友好的格式传递请求处理程序，因此需哟啊请求数据处理功能。

e.把内容显示出来，需要一些视图逻辑供请求处理程序使用，以便将内容发送给浏览器。

####构建应用的模块

1.一个基础的HTTP服务器

创建文件server.js如下：

    var http = require("http");//require为node.js自带的http模块
    http.createServer(function(request,response){
        response.writeHead(200,{"content-Type":"text/plain"});
        response.write("Hello World");
        response.end();
        }).listen(8888);

执行:```node server.js``` 访问localhost:8888端口即可访问创建的服务器。

分析：

第一行，require为node.js自带的http模块,并复制给http变量

接下来调用http模块提供的函数：createServer。这个函数会返回一个对象，这个对象有一个Listen的方法，这个方法参数可以指定HTTP服务器监听的端口。

    var server = http.createServer();
    server.listen(8888);

2.进行函数传递：

function say(word){
    console.log(word);
}
function execute(someFunction,value){
    someFunction(value);
}
execute(say,"hello");

3.函数传递是如何让服务器工作的？

第一段代码等价于：

    var http = require("http");
    function onRequest(request,response){
        response.writeHead(200,{"content-Type":"text/plain"});
        response.write("Hello World");
        response.end();
    }
    http.createServer(onRequest).listen(8888);

4.基于事件驱动的回调

nodeJs是事件驱动的。

请求是异步的，随时可能到达，但是我们服务器却在一个单一进程中。

创建了服务器，并且向创建它的方法传递一个函数，无论何时我们的服务器收到一个请求，这个函数就会被调用。

    var http = require("http");
    http.createServer(function(request,response){
        console.log("Request received");
        response.writeHead(200,{"content-Type":"text/plain"});
        response.write("Hello World");
        response.end();
        }).listen(8888);
    console.log("Server has started");

这段代码会在运行node server.js时，立马输出Server has started

在我们通过浏览器想服务器发送请求，即输入http://localhost:8888/时，Request recived也会输出到命令行。

5.服务器是如何处理请求的

回调函数onRequest()的主体，有两个参数被传入：request和response

response.writeHead()行数发送一个HTTP状态200和HTTP的内容类型（content-type）,使用response.write()函数在HTTP相应的主体中发送文本Hello world。最后调用response.end()完成响应。

6.服务端的模块放在哪里？

var http = require("http");
function start(){
    function onRequest(request,response){
        console.log("Request received");
        response.writeHead(200,{"content-Type":"text/plain"});
        response.write("Hello World");
        response.end();
    }
    http.createServer(onRequest).listen(8888);
    console.log("Server has started");
}
exports.start = start;

可以创建主文件index.js，并在其中启动HTTP了

服务器的代码仍在server.js中

    var server = require("./server");
    server.start();

请求这个文件并把它指向一个变量，其中已导出的函数就可以被使用了。

通过这种方式，我们可以把不同部分放入不同的文件中，并且通过生成模块的方式把它们连接到一起。

处理不用的HTTP请求在我们的代码中是一个不同的部分，叫做“路由选择”

7.如何来进行请求的“路由”

创建router.js如下：
    
    function route(pathname) {
        console.log("About to route a request for "+pathname);
    }
    exports.route = route;

在主文件index.js中引入

    var router = require("./router");
    server.start(router.route);

8.因为驱动执行

9.路由给真正的请求处理程序

10.让请求处理程序作出响应

因此，我们需要让请求处理程序能够像onRequest函数那样可以和浏览器进行“对话”。

11.不好的实现方式

让请求处理程序通过onRequest函数直接返回，他们要展示给用户的信息。

12.阻塞和非阻塞

    function start() {
        console.log("Request handler 'start' was called");
        function sleep(milliSeconds) {
            var startTime = new Date().getTime();
            while(new Date().getTime()<startTime + milliSeconds);
        }
        sleep(10000);
        return "hello Start";
    }

但由于start()包含了阻塞操作，他阻塞了所有其他的处理工作，会使其他的处理程序也要等待10秒

Node.js可以在不新增额外线程的情况下，依然可以对任务进行并行处理 —— Node.js是单线程的。它通过事件轮询（event loop）来实现并行操作，对此，我们应该要充分利用这一点 —— 尽可能的避免阻塞操作，取而代之，多使用非阻塞操作。

要用非阻塞操作，就需要使用回调，通过将函数作为参数传递给其他需要花时间做处理的函数（比如：休眠10秒，查询数据库，进行大量的计算）

    var exec = require("child_process").exec;
    function start() {
        console.log("Request handler 'start' was called.");
        var content = "empty";
        exec("ls-lah",function(error,stdout,stderr){
            content = stdout;
        });
        return content;
    }


上面代码引入了一个新的Nodejs模块，child_procee。因为他有一个非阻塞操作exec();
他从nodejs来执行一个shell命令。上面例子用它来获取当前路径下所有的文件（ls-lah），然后，当/startURL请求的时候讲文件信息输出到浏览器中。

13.以非阻塞操作进行请求响应

用nodejs就有这样一种实现方案：函数传递。

应用已经可以通过应用各层之间传递值的方式（请求处理程序->请求路由->服务器）将请求处理程序返回的内容（请求处理程序最终显示给用户的内容）传递给HTTP服务器。

14.更有用的场景

服务器，请求有了以及请求程序程序都已经完成了。

（1）处理POST请求

当用户提交表单时，触发/upload请求处理程序处理POST请求的问题。

因为POST请求一般都会比较重，用户可能会输出大量的内容，用阻塞的方式处理大数据量的请求必然会导致用户操作的阻塞。

通过request对象上注册监听器（listener）来实现。这里的request对象是每次接收到HTTP请求，都会把该对象传递给onRequest回调函数。

request.addListener("data",function(chunk){
   //called when a new chunk of data was received 
});
request.addListener("end",function(chunk){
   //called when all chunks of data have been received 
});

    function start(route,handle){
        function onRequest(request,response){
            var postData = "";
            var pathname = url.parse(request.url).pathname;
            console.log("Request for "+pathname+" received.");
            // 设置了接收数据的编码格式为UTF-8，
            request.setEncoding("utf-8");
            // 然后注册了”data“事件的监听器，用于收集每次接收到的新数据块，并将其赋值给postData变量
            request.addListener("data",function(postDataChunk){
                postData += postDataChunk;
                console.log("Received POST data chunk '"+postDataChunk+"'.");
            });
            // 将请求路由的调用移动到end事件处理程序中，以确保他只会当所有数据接收完毕后才触发，并且只触发一次
            // 同时将post数据传递给请求路由，因为这些数据，请求处理程序会用到。
            request.addListener("end",function(){
               route(handle,pathname,response,postData);
            });
           
        }
        http.createServer(onRequest).listen(8888);
        console.log("Server has started");
    }
    exports.start = start;

当前我们把请求的真个消息体传递给了请求路由和请求处理程序。

querystring模块来实现：

    response.write("You are sent the text: "+querystring.parse(postData).text);

（2）处理文件上传

处理文件上传就是处理POST数据

使用该模块，首先需要安装改模块:

```npm install formidable```

    var formidable = require("formidable");

该模块就是将通过HTTP POST请求提交的表单，在Node.js中可以被解析。我们要做的就是创建一个新的IncomingForm，它是对提交表单的抽象表示，之后，就可以用它解析request对象，获取表单中需要的数据字段。

    var formidable = require("formidable");
    var http = require("http");
    var sys = require("sys");
     http.createServer(function(req,res){
        if(req.url =='/upload'&&req.toLowerCase()=='post'){
            var form = new formidable.IncomingForm();
            form.parse(req,function(err,fields,files){
                res.writeHead(200,{"content-Type":"text/plain"});
                res.write("received upload:\n\n");
                res.end(sys.inspect({fields:fields,files:files}));
            });
            return;
        }
        //show a file upload form
        res.writeHead(200,{"content-Type":"text/html"});
        res.end(
            '<form action="/upload" enctype="multipart/form-data" '+ 'method="post">'+
            '<input type="text" name="title"><br>'+
            '<input type="file" name="upload" multiple="multiple"><br>'+
            '<input type="submit" value="Upload">'+
            '</form>'
            );
        
    }).listen(8888);

需要把文件读取到我们的服务器中，使用一个叫fs的模块。


我们需要的就是：

1.在/start表单中添加一个文件上传元素

2.将node-formidable整合到我们的upload请求处理程序中，用于将上传的图片保存到/tmp/test.png

3.将上传的图片内嵌到/uploadURL输出的HTML中

整个过程如下：

server.js

    var http = require("http");
    var url = require("url");
    function start(route, handle){
      function onRequest(request, response){
        var pathname = url.parse(request.url).pathname;
        console.log("Request for "+ pathname +" received.");
        route(handle, pathname, response, request);//路由参数修改
      }
      http.createServer(onRequest).listen(8888);
      console.log("Server has started.");
    }
    exports.start = start;


router.js

    function route(handle,pathname,response,request) {
        console.log("About to route a request for "+pathname);
        if(typeof handle[pathname] === "function"){
            return handle[pathname](response,request);//对应位置修改
        }else {
            console.log("No request handler found for "+pathname);
            response.writeHead(404,{"Content-Type":"text/plain"});
            response.write("404 Not found");
            response.end();
        }
    }
    exports.route = route;


requestHandlers.js

    var querystring = require("querystring"),
        fs = require("fs"),
        formidable = require("formidable");
    function start(response){
      console.log("Request handler 'start' was called.");
      var body ='<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload" multiple="multiple">'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(body);
        response.end();
    }
    function upload(response, request){
      console.log("Request handler 'upload' was called.");
      var form =new formidable.IncomingForm();//调用formidable模块
      console.log("about to parse");
      //通过调用form.parse传递给回调函数的files对象的内容
      form.parse(request,function(error, fields, files){//解析
        console.log("parsing done");
        fs.renameSync(files.upload.path,"/tmp/test.png");//
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
      });
    }
    function show(response){
      console.log("Request handler 'show' was called.");
      fs.readFile("/tmp/test.png","binary",function(error, file){
        if(error){
          response.writeHead(500,{"Content-Type":"text/plain"});
          response.write(error +"\n");
          response.end();
        }else{
          response.writeHead(200,{"Content-Type":"image/png"});
          response.write(file,"binary");
          response.end();
        }
      });
    }
    exports.start = start;
    exports.upload = upload;
    exports.show = show;

index.js:

    var server = require("./server");
    var router = require("./router");
    var requestHandlers = require("./requestHandlers");
    var handle = {};
    handle["/"] = requestHandlers.start;
    handle["/start"] = requestHandlers.start;
    handle["/upload"] = requestHandlers.upload;
    handle["/show"] = requestHandlers.show;
    server.start(router.route,handle);

上面这些就完成了一个Node.js的web应用，技术点：服务端Javascript、函数式编程、阻塞与非阻塞、回调、事件、内部和外部模块。

###Express：

Express是一个简介、灵活的node.js Web应用开发框架，它提供一系列强大的特性，帮助你创建各种web和移动设备应用。