---
layout: post
category: "nodejs"
title:  "Koa源码解读"
tags: ["nodejs","koa"]
---

#### koa源码解读

koa的主要特点：使用了ES6的generator函数，进行了架构的重新设计。

1. 创建koa应用

```js
var koa = require('koa');
var app = koa();
app.listen(3000);
```

app.listen()方法是一个语法糖，相当于：

正常的一个http服务
```js
var http = require('http'); 
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
```

koa实现：
```js
var http = require('http');
var koa = require('koa');
var app = koa();
http.createServer(app.callback()).listen(3000);
```

app.listen实现
```js
app.listen = function(){
    var server = http.createServer(this.callback());
    return server.listen.apply(server, arguments);
}
```

callback返回的函数会作为server的回调
```js
app.callback = function(){
    return function(req, res){
        res.statusCode = 404; // 状态码默认是404，即没有任何中间件修改过就是404.
        var ctx = self.createContext(req, res); // 通过createContext创建一个上下文对象
        onFinished(res, ctx.onerror); // 用于监听http response的结束事件，执行回调
        fn.call(ctx).then(function(){
            response.call(ctx);
        }).catch(ctx.onerror);
    }
}
```
callback也会将多个中间件转成一个fn,在构建服务器函数时方便调用。状态码默认是404，即没有任何中间件修改过就是404.

每个请求都会通过createContext创建一个上下文对象，其参数则分别是Node的request对象和response对象：
```js
app.createContext = function(req, res){
    // this代表app, 调用createContext函数的对象。
    // 根据this.context创建context对象
    var context = Object.create(this.context);
    // 根据this.request和this.response创建context对象的request属性和response属性
    var request = context.request = Object.create(this.request);
    var response = context.response = Object.create(this.response);
    // 将context/request/response对象的app属性指向当前函数的this对象。
    context.app = request.app = response.app = this;
    // 将context/request/response对象的req和res属性指向Node的res和res对象
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    // 将得到的context对象赋给request对象和response对象的ctx属性
    request.ctx = response.ctx = context;
    // request和response对象互相引用
    request.response = response;
    response.request = request;

    context.onerror = context.onerror.bind(context);
    context.originalUrl = request.originalUrl = req.url;
    context.cookies = new Cookies(req, res, {
        keys: this.keys,
        secure: request.secure
    });
    context.accept = request.accept = accepts(req);
    context.state = {};
    return context;
}
```
对应接收的参数，在返回上下文context之前，koa会将参数注入到自身的request对象和reponse对象上，
ctx.request和ctx.response返回的是koa的对应对象，
ctx.req和ctx.res返回的是Node的对应对象。
同时也会将app注册到 context/respose/request 对象上，方便在各自的模块中调用：

```js
var app = Application.prototype;
module.exports = Application;
function Application(){
    if(!(this instanceof Application)) return new Application;
    this.env = process.env.NODE_ENV || 'development';  //环境变量
    this.subdomainOffset = 2;  //子域偏移量
    this.middleware = [];     //中间件数组
    this.proxy = false;  //是否信任头字段 proxy 
    this.context = Object.create(context);  // koa的上下文(this)
    this.request = Object.create(request);  //koa的request对象
    this.response = Object.create(response); //koa 的reponse对象
}
```

上下文：context

context对象是koa context模块扩展出来的，添加了诸如state/cookie/req/res等属性。

onFinished是一个第三方函数，用于监听http response的结束事件，执行回调。 

如果找到context.onerror方法，这是koa默认的错误处理函数，它处理的是错误导致的异常结束。

错误的处理是在callback中监听的：
```js
// callback
if(!this.listeners('error').length) this.on('error', this.onerror);
```

koa本身是没有定义事件处理机制的，其事件处理机制继承自Node的Events：

```js
var Emitter = require('events').EventEmitter;
Object.setPrototypeOf(Application.prototype, Emitter.prototype); // Application继承EventEmitter(事件发布订阅模式)
```

默认的错误分发是在Context模块中：

```js
onerror: function(err){
    // some code
    this.app.emit('error', err, this);
    // some code
}
```

此外，在Context模块中，还将request对象和response对象的一些方法和属性委托给了context对象：

```js
//response委托
delegate(proto, 'response')
  .method('attachment')
  .method('append')
  .access('status')
  .access('body')
  .getter('headerSent')
  .getter('writable');
  .....

//request委托
delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('get')
  .method('is')
  .access('querystring')
  .access('url')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  ....
```

