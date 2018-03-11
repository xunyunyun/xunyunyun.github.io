---
layout: post
category: "mysql"
title:  "node连接mysql数据库"
tags: ["mysql","nodejs"]
---

#### 应用背景
团体业务中，前端需要保存用户的订单信息。最初考虑用Tair（有介绍tair优缺点）来存储订单数据，但是考虑到这个业务场景会存在一定量的查询操作，且这个业务的访问量qps（query per second）较低。

最终没有采用这种数据模式来进行数据储存，而采用了关系型数据库mysql来进行数据储存。

#### SQL事务
事务是对数据库执行的一个操作单位。它是以逻辑顺序完成的工作单元或工作序列，无论是用户手工操作，还是由程序进行的自动操作。事务是对数据库所做的一个或多个修改，比如利用UPDATE语句对表里某个人的姓名进行修改时，就是在执行一个事务。

控制事务的命令有三个：commit、rollback、savepoint

事务 ACID Atomicity（原子性）、Consistency（稳定性）、Isolation（隔离性）、Durability（可靠性）

1、事务的原子性
一组事务，要么成功；要么撤回。

2、稳定性
有非法数据（外键约束之类），事务撤回。

3、隔离性
事务独立运行。
一个事务处理后的结果，影响了其他事务，那么其他事务会撤回。
事务的100%隔离，需要牺牲速度。

4、可靠性
软、硬件崩溃后，InnoDB数据表驱动会利用日志文件重构修改。
可靠性和高速度不可兼得， innodb_flush_log_at_trx_commit选项 决定什么时候吧事务保存到日志里。

开启事务
START TRANSACTION 或 BEGIN

提交事务（关闭事务）
COMMIT

放弃事务（关闭事务）
ROLLBACK

需要看用的数据库引擎是否支持事务:

MySQL的事务支持不是绑定在MySQL服务器本身，而是与存储引擎相关1.MyISAM：不支持事务，用于只读程序提高性能 2.InnoDB：支持ACID事务、行级锁、并发 3.Berkeley DB：支持事务

#### Nodejs插件mysql介绍

安装
npm install mysql
mysql使用
创建链接
```js
var mysql      = require('mysql');
// 创建数据库连接对象
var connection = mysql.createConnection({
  host     : 'localhost', //连接数据库的域名
  port     : 3306,  //连接数据库的端口号
  user     : 'root', //连接数据库的用户名
  password : 'root', //连接数据库的密码
  database : 'databaseName' //连接数据库的名字
});
// 建立数据库连接
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});
```
或直接采用如下方式：
```js
var mysql      = require('mysql');
// 创建数据库连接对象
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'databaseName'
});
// 数据库连接的建立也可以通过query函数隐式唤起。
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
```
连接参数
createConnection(config)函数的参数config的可用的属性值列表如下：

 

终止连接
有两种方式来终止连接：

第一种方式：connect.end()函数来终止连接
```js
connection.end(function(err) {
  // The connection is terminated now
});
```
这种终止连接的方式需要确保之前的所有查询队列仍在发送com_quit包到MySQL服务器。如果在com_quit包可以被发送之前发生一个致命错误的话，这个错误将以参数的形式提供给回调函数，不管这个链接是不是将要被终止。

第二种方式：connection.destroy()函数
```js
connection.destroy()
```
这种方式会以底层sacket的方式立即终止链接。这种方式保证连接不会触发更多的事件或回调函数。connection.destroy()函数没有回调函数。

pooling connection 连接池
创建连接池
这个模块不仅可以创建和管理一对一的链接，还通过使用mysql.createPool(config)来提供内置连接池。使用连接池方式：
```js
var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,  // 连接池的链接数量限制
  host     : 'localhost', //连接数据库的域名
  port     : 3306,  //连接数据库的端口号
  user     : 'root', //连接数据库的用户名
  password : 'root', //连接数据库的密码
  database : 'databaseName' //连接数据库的名字
});
 
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
```
连接可以池化为共享一个链接，或者管理多个链接。
```js
var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : 'example.org',
  user     : 'bob',
  password : 'secret',
  database : 'my_db'
});
 
pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
});
```
当我们使用完一个连接后，就可以释放这个连接，通过connection.release()。这个连接将返回到连接池中，准备被其他人再使用这个连接。
```js
var mysql = require('mysql');
var pool  = mysql.createPool(...);
 
pool.getConnection(function(err, connection) {
  // 使用这个连接
  connection.query('SELECT something FROM sometable', function (error, results, fields) {
    // 连接使用完毕，释放连接。
    connection.release();
 
    // 释放连接后，处理错误。
    if (error) throw error;
 
    // 不要在使用这个连接，它已经返回到连接池中。
  });
});
```
如果我们需要关闭连接并且从连接池中删除链接的话，使用connection.destroy()。连接池会在下一次需要连接时创建新的连接。

