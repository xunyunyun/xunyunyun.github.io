---
layout: post
category: "nodejs"
title:  "node多进程学习"
tags: ["nodejs","process"]
---

#### node进程

1. node是单进程单线程的服务器引擎，不管有多么强大的硬件，只能利用到单个CPU进行计算。一个Node进程只能利用一个核, 这将抛出Node实际应用的第一个问题：如何充分的利用多核CPU服务器。
2. 由于Node执行在单线程上，一旦单线程上抛出的异常没有被捕获，将会引起整个进程的崩溃。这将抛出Node实际应用的第一个问题：如何保证进程的健壮性和稳定性。

所以有了第三方的cluster，让node可以利用多核CPU实现并行。

#### child_process模块

child_process.fork()函数实现进程的复制。

```js
// worker.js
var http = require('http'); http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('Hello World\n');
}).listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1');
// master.js
var fork = require('child_process').fork;
var cpus = require('os').cpus();
for(var i = 0; i < cpus.length; i++) {
    fork('./worker.js');
}
```
```shell
node master.js // 运行node多进程代码
ps aux | grep worker.js // 查看进程状态
```
这就是著名的Master-Worker模式,又称主从模式。
进程分为两种：主进程和工作进程。
主进程不负责具体业务处理，负责调度或管理工作进程，它是趋向于稳定的。
工作进程负责具体的业务处理, 因为业务的多种多样,甚至一项业务由多人开发完成,所以工作进程的稳定性值得开发者关注。

1. 创建子进程

child_process模块给予Node可以随意创建子进程的能力。他提供了四个方法用于创建子进程：

    spawn()：启动一个子进程来执行命令
    exec()：启动一个子进程来执行命令，与spawn()不同的是其接口不同，它有一个回调函数获知子进程的状况。
    execFile()：启动一个子进程来执行可执行文件
    fork()：与spawn()相似，不同点在于它创建Node的子进程只需要指定执行的Javascript文件模块即可。

spawn()与exec()、execFile()不同的是，后两者创建时可以指定timeout属性设置超时时间，一旦创建的进程运行超过设定的时间将会被杀死。

exec()与execFile()不同的是,exec()适合执行已有的命令, execFile()适合执行文件。
```js
var cp = require('child_process');
cp.spawn('node', ['worker.js']);
cp.exec('node worker.js', function (err, stdout, stderr) {
    // some code
});
cp.execFile('worker.js', function (err, stdout, stderr) { 
    // some code
}); 
cp.fork('./worker.js');
```

可执行文件是指可直接执行的文件，如果是Javascript文件通过execFile()运行，它的首行内容必须添加如下代码：
#!/usr/bin/env node

2. 进程间通信

在Master-Worker模式中，要实现主进程管理和调度工作进程的功能，需要主进程和工作进程之间的通信。

对于chile_process模块，创建好了子进程，然后与父子进程间通信是十分容易的。

WebWorker允许创建工作线程并在后台运行，使得一些阻塞较为严重的计算不影响主线程的UI渲染。它的API如下所示：
```js
// master.js
var worker = new Worker('worker.js');
worker.onmessage = function(event){
    document.getElementById('result').textContent = event.data;
};
// worker.js
var n=1;
search: while (true) {
    n+=1;
    for (var i = 2; i <= Math.sqrt(n); i += 1)
        if (n % i == 0) continue search;
    // found a prime
    postMessage(n); 
}
```
主线程与工作线程之间通过onmessage()和postMessage()进行通信, 子进程对象则由send()方法实现子进程向主进程发送数据, message事件实现收听子进程发来的数据, 与API在一定程度上相似。

Node示例：
```js
// parent.js
var cp = require('child_process');
var n = cp.fork(__dirname + '/sub.js');
n.on('message', function (m) { 
    console.log('PARENT got message:', m);
});
n.send({hello: 'world'});
// sub.js
process.on('message', function (m) { 
    console.log('CHILD got message:', m);
});
process.send({foo: 'bar'});
```
通过fork()或者其他API,创建子进程之后, 为了实现父子进程之间的通信, 父进程与子进程之间将会创建IPC通道。