通过第三方模块delegate将koa在response模块和request模块中定义的方法委托到了context对象上，所以以下的一些写法是等价的：

```js
// 在每次请求中，this用于指代此次请求创建的上下文context(ctx)
this.body ==> this.response.body
this.status ==> this.response.status
this.href ==> this.request.href
this.host ==> this.request.host
...
```

在createContext方法中，还给context定义了重要的属性state
context.state = {}
这个属性可以被各个中间件共享，用于在中间件之间传递数据，这也是koa推荐的方式：
this.state.user = yield User.find(id);

2. 中间件

中间件是对HTTP请求进行处理的函数，对于每一个请求，都会通过中间件进行处理。
在koa中，中间件通过use进行注册，且必须是一个generator函数：

```js
use(fn) {
    if(typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if(isGeneratorFunction(fn)){
        deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
        fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn); // 存放在middleware数组中
    return this;
}

callback() {
    const fn = compose(this.middleware);
    if(!this.listeners('error').length) this.on('error', this.onerror);
    const handleRequest = (req, res) => {
        const ctx = this.createContext(req, res);
        return this.handleRequest(ctx, fn);
    }
    return handleRequest;
}
```

与Express的中间件顺序执行不同，在koa中，中间件是所谓的“洋葱模型”或级联式（Cascading）的结构，也就是说，属于是层层调用，

第一个中间件调用第二个中间件，第二个调用第三个，以此类推。上游的中间件必须等到下游的中间件返回结果，才会继续执行。

koa对中间件的数量并没有限制，可以随意注册多个中间件。但如果有多个中间件，只要有一个中间件缺少yield next语句，后面的中间件都不会执行。

如果想跳过一个中间件，可以直接在该中间件的第一行语句写上return yield next：

koa中，中间件唯一的参数就是next。如果要传入其他参数，必须另外写一个返回Generator函数的函数。

this.experimental 是为了判断是否支持es7，开启这个属性之后，中间件可以传入async函数：

```js
app.use(async function(next){
    await next;
    this.body = body;
})
```

但koa默认不支持es7，如果想支持，需要在代码中明确指定this.experimental=true;

```js
app.use = fucntion(fn) {
    if(!this.experimental){
        (!this.experimental){
        // es7 async functions are not allowed,
        // so we have to make sure that `fn` is a generator function
        assert(fn && 'GeneratorFunction' == fn.constructor.name, 'app.use() requires a generator function');
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
}
```
在callback中输出错误信息：

```js
app.callback = function(){
    if(this.experimental){
         console.error('Experimental ES7 Async Function support is deprecated. Please look into Koa v2 as the middleware signature has changed.')
    }
    var fn = this.experimental ? compose_es7(this.middleware) : co.wrap(compose(this.middleware));
}
```

compose的全名叫koa-compose，它的作用是把一个个不相干的中间件串联在一起：

```js
// 有三个中间件
this.middlewares = [function *m1() {}, function *m2() {}, function *m3() {}];
// 通过compose转换
var middlewares = compose(this.middlewares);
// 转化后得到的middleware就是这个样子
function *(){
    yield *m1(m2(m3(noop)))
}
```

从上述的use的实现可知，由于use的每次调用均会返回this，因而可以进行链式调用：

```js
app.use(function *m1(){}).use(function *m2(){}).use(function *m3() {})
```

3. 路由处理

node本身提供了数十个HTTP请求动词（get/post/delete...），Koa-router只是实现了部分常用的：

```js
function Router(opts) {
    if(!(this instanceof Router)){
        return new Router(opts);
    }
    this.opts = opts || {};
    this.methods = this.opts.methods || [
        'HEAD',
        'OPTIONS',
        'GET',
        'PUT',
        'PATCH',
        'POST',
        'DELETE'
    ];
    //省略
}
```

这些请求动词的实现是通过第三方模块methods支持的，然后koa-router内部进行了注册处理：

```js
methods.forEach(function (method){
    Router.prototype[method] = function(name, path, middleware){
        this.register(path, [method], middleware, {name});
        return this;
    }
})
```

this.register接受请求路径、方法、中间件、作为参数，返回已经注册的路由：

```js
Router.prototype.register = function(path, methods, middleware, opts){
  opts = opts || {};
  var stack = this.stack;
  // create route
  var route = new Layer(path, methods, middleware, {
    //Layer是具体实现，包括匹配、中间件处理等
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
  });
   //other code
  return route;
}
```
有上述代码可知，koa-router是支持中间件来处理路由的：