连接池是懒创建方式来创建连接。如果我们配置连接池的最大连接数为100，但是我们使用时最多只会同时使用五个链接，那么只有5个连接被创建。连接池采用循环方式，连接从池顶取出并返回底部。

连接池配置


连接池事件
1.acquire事件
当从连接池中获取连接时，连接池将发出一个获取事件。
```js
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});
```
2. connection事件

当连接池中新建连接时，连接池将发出连接事件。
```js
pool.on('connection', function (connection) {
  connection.query('SET SESSION auto_increment_increment=1')
});
```
3.enqueue事件

当回调已经排队等待可用的连接，连接池发出入队事件。
```js
pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});
```
4.release事件

当连接被释放到连接池时，连接池发出释放事件
```js
pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});
```

关闭连接池所有连接
```js
pool.end(function (err) {
  // all connections in the pool have ended
});
```
当您使用完连接池时，必须结束所有的连接，或Node.js的事件循环将保持有效直到连接被MySQL服务器关闭。如果在脚本中使用连接池，或者试图优雅地关闭数据库服务器，则通常这样做。

要结束池中的所有连接，用上面这个函数。

poolcluster 连接池群
请看文档：https://github.com/mysqljs/mysql

服务器断开连接
err.code = 'PROTOCOL_CONNECTION_LOST'

执行查询
执行查询的最基本方法是调用query()函数。

query()函数
（1）connection.query(sqlString, callback) 

sqlString: SQL查询语句
callback: 回调函数
connection.query('SELECT * FROM `books` WHERE `author` = "David"', function (error, results, fields) {
  // error：在查询期间发生的错误
  // results：查询结果
  // fields：将包含返回结果字段的信息
});
（2）connection.query(sqlString, values, callback) 

sqlString: SQL查询语句
values: ?占位符的值
callback: 回调函数
connection.query('SELECT * FROM `books` WHERE `author` = ?', ['David'], function (error, results, fields) {
    // ...
});
（3）connection.query(option, callback) 

option: 
callback: 回调函数
```js
connection.query({
  sql: 'SELECT * FROM `books` WHERE `author` = ?',
  timeout: 40000, // 40s
  values: ['David']
}, function (error, results, fields) {
  // ...
});
// 组合方式
connection.query({
    sql: 'SELECT * FROM `books` WHERE `author` = ?',
    timeout: 40000, // 40s
  },
  ['David'],
  function (error, results, fields) {
    // ...
  }
);
```
Escaping query values(避免查询值)
为了避免SQL注入攻击，在使用SQL查询之前，应该始终避免任何用户提供的数据。
```js
// 您可以使用mysql.escape()，connection.escape() or pool.escape() methods:
var userId = 'some user provided value';
var sql    = 'SELECT * FROM users WHERE id = ' + connection.escape(userId);
connection.query(sql, function (error, results, fields) {
  if (error) throw error;
  // ...
});
// 或者，我们使用符号"?"来作为占位符来作为避免出现字符串的值。
connection.query('SELECT * FROM users WHERE id = ?', [userId], function (error, results, fields) {
  if (error) throw error;
  // ...
});
// 如果有多个占位符时，第二个参数为占位符映射值顺序的数组。
connection.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId], function (error, results, fields) {
  if (error) throw error;
  // ...
});
```
 这种采用占位符的方式看起来像是mysql支持的语句，其实，这种方式也是通过expect()方法来内部实现的。

 注意：甚至那些包含在注释和字符串中的，‘？’占位符代表的语句是不同的。不同的值类型以不同的方式转义。