通过IPC通道,父子进程之间才能通过message和send()传递消息。

1) 进程间通信原理

IPC（inter-Process communication），即进程间通信。

进程间通信的目的是为了让不同的进程能够互相访问资源并进行协调工作。

实现进程间通信的技术有很多，如命名管道、匿名管道、socket、信号量、共享内存、消息队列、Domain Socket等。

Node实现IPC通过的是管道（pipe）技术。在Node中管道是个抽象层面的称呼，具体细节实现有libuv提供。

表现在应用层上的进程间通信只有简单的message事件和send()方法，接口十分简洁和消息化。

父进程在实际创建子进程之前，会创建IPC通道并监听它，然后才真正创建出子进程，并通过环境变量告诉子进程这个IPC通道的文件描述符。
子进程在启动的过程中，根据文件描述符去连接这个已存在的IPC通道，从而完成父子进程之间的连接。

建立连接之后的父子进程就可以自由地通信了，由于IPC通道是用管道或者Domain Socket创建的，它们与网络socket的行为比较类似，属于双向通信。

不同的是它们在系统内核中就完成了进程间的通信，而不是经过实际的网络层，非常高效。

在Node中，IPC通道被抽象为stream对象，在调用send()时发送数据，接收到的消息会通过message事件触发给应用层。

只有启动的子进程是Node进程时，子进程才会根据环境变量去链接IPC通道，对于其他类型的子进程则无法实现进程间通信，除非其他进程页按约定去链接这个已经创建好的IPC通道。

3. 句柄传递：

建立好进程之间的IPC后,如果仅仅只用来发送一些简单的数据,显然不够我们的实际应用使用。

```js
var http = require('http'); 
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n'); 
}).listen(8888, '127.0.0.1');
```

这时只有一个工作进程能够监听到该端口上, 其余的进程在监听的过程中都抛出了EADDRINUSE异常, 这是端口被占用的情况, 新的进程不能继续监听该端口了。

这个问题破坏了我们将多个进程监听同一个端口的想法。要解决这个问题,通常的做法是让每个进程监听不同的端口,其中主进程监听主端口(如80), 主进程对外接收所有的网络请求, 再将这些请求分别代理到不同的端口的进程上。

通过代理,可以避免端口不能重复监听的问题, 甚至可以在代理进程上做适当的负载均衡, 使得每个子进程可以较为均衡地执行任务。

由于进程每接收到一个连接, 将会用掉一个文件描述符,因此代理方案中客户端连接到代理进程, 代理进程连接到工作进程的过程需要用掉两个文件描述符。

操作系统的文件描述符是有限的, 代理方案浪费掉一倍数量的文件描述符的做法影响了系统的扩展能力。

为了解决上述这样的问题, Node在版本v0.5.9引入了进程间发送句柄的功能。send()方法除了能通过IPC发送数据外, 还能发送句柄, 第二个可选参数就是句柄, 如下所示
```js
child.send(message, [sendhandle])
```

句柄是一种可以用来标识资源的引用, 它的内部包含了指向对象的文件描述符。

比如句柄可以用来标识一个服务器端socket对象、一个客户端socket对象、一个UDP套接字、 一个管道等。

发送句柄意味着什么？

我们可以去掉代理这种方案，使得主进程接收到socket请求后，将这个socket直接发送给工作进程，而不是重新与工作进程之间建立新的socket连接来转发数据。


```js
// 主进程代码：parent.js
var child = require('child_process').fork('child.js');
// Open up the server object and send the handle 
var server = require('net').createServer(); 
server.on('connection', function (socket) {
    socket.end('handled by parent\n'); 
});
server.listen(1337, function () { 
    child.send('server', server);
});
// 子进程代码：child.js
process.on('message', function (m, server) { 
    if (m === 'server') {
        server.on('connection', function (socket) { 
            socket.end('handled by child\n');
        }); 
    }
});
```
这个例子中直接将一个TCP服务器发送给了子进程。