```js
myRouter.use(function*(next){
    console.log('aaaaaa');
    yield next;
})
myRouter.use(function* (next) {
    console.log('bbbbbb');
    yield next;
});
myRouter.get('/', function *(next) {
    console.log('ccccccc');
    this.response.body = 'Hello World!';
});
myRouter.get('/test', function *(next) {
    console.log('dddddd');
    this.response.body = 'test router middleware';
});
```

通过 router.use 来注册中间件，中间件会按照顺序执行，并会在匹配的路由的回调之前调用router middleware

对于不匹配的路由则不会调用。
同时，如果注册的路由少了yield next，则之后的中间件以及被匹配的路由的回调就不会被调用；路由的中间件也是支持链式调用的。

中间件也支持特定路由和数组路由：

```js
// session middleware will run before authorize
router
  .use(session())
  .use(authorize());

// use middleware only with given path
router.use('/users', userAuth());

// or with an array of paths
router.use(['/users', '/admin'], userAuth());
```

从上述分析可知，对于同一个路由，能用多个中间件处理：

```js
router.get(
  '/users/:id',
  function (ctx, next) {
    return User.findOne(ctx.params.id).then(function(user) {
      ctx.user = user;
      return next();
    });
  },
  function (ctx) {
    console.log(ctx.user);
    // => { id: 17, name: "Alex" }
  }
);
```
这样的写法看起来会更紧凑。

1）路由前缀
koa-router允许为路径统一添加前缀：
```js
var myRouter = new Router({prefix: '/koa'});
// 等同于"/koa"
myRouter.get('/', function* () {
    this.response.body = 'koa router';
});
// 等同于"/koa/:id"
myRouter.get('/:id', function* () {
    this.response.body = 'koa router-1';
});
```

也可以在路由初始化后设置统一的前缀，koa-router提供了prefix方法：
```js
Router.prototype.prefix = function (prefix) {
  prefix = prefix.replace(/\/$/, '');
  this.opts.prefix = prefix;
  this.stack.forEach(function (route) {
    route.setPrefix(prefix);
  });
  return this;
};
// 所以，以下代码是和上述等价的：
var myRouter = new Router();
myRouter.prefix('/koa');
```

2) 参数处理和重定向

路径的参数通过this.params属性获取，该属性返回一个对象，所有路径参数都是该对象的成员：

```js
// 访问 /programming/how-to-node
router.get('/:category/:title', function *(next) {
  console.log(this.params);
  // => { category: 'programming', title: 'how-to-node' }
});

// param方法可以对参数设置条件，可用于常规验证和自动加载的验证：
router
  .get('/users/:user', function *(next) {
    this.body = this.user;
  })
  .param('user', function *(id, next) {
    var users = [ '0号用户', '1号用户', '2号用户'];
    this.user = users[id];
    if (!this.user) return this.status = 404;
    yield next;
  })

// param 接受两个参数：路由的参数和处理参数的中间件：
Router.prototype.param = function (param, middleware) {
  this.params[param] = middleware;
  this.stack.forEach(function (route) {
    route.param(param, middleware);
  });
  return this;
};
```
如果/users/:user的参数user对应的不是有效用户，param方法注册的中间件会查到，就会返回404错误。

也可以将参数验证不通过的路由通过redirect重定向到另一个路径，并返回302状态码:

```js
router.redirect('/login', 'sign-in');
// 等同于
router.all('/login', function *() {
  this.redirect('/sign-in');
  this.status = 301;
});
```
all是一个私有方法，会处理某路由的所有的动词请求，相当于一个中间件。
如果在all之前或者之后出现了处理同一个路由的动词方法，则要调用yield next，否则另一个就不会执行。

```js
myRouter.get('/login',function* (next) {
    this.body = 'login';
    // 没有yield next，all不会执行
    yield next；
}).get('/sign',function* () {
    this.body = 'sign';
}).all('/login',function* () {
    console.log('login');
});

myRouter.get('/sign2',function* () {
    this.body = 'sign';
}).all('/login2',function* () {
    console.log('login2');
    //没有yield next，get不会执行
    yield next;
}).get('/login2',function* (next) {
    this.body = 'login';
});
```

redirect方法的第一个参数是请求来源，第二个参数是目的地，两者都可以用路径模式的别名代替，还有第三个参数是状态码，默认是301：
```js
Router.prototype.redirect = function(source, destination, code){
  // lookup source route by name
  if (source[0] !== '/') {
    source = this.url(source);
  }
  // lookup destination route by name
  if (destination[0] !== '/') {
    destination = this.url(destination);
  }
  return this.all(source, function *() {
    this.redirect(destination);
    this.status = code || 301;
  });
}
```

