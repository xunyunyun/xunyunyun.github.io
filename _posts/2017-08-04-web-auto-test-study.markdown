---
layout: post
category: "test"
title:  "前端自动化测试"
tags: ["mocha","assert","zombie"]
---

#### 前端自动化测试工具学习

测试是完善的研发体系中不可或缺的一环。下面介绍两种常用的前端自动化测试工具：

1. mocha
2. zombie

#### mocha简介

mocha一种单元测试框架，可在浏览器端和Node环境下都可以使用。

所谓“测试框架”，就是运行测试的工具。通过它可以为Javascript应用添加测试，从而保证代码质量。

测试脚本里面应该包含多个describe块，每个describe块应该包括一个或多个it块。

describe块：称为“测试套件”，表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称，第二个参数是一个实际执行的函数。

it块：称为测试用例，表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称，第二个参数是一个实际执行的函数。

##### 1. 断言

所谓“断言”，就是判断源码的实际执行结果与预期结果是否一致，如果不一致就抛出一个错误。所有的测试都应该包含一句或多句的断言。

mocha允许我们使用任何想用的断言库：should.js expect.js chai、unexpected等断言库

##### 2. Mocha的基本用法

mocha命令后面紧跟测试脚本的路径和文件名，可以指定多个测试脚本

mocha file1 file2 file3

mocha默认运行test子目录里面的测试脚本。
mocha --recursive // test及test子目录下的所有测试用例都会执行

mocha --watch //监控测试脚本的变化，自动运行mocha
mocha --grep "" //it块第一个参数的内容
mocha -f "" // describe块第一个参数的内容

##### 3. 异步代码

mocha默认每个测试用例最多执行2000毫秒，如果到时没有得到结果，就报错。
mocha -t 5000 test.js // 指定超时时间为5000毫秒
用mocha测试异步代码，只需要再测试完成时调用回调，给it()函数添加一个回调函数done()。mocha会知道它应该等待这个函数被调用来完成测试。

```js
describe('user', function(){
    describe('save()', function(){
       it('异步请求应该返回一个对象', function(done){
            request
            .get('https://api.github.com')
            .end(function(err, res){
                expect(res).to.be.an('object');
                 done();
            });
        });
    })
})
```

promise: 可以返回一个promise对象来代理返回回调函数done()。这种方式很有用，当我们测试APIs返回的promise对象时代替回调函数。

```js
beforeEach(function(){
    return db.clear()
    .then(function(){
        return db.save([tobi,loki,jane]);
    });
});
describe('#find()', function() {
  it('respond with matching records', function() {
    return db.find({ type: 'User' }).should.eventually.have.length(3);
  });
});
```
同步代码：当测试同步代码时，mocha将忽略回调，自动继续下一个测试。

##### 4. 箭头函数
由于在箭头函数中，函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
由于箭头函数中this的语义，导致这种函数是不能得到mocha的上下文的。如下面的例子中。由于箭头函数中this的语义，this对象是没有timeout方法的。
```js
describe('my suite', () => {
  it('my test', () => {
    // should set the timeout of this test to 1000 ms; instead will fail
    this.timeout(1000); // 报错
    assert.ok(true);
  });
});
```
如果我们不使用mocha的上下文，箭头函数可用。

##### 5. 测试用例的钩子

before()
after()
beforeEach()
afterEach()

```js
describe('hooks', function() {
  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });

  // test cases
});
```

##### 6. 测试用例管理

describe块和it块允许调用only方法，表示只运行某个测试套件或测试用例
skip方法，表示跳过指定的测试套件或用例
```js
it.only('describe string', function(){

});
```

##### 7. 浏览器测试
mocha init 命令在指定目录生成初始化文件

#### zombieJs

##### 1. 看个栗子

```js
const Browser = require('zombie');
Browser.localhost('example.com', 3000);
describe('User visit signup page', function(){
    const browser = new Browser();
    before(function(done){
        browser.visit('/signup', done);
    })
    describe('submit form', function(){
        before(function(done){
            browser.fill('email', '')
            .fill('password','')
            .pressButton('sign me up!', done);
        });
        it('should be successful', function(){
            browser.assert.success();
        });
        it('should see welcome page', function(){
            browser.assert.text('title', 'welcome to brains depot');
        })
    })
})

Browser.localhost(host, port);
Browser.extend()
Browser.evaluate() // 在浏览器中执行js，类似于browser.assert.evaluate
```

##### 2. Assertions(断言)

zombie提供了方便的断言。