将服务发送给多个子进程：   
```js
// parent.js
var cp = require('child_process'); 
var child1 = cp.fork('child.js'); 
var child2 = cp.fork('child.js');
// Open up the server object and send the handle 
var server = require('net').createServer(); 
server.on('connection', function (socket) {
    socket.end('handled by parent\n'); 
});
server.listen(1337, function () { 
    child1.send('server', server); 
    child2.send('server', server);
});
// 子进程代码：child.js
process.on('message', function (m, server) { 
    if (m === 'server') {
        server.on('connection', function (socket) { 
            socket.end('handled by child, pid is' + process.pid + '\n');
        }); 
    }
});
```

测试的结果每次都不同，结果可能被父进程处理，也可能被不同的子进程处理。并且这是在TCP层面上完成的事情，下面尝试在http层面来试试。

对于主进程而言，可以更轻量一些，将服务器句柄发送给子进程之后，就可以关掉服务器的监听，让子进程来处理请求：

```js
// parent.js
var cp = require('child_process');
var child1 = cp.fork('child.js'); 
var child2 = cp.fork('child.js');
// Open up the server object and send the handle 
var server = require('net').createServer(); // TCP服务器
server.listen(1337, function () {
    child1.send('server', server);  // server是TCP服务器
    child2.send('server', server);
    // 关闭主进程服务器的监听
    server.close();
});
// 子进程代码：
// child.js
var http = require('http'); // HTTP服务器
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('handled by child, pid is ' + process.pid + '\n'); 
});
process.on('message', function (m, tcp) { 
    if (m === 'server') {
        tcp.on('connection', function (socket) { 
            server.emit('connection', socket);
        });
    }
});
```

这样一来，所有的请求都是由子进程处理了，整个过程中，服务的过程发生了一次改变。

先是主进程来监听端口，发送句柄给子进程。主进程发送完句柄并关闭监听之后，成为了子进程直接监听端口。

多个子进程可以同时监听相同的端口，没有eaddrinuse异常发生了。

1) 句柄发送与还原

目前子进程对象send()方法可以发送的句柄类型包括如下几种。

1）net.Socket TCP套接字
2）net.server TCP服务器
3）net.Native C++层面的TCP套接字或IPC管道。
4）dgram.Socket UDP套接字
5）dgram.Native  C++层面的UDP套接字。

send()方法在将消息发送到IPC管道前，将消息组装成两个对象，一个参数是handle，另一个是message。

message参数如下所示:
{
    cmd: 'NODE_HANDLE', 
    type: 'net.Server', 
    msg: message
}

发送到IPC管道中的实际上是我们要发送的句柄文件描述符，文件描述符实际上是一个整数值。

这个message对象在写入到IPC管道是也会通过JSON.stringify()进行序列化。

所以最终发送到IPC通道中的消息都是字符串，send()方法能发送消息和句柄并不意味着他能发送任意对象。

以发送的TCP服务器句柄为例，子进程收到消息后的还原过程如下所示：
```js
function(message, handlem emit) {
    var self = this;
    var server = new net.Server(); 
    server.listen(handle, function() {
        emit(server);  
    });
}
```

子进程根据message,type创建对应TCP服务器对象，然后监听到文件描述符上。

由于底层细节不被应用层感知，所以在子进程中，开发者会有一种服务器就是从父进程中直接传递过来的错觉。

值得注意的是，Node进程之间只有消息传递，不会真正地传递对象，这种错觉是抽象封装的结果。

2) 端口共同监听

在了解了句柄传递背后的原理后，我们继续探究如何通过发送句柄后，多个子进程可以同时监听相同的端口而不引起eaddrinuse异常。

