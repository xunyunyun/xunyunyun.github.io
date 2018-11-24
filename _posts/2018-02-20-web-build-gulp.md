---
layout: post
category: "构建工具"
title:  "gulp构建总结"
tags: ["gulp"]
---

### gulp构建注意事项

gulp构建的任务尽量要有callback函数，这样才可以方便的控制任务的执行顺序。

### gulp常用的npm包

1. node自带包

#### path

方便的处理路径：特别是我们要生成hash文件及对应依赖关系时： 

path.join([...path])

path.basename(path[,ext])

```js
path.basename('/foo/bar/baz/asdf/quux.html'); // 返回: 'quux.html'
path.basename('/foo/bar/baz/asdf/quux.html', '.html'); // 返回: 'quux'
```

path.dirname(path) 方法返回一个 path 的目录名

```js
path.dirname('/foo/bar/baz/asdf/quux'); // 返回: '/foo/bar/baz/asdf'
```

path.extname(path) 方法返回 path 的扩展名

```js
path.extname('index.html'); // 返回: '.html'
path.extname('index.coffee.md'); // 返回: '.md'
path.extname('index.'); // 返回: '.'
path.extname('index'); // 返回: ''
path.extname('.index'); // 返回: ''
path.isAbsolute(path)
```

path.normalize(path)会规范化给定的 path

path.parse(path) & path.format(pathObject)

#### fs

fs.writeFile(file, data, callback)：异步写入文件（一般采用异步方式）

fs.writeFileSync(file, data)：同步写入文件

fs.readFile(path[, options], callback)：异步读取文件（一般采用异步方式）

fs.readFileSync(path[, options])：同步读取文件

fs.readdir(path[, options], callback)：异步的读取一个目录的内容。回调有两个参数（err, files）,其中 files 是目录中不包括 '.' 和 '..' 的文件名的数组。

fs.readdirSync(path[, options])：异步的读取一个目录的内容

fs.createReadStream(path[, options])：从当前文件位置按顺序地读取。 encoding 可以是任何可以被 Buffer 接受的值。

fs.createWriteStream(path[, options])：从当前文件位置按顺序地写入

fs.access(path[, mode], callback)：测试path指定的文件或目录的用户权限。mode参数是一个可选的整数，指定要执行的可访问检查。文件访问常量定义了mode可选的值。可以创建由两个或更多个值的位或组成的掩码（fs.constants.W_OK | fs.constants.R_OK）。最后一个参数 callback 是一个回调函数，会传入一个可能的错误参数。 如果可访问性检查失败，则错误参数会是一个 Error 对象。 下面的例子会检查 package.json 文件是否存在，且是否可读或可写。

fs 常量：fs.contstants输出

文件访问常量：fs.access()

F_OK: 表明文件对于调用进程时可见的

R_OK: 表明文件对于调用进程时可读取

W_OK: 表明文件对于调用进程时可写入

X_OK: 表明文件对于调用进程时可执行

#### stream

流（stream）是一种在node.js中处理流式数据的抽象接口。stream模块提供了一些基础的API，用于构建实现了流接口的对象。

NodeJs提供了多种流对象。HTTP请求、process.stdout都是流的实例。

流可以是可读的，可写的，或者是可读写的。所有的流都是EventEmitter的实例。

stream 模块本身主要用于开发者创建新类型的流实例。

四种类型：

Writable：可写（fs.createWriteStream()）

Readable：可读（fs.createReadStream()）

Duplex：可读写（net.socket）

Transform：在读写过程中可以修改或转化数据的流（zlib.createDeflate()）

所有的Nodejs API创建的流都是专门运作在字符串和Buffer对象上。

缓冲：可读流和可写流都会在一个内部的缓冲器中存储数据，可以分别使用writable.writableBuffer 或 readable.readableBuffer 来获取。

#### buffer

缓冲（buffer）,之前，JavaScript 语言没有读取或操作二进制数据流的机制。buffer类被引入作为nodejs api的一部分，使其可以在TCP流或文件系统操作等场景中处理二进制数据流。

Buffer类的实例类似于整数数组，但Buffer的大小是固定的、且在V8堆外分配物理内存。Buffer的大小在被创建时确定，且无法调整。

Buffer 类在 Node.js 中是一个全局变量，因此无需使用 require('buffer').Buffer。

new Buffer()已经被废弃

类方法：

Buffer.from(array)：返回一个新建的包含所提供的字节数组的副本的 Buffer。

Buffer.fromArray(arrayBuffer,)：返回一个新建的于给定的arrayBuffer共享同一内存的Buffer。

Buffer.from(buffer)：返回一个新建的包含所提供的 Buffer 的内容的副本的 Buffer。

Buffer.from(string[,encoding])：返回一个新建的包含所提供的字符串的副本的 Buffer。

Node支持的字符编码包括：ascii   utf8  utf16le  base64  binary hex（将每个字节变为成两个十六进制字符）