```js
browser.assert.success(); // 判断页面是否正确打开

browser.assert.text('title', 'my awesome site'); // 判断页面的title的值是否为'my awesome site'
browser.assert.text('.nav-header', `猫眼电影`); // 类为nav-header的元素的内容是否为猫眼电影

browser.assert.element('#main'); // 判断页面是否有id=main的这个元素
browser.assert.element('.movielist'); // 判断页面是否有class=movielist的元素

browser.assert.attribute(selection, name, expected, message) // 判断属性名为name的元素selection是否有期望的值
browser.assert.attribute('form', 'method', 'post');
browser.assert.attribute('button', 'action', '/customer/new');
browser.assert.attribute('button', 'disabled', '');
browser.assert.attribute('button', 'disabled', null);

browser.assert.className(selection, className, message) // 判断元素类为className的是否有这个类
browser.assert.className('form input[name=email]', 'has-error');

assert.cookie(identifier, expented, message) // 判断cookie中是否存在期望值
browser.assert.cookie('flash', 'Missing email address');

assert.element(selection, message) // 判断匹配的元素是否存在
assert.elements(selection, count, message) // 判断匹配的元素是否是期望的数量
assert.evaluate(expression, expected, message) // 判断当前打开页面的js表达式执行是否正确
assert.global(name, expected, message) // 判断全局对象window的属性是否是期望值
assert.hasClass(selection, className, message) 
assert.hasFocus(selection, message) // 判断元素是否获取焦点
assert.hasNoClass(selection, className, message)
assert.input(selection, expected, message) // 判断特定的输入框是否有期望值
assert.link(selection, text, url, message) // browser.assert.link('footer a', 'Privacy Policy', '/privacy');
assert.redirected(message)  // 判断此页面是否是个需重定向的页面
assert.success(message) // 页面响应成功
assert.status(code, message)  // 页面的状态码是否为多少
assert.style(selection, style, expected, message) // 页面元素是否有期望的样式
    browser.assert.style('#show-hide.hidden', 'display', 'none');
assert.text(selection, expected, message)
assert.url(url, message) // 判断当前页面是否有期望的url
```

##### 3. browser对象的特性

```js
browser.getCookie('session');
browser.getCookie({ name: 'session',
                    domain: browser.location.hostname,
                    path: browser.location.pathname });

browser.cookies
browser.cookies.dump(output?) // 将所有cookie都放到标准输出流中
browser.deleteCookie(identifier)
browser.deleteCookies() // 删除所有cookie
browser.getCookie(identifier, allProperties?)
browser.setCookie(name, value)
browser.setCookie(cookie)
```
##### 参考文档
[更多信息查看官方参考文档](http://zombie.js.org/)

#### node测试

测试包括单元测试、性能测试、安全测试和功能测试等几个方面。

1. 单元测试

单元测试主要包含断言、测试框架、测试用例、测试覆盖率、mock、持续集成等几个方面，由于node的特殊性，还有异步代码测试和私有方法测试。

1) 断言

assert模块

```js
var assert = require('assert');
assert.equal(Math.max(1, 100), 100);
```
一旦assert不满足期望，将会抛出AssertionError异常，整个程序将会停止执行。没有对输出结果做任何断言检查的代码，都不是测试代码。
```js
ok()
equal()
notEqual()
deepEqual()：判断实际值和期望值是否深度相等（对象或数组的元素是否相等）
notDeepEqual()
strictEqual()：判断实际值与期望值是否严格相等（相当于===）
notStrictEqual()
throws()：判断代码块是否抛出异常。

doesNotThrow()：判断代码块是否没有抛出异常
ifError()：判断实际值是否为一个假值（null/undefined/0/false/''），如果实际值为真值抛出异常。
```

2) 测试框架

测试框架用于测试服务，本身不参与测试，主要用于管理测试用例和生成测试报告，提示测试用例的开发速度，提高测试用例的可维护性和可读性。

测试风格：
TDD：测试驱动开发
BDD：行为驱动开发

关注点不同：TDD关注所有功能是否被正确实现，每一个功能都具备对应的测试用例
表达方式不同：TDD的表述方式偏向于功能说明书的风格；BDD的表述方式更接近与自然语言的习惯

BDD代码示例：
```js
describe('Array', function(){ 
    before(function(){
        // ... 
    });
    describe('#indexOf()', function(){
        it('should return -1 when not present', function(){
            [1,2,3].indexOf(4).should.equal(-1); 
        });
    }); 
});
```
BDD对测试代码用例的组织主要是采用describe和it进行组织。describe可以描述多层级的结构, 具体到测试用例时, 用it。另外他还提供了before,after,beforeEach和afterEach这四个钩子方法，用于协助describe中的测试用例的准备、安装、卸载和回收工作。before和after分别在进入和退出describe时触发执行,beforeEach和afterEach则分别在describe中每一个测试用例(it)执行前和执行后触发执行。

describe块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称（"加法函数的测试"），第二个参数是一个实际执行的函数。
it块称为"测试用例"（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称（"1 加 1 应该等于 2"），第二个参数是一个实际执行的函数。

TDD代码示例：
```js
suite('Array', function(){ 
    setup(function(){
        // ... 
    });
    suite('#indexOf()', function(){
        test('should return -1 when not present', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    }); 
});
```
TDD对测试用例的组织主要采用suite和test完成。suite也可以描述多层级的结构, 具体到测试用例时, 用test。它提供的钩子函数仅包含setup和teardown，对应BDD中的before和after。

3) 测试用例
一个测试用例中包含至少一个断言。


4) 异步测试

mocha中如果是异步调用，在执行测试用例时，会将一个函数done()注入为实参，测试代码需要主动调用这个函数通知测试框架当前测试用例执行完成，然后测试框架才进行下一个测试用例的执行。

5）超时测试
异步方法给测试带来的问题并不是断言方面有什么不同主要在于回调函数执行的时间无从预期。
macha给所有涉及异步的测试用例添加了超时限制，如果一个用例的执行时间超过了预期时间，将会记录下一个超时错误，然后执行下一个测试用例。
macha默认的超时时间为2s。