我们独立启动的进程中，TCP服务器端口socket套接字的文件描述符并不相同，导致监听到相同端口抛出异常。

Node底层对每个端口监听都设置了SO_REUSEADDR选项，这个选项的含义是不同进程可以就相同的网卡和端口进行监听，这个服务器端套接字可以被不同的进程复用。

由于独立启动的进程相互之间并不知道文件描述符，所以监听相同的端口时就会失败。

但对于send()发动的句柄还原出来的服务而言，它们的文件描述符是相同的，所以监听相同端口不会引起异常。

多个应用监听相同的端口时，文件描述符同一时间只能被某个进程所用，换言之就是网络请求向服务器发送时，只有一个幸运的进程能够抢到连接，也就是说只有他能为这个请求进行服务。

4. 小结

介绍了创建子进程和进程间通信的IPC通道实现、句柄在进程间的发送和还原、端口共用等细节。

通过这些基础技术，用child_process模块在单机上搭建Node集群是件相对容易的事情。

#### 集群稳定之路

搭建好了集群，充分利用了多核CPU资源，但是需要考虑如下细节：

1. 性能问题
2. 多个工作进程的存活状态管理
3. 工作进程的平滑重启
4. 配置或者静态数据的动态重新载入
5. 其他细节

虽然创建了很多工作进程，但每个进程依然是在单线程上执行，它的稳定性还不能得到完全的保障。

我们需要建立起一个健全的机制来保障Node应用的健壮性。

1. 进程事件

除了message事件，Node还有如下这些事件：

    error：当子进程无法被赋值创建、无法被杀死、无法发送消息时会触发这个事件。
    exit：子进程退出时触发该事件，子进程是正常退出，这个事件的第一个参数为退出码，否则为null。如果进程是通过kill()方法被杀死的，会得到第二个参数，它表示杀死进程时的信号。
    close：在子进程的标准输入输出流中止时触发该事件，参数与exit相同。
    disconnect：在父进程或子进程中调用disconnect()方法时触发该事件，在调用该方法时将关闭监听IPC通道。

这些事件是父进程能监听到的于子进程相关的事件。

kill()方法给子进程发送消息。 kill()方法并不能真正地将通过IPC相连的子进程杀死，他只是给子进程发送了一个系统信息，默认情况下，父进程将通过kill()方法给子进程发送一个SIGTERM信号。它与进程默认的kill()方法类似。
```js
// 子进程 
child.kill([signal]);
// 当前进程 
process.kill(pid, [signal]);
```

每个信号事件有不同的含义，进程在收到响应信号时，应当做出约定的行为，如SIGTERM是软件终止信号，进程收到该信号时应当退出。

```js
process.on('SIGTERM', function() { 
    console.log('Got a SIGTERM, exiting...'); 
    process.exit(1);
});
process.kill(process.pid, 'SIGTERM');
```

2. 自动重启

有了父子进程之间的相关事件之后，就可以在这些关系之间创建出需要的机制了。

```js
// master.js
var fork = require('child_process').fork; 
var cpus = require('os').cpus();

var server = require('net').createServer(); 
server.listen(1337);

var workers = {};
var createWorker = function () {
    var worker = fork(__dirname + '/worker.js'); 
    // 退出时重新启动新的进程
    worker.on('exit', function () {
        console.log('Worker ' + worker.pid + ' exited.'); 
        delete workers[worker.pid];
        createWorker();
    });
    // 句柄转发
    worker.send('server', server); 
    workers[worker.pid] = worker; 
    console.log('Create worker.pid: ' + worker.pid);
};

for (var i = 0; i < cpus.length; i++) { 
    createWorker();
}
// 进程自己退出时，让所有工作进程退出
process.on('exit', function () {
    for (var pid in workers) { 
        workers[pid].kill();
    }
});
```