Buffer.compare(buf1, buf2)：比较 buf1 和 buf2 ，通常用于 Buffer 实例数组的排序。 相当于调用 buf1.compare(buf2) 。

Buffer.concat(list[, totalLength])：返回一个合并了 list 中所有 Buffer 实例的新建的 Buffer 。

Buffer.isBuffer(obj)

Buffer.isEncoding(encoding)

实例方法:

buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])

buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])

buf.entries():从 buf 的内容中，创建并返回一个 [index, byte] 形式的迭代器。

buf.equals(otherBuffer)

buf.fill(value[, offset[, end]][, encoding])

buf.includes(value[, byteOffset][, encoding])

buf.indexOf(value[, byteOffset][, encoding])
...

#### event

node核心API都惯用的异步事件驱动架构，其中某些类型的对象会周期性地触发命名事件来调用函数对象（监听器）。

net.Server对象会在每次有新连接时触发事件；fs.readStream()会在文件被打开时触发事件，流对象会在数据可读时触发事件。

所有能触发事件的对象都是EventEmitter类的实例。这些对象开放了一个eventEmitter.on()函数，允许将一个或多个函数绑定到会被对象触发的命名事件上。

当eventEmitter对象触发一个事件时，所有绑定在该事件上的函数都被同步地调用。监听器的返回值会被丢弃。

一个绑定了一个监听器的 EventEmitter 实例。 

eventEmitter.on() 方法用于注册监听器，

eventEmitter.emit() 方法用于触发事件。

eventEmitter.once() 方法时可以注册一个对于特定事件最多被调用一次的监听器.

当 EventEmitter 实例中发生错误时，会触发一个 'error' 事件

#### crypto

此模块提供了加密功能，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

crypto.createHash("md5")来生成文件的MD5哈希字段

```js
let HASH = crypto.createHash("md5");
HASH.update(str);
return HASH.digest("hex").slice(0, 8);
```

2. 类linux命令包

#### mkdirp

创建目录

#### ncp

将一个目录下的文件复制到另一个目录中，异步执行，最后一个参数为错误处理函数可以执行回调函数。

如果目标不存在时，并不会创建目录。因此要保证目录存在，不存在可以通过mkdirp来先创建目录。

#### del

删除指定目录

3. gulp构建相关包

gulp-cssmin：CSS代码压缩

gulp-less：less编译

gulp-autoprefixer：CSS的浏览器兼容设置

gulp-rename: 常用来将.less 改为 .css

gulp-uglify: js代码混淆

gulp-header: 给每个文件内容加前缀

gulp-hash：生成哈希文件（可以指定哈希字段和文件名的连接方式）

```js
const hashOption = {
  template: '<%= name %>.<%= hash %><%= ext %>',
};
//使用
.pipe(gulpIf(!config.debug, hash(hashOption)))
```

gulp-if：判断是否让文件经过这个pipe()中的处理

gulp-livereload：监听代码变化，刷新浏览器页面（前端页面要引入一个js文件）

gulp-nodemon：监听代码变化，重启node服务器

4. 其他相关包

#### glob包

通过模式匹配来遍历搜索文件，gulp中常用这个来遍历需要的文件以进行相应的文件处理。

glob(pattern, [options],cb): 执行异步glob搜索

glob.sync(pattern,[options]): 执行同步glob搜索，返回为匹配的filenames

```js
glob('**/*.js', options,function(err, files){
  // files is an array of filenames.
})
// * Matches 0 or more characters in a single path portion
// ? Matches 1 character
// [...] Matches a range of characters, similar to a RegExp range. If the first character of the range is ! or ^ then it matches any character not in the range.
// !(pattern|pattern|pattern) Matches anything that does not match any of the patterns provided.
// ?(pattern|pattern|pattern) Matches zero or one occurrence of the patterns provided.
// +(pattern|pattern|pattern) Matches one or more occurrences of the patterns provided.
// *(a|b|c) Matches zero or more occurrences of the patterns provided
// @(pattern|pat*|pat?erN) Matches exactly one of the patterns provided
// ** If a "globstar" is alone in a path portion, then it matches zero or more directories and subdirectories searching for matches. It does not crawl symlinked directories.
```

#### async包

https://caolan.github.io/async/docs.html

处理异步js的直接的方便的工具包。

可以用在node服务器和浏览器中。有时间看一下源码实现！

```js
//数组或对象的形式的异步任务处理
async.map(['file1','file2','file3'], fs.stat, function(err, results) {
    // results is now an array of stats for each file
});
async.filter(['file1','file2','file3'], function(filePath, callback) {
  fs.access(filePath, function(err) {
    callback(null, !err)
  });
}, function(err, results) {
    // results now equals an array of the existing files
});
// 控制流的形式的异步任务处理
// 并行执行异步任务
async.parallel([
    function(callback) { ... },
    function(callback) { ... }
], function(err, results) {
    // optional callback
});
// 串行执行异步任务
async.series([
    function(callback) { ... },
    function(callback) { ... }
]);
```