Numbers are left untouched（数字取左边，保持不变）
Booleans are converted to true / false
Date objects are converted to 'YYYY-mm-dd HH:ii:ss' strings
Buffers are converted to hex strings, e.g. X'0fa5'
Strings are safely escaped
Arrays are turned into list（数组被转换成列表）
Nested arrays are turned into grouped lists (for bulk inserts), e.g. [['a', 'b'], ['c', 'd']] turns into ('a', 'b'), ('c', 'd')
Objects are turned into key = 'val' pairs for each enumerable property on the object. If the property's value is a function, it is skipped; if the property's value is an object, toString() is called on it and the returned value is used.
...
  上面主要介绍了查询语句，对于插入语句，同样采用conenction.query()函数。

上面的通过占位符来防注入的方式可以做nest thing
```js
var post  = {id: 1, title: 'Hello MySQL'};
var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
  if (error) throw error;
  // Neat!
});
console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

Escaping query identifiers(避免查询标识符)
var sorter = 'date';
var sql    = 'SELECT * FROM posts ORDER BY ' + connection.escapeId(sorter);
connection.query(sql, function (error, results, fields) {
  if (error) throw error;
  // ...
});
  
var sorter = 'date';
var sql    = 'SELECT * FROM posts ORDER BY ' + connection.escapeId('posts.' + sorter);
// -> SELECT * FROM posts ORDER BY `posts`.`date`
  
var userId = 1;
var columns = ['username', 'email'];
var query = connection.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userId], function (error, results, fields) {
  if (error) throw error;
  // ...
});
console.log(query.sql); // SELECT `username`, `email` FROM `users` WHERE id = 1
```
可以通过escape()或query()或escapeId()这些函数来使用对象来避免SQL注入问题。 

Preparing Queries（查询预编译）
我们可以通过使用mysql.format()函数来预编译多点插入的查询语句。

Custom format（自定义格式）
如果您希望有另一种类型的查询逃逸格式。这里有一个连接配置选项，可以用来定义自定义格式函数。
```js
connection.config.queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      return this.escape(values[key]);
    }
    return txt;
  }.bind(this));
};
connection.query("UPDATE posts SET title = :title", { title: "Hello MySQL" });
```
获取插入行的id
results.insertId
```js
connection.query('INSERT INTO posts SET ?', {title: 'test'}, function (error, results, fields) {
  if (error) throw error;
  console.log(results.insertId);
});
```
获取影响到的行数
results.affectedRows
```js
connection.query('DELETE FROM posts WHERE title = "wrong"', function (error, results, fields) {
  if (error) throw error;
  console.log('deleted ' + results.affectedRows + ' rows');
})
```
获取改变的行数
results.changedRows
```js
connection.query('UPDATE posts SET ...', function (error, results, fields) {
  if (error) throw error;
  console.log('changed ' + results.changedRows + ' rows');
})
```
获取 connection ID
connection.threadId
```js
connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
});
```
Executing queries in parallel（并行执行查询）
MySQL协议是连续的，这意味着需要多个连接来并行执行查询。可以使用连接池管理连接，一个简单的方法是为每个传入的HTTP请求创建一个连接。

Streaming query rows（流查询）
 
```js
var query = connection.query('SELECT * FROM posts');
query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {
    // Pausing the connnection is useful if your processing involves I/O
    connection.pause();
 
    processRow(row, function() {
      connection.resume();
    });
  })
  .on('end', function() {
    // all rows have been received
  });
。。。。
```

Transactions（事务）
```js
connection.beginTransaction(function(err) {
  if (err) { throw err; }
  connection.query('INSERT INTO posts SET title=?', title, function (error, results, fields) {
    if (error) {
      return connection.rollback(function() {
        throw error;
      });
    }
 
    var log = 'Post ' + results.insertId + ' added';
 
    connection.query('INSERT INTO log SET data=?', log, function (error, results, fields) {
      if (error) {
        return connection.rollback(function() {
          throw error;
        });
      }
      connection.commit(function(err) {
        if (err) {
          return connection.rollback(function() {
            throw err;
          });
        }
        console.log('success!');
      });
    });
  });
});
```
beginTransaction()，rollback()，commit()are simply convenience functions that execute the START TRANSACTION, COMMIT, and ROLLBACK commands respectively.
ping
Timeout
设置超时时间

错误处理
err.code：ER_ACCESS_DENIED_ERROR（mysql服务器错误），ECONNREFUSED（node.js错误）

err.fatal

err.sql

err.sqlMessage

 

####参考文献：
https://github.com/mysqljs/mysql