```js
// worker.js
var http = require('http');
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('handled by child, pid is ' + process.pid + '\n'); 
});
var worker;
process.on('message', function (m, tcp) {
    if (m === 'server') {
        worker = tcp;
        worker.on('connection', function (socket) {
            server.emit('connection', socket); 
        });
    } 
});
process.on('uncaughtException', function () {
    worker.close(function () {
        process.exit(1); 
    });
});
```

上述代码的处理流程是，一旦有未捕获的异常出现，工作进程就会立即停止接收新的连接；当所有连接断开后，退出进程。

主进程在监听到工作进程的退出后，将会立即重启新的进程服务，以此来保证整个集群汇总总是有进程在为用户服务的。

1) 自杀信号

不能等到工作进程退出后才重启新的工作进程。当然也不能暴力退出进程，因为这样会导致已连接的用户直接断开。于是我们在退出的流程中增加了一个自杀信号。工作进程在得知要退出时，向主进程发送一个自杀信号，然后才停止接收新的链接。当所有连接断开后才退出。主进程在接收到自杀信号后，立即创建新的工作进程服务。

```js
// worker.js
process.on('uncaughtException', function (err) {
    process.send({act: 'suicide'});
    // 停止接收新的连接 
    worker.close(function () {
        // 所有已有连接断开后，退出进程
        process.exit(1);
    }); 
});
```

主进程将重启工作进程的任务，从exit事件的处理函数中转移到message事件的处理函数中：
```js
// master.js
var createWorker = function () {
    var worker = fork(__dirname + '/worker.js'); 
    // 启动新的进程
    worker.on('message', function (message) {
        if (message.act === 'suicide') { 
            createWorker();
        }   
    });
    worker.on('exit', function () { 
        console.log('Worker ' + worker.pid + ' exited.');
        delete workers[worker.pid]; 
    });
    worker.send('server', server); 
    workers[worker.pid] = worker; 
    console.log('Create worker. pid: ' + worker.pid);
};
```

```js
// worker.js改写这部分
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('handled by child, pid is ' + process.pid + '\n'); 
    throw new Error('throw exception');
});
```

这种方案相比前一种方案，创建新的工作进程在前，退出异常进程在后。在这个可凉的异常进程退出之前，总是有新的工作进程来替上它的岗位。

至此，我们完成了进程的平滑重启，一旦有异常出现，主进程会创建新的工作进程来为用户服务，旧的进程一旦处理完已有连接就自动断开。

整个过程使得我们的应用的稳定性和健壮性大大提供。

这里还有一个问题是我们的链接可能是长连接，不是HTTP服务的这种短连接，等待长连接断开可能需要较长的时间。

为此，为已有的连接的断开设置一个超时时间是必要的，在限定时间里强制退出的设置如下所示：
```js
process.on('uncaughtException', function(err){
    // 记录日志
    process.error(err);
    // 发送自杀信号
    process.send({act: 'suicide'});
    // 停止接收新的连接
    worker.close(function(){
        // 所有已有连接断开后，退出进程
        process.exit(1);
    })
    // 5秒后退出进程
    setTimeout(function(){
        process.exit(1);
    }, 5000);
});
```

进程中如果出现未能捕获的异常，就意味着有那么一段代码在健壮性上是不合格的。为此退出进程前，通过日志记录下问题所在是必须要做的事情。

2) 限量重启

通过自杀信号高中主进程可以使得新连接总是有进程服务，但是依然还是有极端的情况。

工作进程不能无限制地被重启，如果启动的过程中就发生了错误，或者启动后接到链接就收到错误，会导致工作进程被频繁重启，

这种频繁重启不属于我们捕获未知异常的情况，因为这种短时间内频繁重启已经不符合预期的设置，极有可能是程序编写的错误。

为了消除这种无意义的重启，在满足一定规则的限制下，不应当反复重启。