#### run-sequence

Runs a sequence of gulp tasks in the specified order。This function is designed to solve the situation where you have defined run-order, but choose not to or cannot use dependencies.

### 如何编写一个gulp插件

要知道gulp.pipe管道原理，要弄明白下面两个概念：

(1) stream

(2) buffer

npm中有很多对stream流封装的包，下面主要介绍两种常用的封装。

#### through2

对于node原生的transform流进行的封装。

through2.obj(fn)是对through2({ objectMode: true }, fn)方便的封装。

在项目中的gulp插件的应用场景：实现一个将CSS转化为JS文件的transform流，即对文件流的开头和结尾加上一段字符串。

```js
function strToJsmodule(option = {}){
  let pText = option.prefixText || PrefixText[1];
  let sText = option.suffixText || SuffixText[1];
  return through.obj((file, enc, cb) => {
    pText = new Buffer(PrefixText);
    sText = new Buffer(SuffixText);
    if(file.isBuffer()){
      let content = new Buffer(JSON.stringify(file.contents.toString()));
      file.contents = Buffer.concat([pText, content, sText]);
    }
    if(file.isStream()){
      throw new PluginError(PLUGIN_NAME, 'file not wanted!');
    }
    cb(null, file);
  });
}
module.exports = strToJsmodule;
```

即将一个文件流的前面和后面拼接一段字符串。

**注意**
pipe()的单位是文件； 因为through.obj()方法的函数入参file是一个vinyl对象，这个对象是一个文件。

```js
through.obj((file, enc, cb) => {
  // file = vinyl = Object
});
```

https://www.npmjs.com/package/vinyl

看了through2的官方文档后，发现还有一种方法，前缀通过gulp-header来添加；后缀可以通过through2的第二个回调函数flushFunction来添加。

through API的用法：through2([options,] [transformFunction][, flushFunction])

transformFunction函数形式：function(chunk, encoding, callback){} ，必须有callback，如果没有transform函数，之后你将得到一个简单的pass-through stream.

flushFunction函数形式：function(cb)，这个可选的函数提供了最后的参数，在stream流结束之前被调用。用来结束任何正在进行中的处理程序。

```js
fs.createReadStream('/tmp/important.dat')
  .pipe(through2(
    function (chunk, enc, cb) { cb(null, chunk) }, // transform is a noop
    function (cb) { // flush function
      this.push('tacking on an extra buffer to the end');
      cb();
    }
  ))
  .pipe(fs.createWriteStream('/tmp/wut.txt'));
```

#### eventStream

所有的eventStream函数会返回一个stream实例。

through(write, end)：Re-emits data synchronously. Easy way to create synchronous through streams. Pass in optional write and endmethods. They will be called in the context of the stream. Use this.pause() and this.resume() to manage flow. Check this.paused to see current flow state. (write always returns !this.paused）

this function is the basis for most of the synchronous streams in event-stream.

map(asyncFunction): Create a through stream from an asynchronous function. Each map MUST call the callback. It may callback with data, with an error or with no arguments,

split(matcher): Break up a stream and reassemble it so that each line is a chunk. matcher may be a String, or a RegExp

join(separator):

merge(stream1,...streamN) | merge(streamArray):  将多个流合并为一个流并返回。

```js
es.merge(
  process.stdout,
  process.stderr
).pipe(fs.createWriteStream('output.log'));
​
es.merge([
  fs.createReadStream('input1.txt'),
  fs.createReadStream('input2.txt')
]).pipe(fs.createWriteStream('output.log'));
```

### vinly介绍

#### new Vinyl([options])

```js
var Vinyl = require('vinyl');
var jsFile = new Vinyl({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer('var x = 123')
});
var file = new Vinyl({ foo: 'bar' });
var file = new Vinyl(options)
```

#### options对象属性

options.cwd: 文件的当前工作目录

options.base：相对路径

options.path：绝对路径

options.contents：文件内容，如果这个值是一个readableStream，他是包裹在一个cloneable-readable流。

options.stat：这是如何记录文件作为一个目录或符号链接

#### Vinyl实例方法

file.isBuffer()：如果文件内容是一个Buffer时，返回true

file.isStream()：如果文件内容是一个Stream时，返回true

file.isNull()：如果文件内容是null时，返回true

file.isDirectory()：如果文件代表目录，返回true

file.isSymbolic()：如果文件代表一个符号链接时，返回true

file.clone([options])：Returns a new Vinyl object with all attributes cloned. 属性值是深拷贝的。

file.inspect()：Returns a formatted-string interpretation of the Vinyl object. Automatically called by node's console.log.

#### vinyl实例属性

file.contents

file.cwd

file.base

file.path

file.relative

file.dirname

file.basename

file.extname

file.symlink

#### vinyl静态方法

Vinyl.isVinyl(file)：检测一个对象是否为vinyl文件

Vinyl.isVinyl(file)：Static method used by Vinyl when setting values inside the constructor or when copying properties in file.clone().