3) 命名路由和嵌套路由

对于非常复杂的路由，koa-router支持给复杂的路径模式起别名。别名作为第一个参数传递给动词方法：

```js
router.get('user', '/users/:id', function *(next) {
 // ...
});

// 然后可以通过url实例方法来生成路由：
router.url('user', 3);
// => "/users/3"
//等价于
router.url('user', { id: 3 });
//=> 'users/3'
```

该方法接收两个参数：路由别名和参数对象：
```js
Router.prototype.url = function(name, params){
    var route = this.route(name);
    if(route){
        var args = Array.prototype.slice.call(arguments, 1);
        return route.url.apply(route, args);
    }
    return new Error("No route found for name:" + name);
}
```

第一个参数用于route方式查找匹配的别名，找到则返回true，否则返回false：

```js
Router.prototype.route = function (name) {
  var routes = this.stack;  //路由别名
  for (var len = routes.length, i=0; i < len; i++) {
    if (routes[i].name && routes[i].name === name) {
      return routes[i];
    }
  }
  return false;
};
```

除了实例url外，koa-router还提供一个静态的方法url生成路由：

var url = Router.url('/users/:id', {id: 1});
// => "/users/1"
第一个参数是路径模式，第二个参数是参数对象。

除了给路由命名，koa-router还支持路由嵌套处理：
```js
var forums = new Router();
var posts = new Router();
posts.get('/', function (ctx, next) {...});
posts.get('/:pid', function (ctx, next) {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());
// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());
```

*********************

1. Application
application.js是koa框架的入口，导出application类来用于创建APP对象。
application类继承自EventEmitter类，使得koa能够监听事件。

2. context

koa中的Context模块封装了request与response，代理了这两个对象的方法和属性。

其中使用了Tj写的 node-delegates 库，用于代理 context.request 与 context.response 上的方法与属性。

```js
delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');
```

context除了代理这两个模块之外，还包含了一个请求异常时的错误处理函数。

context.onerror(err) 首先对传入的err变量进行判断，当err为空时退出该函数，或者当err不为空且为Error类型时抛出异常。

```js
if(null == err) return;
if(!(err instanceof Error)) err = new Error(`non-error thrown: ${err}`);
```
接着触发APP自身的error事件，将错误抛给APP。
在此之前，设置headerSent变量表示响应头是否发送，若响应头已发送，或者不可写（即无法在响应中添加错误信息等），则退出该函数。
```js
let headerSent = false;
if(this.headerSent || !this.writable){
    headerSent = err.headerSent = true;
}
// delegate
this.app.emit('error', err, this);
if (headerSent) {
   return;
}
```
因为发生了错误，所以必须将之前的中间设置的响应头信息清空。
这里使用了Node提供的http.ServerResponse类上的getHeaderNames()与removeHeader()方法。
但getHeaderNames()这个函数是在Node.js 7.7时加入的，所以当没有提供该方法时需要使用 _header来清空响应头。

```js
// first unset all headers
if (typeof res.getHeaderNames === 'function') {
  res.getHeaderNames().forEach(name => res.removeHeader(name));
} else {
  res._headers = {}; // Node < 7.7
}
```

清空之前的中间件设置的响应头之后，将响应头设置为err.headers，并设置Context-Type与状态码。
当错误码为ENOENT时，意味着找不到该资源，将状态码设置为404；当没有状态码或状态码错误时默认设置为500。

```js
// then set those specified
this.set(err.headers);
// force text/plain
this.type = 'text';
// ENOENT support
if ('ENOENT' == err.code) err.status = 404;
// default to 500
if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;
```

最后当抛出的错误为自定义错误时，返回错误信息。
Koa使用http-errors创建错误对象，expose属性表示是否像客户端暴露错误信息。

```js
// respond
const code = statuses[err.status];
const msg = err.expose ? err.message : code;
this.status = err.status;
this.length = Buffer.byteLength(msg);
this.res.end(msg);
```

3. Request

Request模块封装了请求相关的属性以及方法。通过application中的createContext()方法，代理对应的request对象。
```js
const request = context.request = Object.create(this.request);
// ...
context.req = request.req = response.req = req;
// ...
request.response = response;
```
4. Response

Response 模块封装了响应相关的属性以及方法。与request相同，通过createContext()方法代理对应的response对象。
```js
const response = context.response = Object.create(this.response);
// ...
context.res = request.res = response.res = res;
// ...
response.request = request;
```