```js
// 重启次数 
var limit = 10;
// 时间单位
var during = 60000;
var restart = [];
var isTooFrequently = function () {
    //  录重启时间
    var time = Date.now();
    var length = restart.push(time); 
    if (length > limit) {
        // 取出最后10个记录
        restart = restart.slice(limit * -1); 
    }
    // 最后一次重启到前10次重启之间的时间间隔 
    return restart.length >= limit && restart[restart.length - 1] - restart[0] < during; 
};
var workers = {};
var createWorker = function () {
    // 检查是否太过频繁  
    if (isTooFrequently()) {
        // 触发giveup事件后，不再重启
        process.emit('giveup', length, during); 
        return;
    }
    var worker = fork(__dirname + '/worker.js'); 
    worker.on('exit', function () {
        console.log('Worker ' + worker.pid + ' exited.');
        delete workers[worker.pid]; 
    });
    // 重新启动新的进程
    worker.on('message', function (message) {
        if (message.act === 'suicide') { 
            createWorker();
        } 
    });
    // 句柄转发
    worker.send('server', server); 
    workers[worker.pid] = worker; 
    console.log('Create worker. pid: ' + worker.pid);
};
```

giveup事件是比uncaughtException更加严重的异常事件。uncaughtException只代表集群中某个工作进程退出，在整体性保证下，不会出现用户得不到服务的情况，

但是giveup事件则表示集群中没有任何进程服务了，十分危险。


3. 负载均衡

在多进程之间监听相同的端口，使得用户请求能够分散到多个进程上进行处理，这带来的好处是可以将CPU资源都调用起来。

Node默认提供的机制是采用操作系统的抢占式策略。所谓的抢占式就是在一堆工作进程中，闲着的进程对到来请求进行争抢，谁抢到谁服务。

一般而言，这种抢占式策略对大家是公平的，各个进程可以根据自己的繁忙程度来进行抢占。但是对于node而言，需要分清的是它的繁忙是由CPU、I/O两个部分构成的，影响抢占的是CPU的繁忙度。

对于不同的业务，可能存在I/O繁忙，而CPU比较空闲的情况，这可能造成某个进程能够抢到较多请求，形成负载不均衡的情况。

Node的负载均衡策略叫Round-Robin，又叫轮叫调度。轮叫调度的工作方式是有主进程接受连接，将其依次分发给工作进程。

分发的策略是在N个工作进程中，每次选择第i=(i+1) mod n 个进程来发送连接。在cluster模块中启用他的方式如下:
```js
// 启用Round-Robin
cluster.schedulingPolicy = cluster.SCHED_RR 
// 不启用Round-Robin
cluster.schedulingPolicy = cluster.SCHED_NONE

export NODE_CLUSTER_SCHED_POLICY=rr
export NODE_CLUSTER_SCHED_POLICY=none
```

Round-Robin非常简单，可以避免CPU和I/O繁忙差异导致的负载不均衡。

Round-Robin策略也可以通过代理服务器来实现，但是它会导致服务器上消耗的文件描述符是平常方式的两倍。

4 状态共享

Node进程中不宜存放太多数据，因为它会加重垃圾回收的负担，进而影响性能。同时，Node也不允许在多个进程之间共享数据。

但在实际的业务中，往往需要共享一些数据，比如配置数据，这在多个进程中应当是一致的。
为此，在不允许共享数据的情况下，我们需要一种方案来实现数据在多个进程之间的共享。

1) 第三方数据存储

解决数据共享最直接、简单的方式就是通过第三方来进行数据存储。比如将数据存放在数据库、磁盘文件、缓存服务（Redis）中，所有工作进程启动时将其读取进内存中。

但这种方式存在的问题是如果数据发生变化，还需要一种机制通知到各个子进程，使得它们的内部状态也得到更新。

实现状态同步的机制有两种，一种是各个子进程去向第三方进行定时轮询。

2) 主动通知

一种改进的港式是当数据发生更新时，主动通知子进程。当然，即使是主动通知，也需要一种机制来即使获取数据的改变。

#### cluster模块

用来解决多核CPU的利用率问题，同时也提供了较完善的API，用以处理进程的健壮性问题。

```js
// cluster.js
var cluster = require('cluster');
cluster.setupMaster({
    exec: "worker.js"
});
var cpus = require('os').cpus();
for (var i = 0; i < cpus.length; i++) {
    cluster.fork(); 
}
```
执行node cluster.js将会到与前文创建子进程集群的效果相同。
```js
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
if(cluster.isMaster){
    for(var i = 0; i < numCPUs; i++){
        cluster.fork(); 
    }
    cluster.on('exit', function(worker, code, signal){
        console.log(('worker ' + worker.process.pid + ' died');
    });
}else{
    // Workers can share any TCP connection
    // In this case its a HTTP server 
    http.createServer(function(req, res) {
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(8000);
}
```

在进程中判断是主进程还是工作进程，主要取决于环境变量中是否有NODE_UNIQUE_ID，如下所示：
```js
cluster.isWorker = ('NODE_UNIQUE' in process.env);
cluster.isMaster = (cluster.isWorker === false);
```

1. cluster工作原理

事实上cluster模块就是child_process和net模块的组合应用。

cluster启动时，如同我们在9.2.3节里的代码一样，它会在内部启动TCP服务。

在cluster.fork()子进程时，将这个TCP服务器端socket的文件描述符发送给工作进程。如果进程是通过cluster.fork()复制出来的，那么它的环境变量里就存在NODE_UNIQUE_ID，如果工作进程中存在listen()监听网络端口的调用，它将拿到该文件描述符，通过SO_REUSEADDR端口重用，从而实现多个子进程共享端口。

对于普通方式启动的进程，则不存在文件描述符传递共享等事情。

在cluster内部隐式创建TCP服务器的方式对使用者来说十分透明，但也正是这种方式使得他无法如直接使用child_process那样灵活。

对于自行通过child_process来操作时，则可以更灵活的控制工作进程，甚至控制多组工作进程。其原因在于自行通过child_process操作子进程时，可以隐式地创建多个TCP服务器。

使得子进程可以共享多个的服务器端socket。

2. cluster事件

    fork：复制一个工作进程后触发该事件。
    online：复制一个工作进程后，工作进程主动发送一条online消息给主进程，主进程收到消息后，触发该事件。
    listening：工作进程中调用listen()后，发送一条listening消息给主进程，主进程收到消息后，触发该事件。
    disconnect：主进程和工作进程之间IPC通道断开后会触发该事件
    exit：有工作进程退出时，触发该事件
    setup：cluster.setupMaster()执行后触发该事件。

这些事件大多跟child_process模块的事件相关，在进程间消息传递的基础上完成的封装。


#### pm2模块

pm2是node进程管理工具，可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。

把代码利用全部的服务器上的CPU，并保证进程永远都活着，0秒重载。

主要特性：
    负载均衡
    后台运行
    0秒停机重载

```shell
npm install pm2 #安装pm2
pm2 start app.js -i 4 #后台运行pm2，启动4个app.js
pm2 start app.js --name my-api #命名进程
pm2 list #显示所有进程状态
pm2 monit #监视所有进程
pm2 logs #显示所有进程日志
pm2 stop all #停止所有进程
pm2 restart all #重启所有进程
pm2 reload all #0秒停机重载进程
pm2 delete all #杀死全部进程
pm2 stop 0 #停止指定的进程
pm2 startup #产生init脚本 保持进程活着
pm2 logs name #查看日志输出
pm2 ls #查看进程运行状态
pm2 kill #中断进程的执行
```

然而js是单线程的，任何未捕获异常都会造成进程异常退出。这也是我们需要pm2的关键原因。

pm2最基本的功能就是自动重启Node.js应用，至少可以让Node.js更稳定地运行。

启动后pm2给出了当前所有应用的状态表。使用pm2 list命令可以随时查看上述表格。
