---
layout: post
category: "Angularjs"
title:  "AngularJs实战"
tags: ["框架", "Angularjs"]
---

放弃了IE8，引入了单项数据绑定，删掉了过时的API

四大核心特性：MVC、模块化module、指令系统、双向数据绑定

##### 1.小例子介绍：

1.MVC

是一种手段，为了模块化和复用。

HelloAngular_MVC.html

    <!doctype html>
    <html ng-app>
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <div ng-controller="HelloAngular">
                <p>{{greeting.text}},Angular</p>
            </div>
        </body>
        <script src="js/angular-1.3.0.js"></script>
        <script src="HelloAngular_MVC.js"></script>
    </html>

HelloAngular_MVC.js文件

    function HelloAngular($scope) {
        $scope.greeting = {
            text: 'Hello'
        };
    }

2.指令系统

HelloAngular_Directive.html

    <!doctype html>
    <html ng-app="MyModule">
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <hello></hello>
        </body>
        <script src="js/angular-1.3.0.js"></script>
        <script src="HelloAngular_Directive.js"></script>
    </html>

HelloAngular_Directive.js

    var myModule = angular.module("MyModule", []);
    myModule.directive("hello", function() {
        return {
            restrict: 'E',
            template: '<div>Hi everyone!</div>',
            replace: true
        }
    });

3.双向数据绑定

(1)

    <!doctype html>
    <html ng-app>
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <div>
                <input ng-model="greeting.text"/>
                <p>{{greeting.text}},Angular</p>
            </div>
        </body>
        <script src="js/angular-1.3.0.js"></script>
    </html>

(2)

    <!doctype html>
    <html ng-app>
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <div ng-controller="CommonController">
                <div ng-controller="Controller1">
                    <p>{{greeting.text}},Angular</p>
                    <button ng-click="test1()">test1</button>
                </div>
                <div ng-controller="Controller2">
                    <p>{{greeting.text}},Angular</p>
                    <button ng-click="test2()">test2</button>
                    <button ng-click="commonFn()">通用</button>
                </div>
            </div>
        </body>
        <script src="js/angular-1.3.0.js"></script>
        <script src="MVC3.js"></script>
    </html>

MVC3.js

    function CommonController($scope){
        $scope.commonFn=function(){
            alert("这里是通用功能！");
        };
    }
    function Controller1($scope) {
        $scope.greeting = {
            text: 'Hello1'
        };
        $scope.test1=function(){
            alert("test1");
        };
    }
    function Controller2($scope) {
        $scope.greeting = {
            text: 'Hello2'
        };
        $scope.test2=function(){
            alert("test2");
        }
    }

4.作用域问题

(1)

    <!doctype html>
    <html ng-app>
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" type="text/css" href="Scope1.css" />
        </head>
        <body>
            <div class="show-scope-demo">
                <div ng-controller="GreetCtrl">
                    Hello {{name}}!
                </div>
                <div ng-controller="ListCtrl">
                    <ol>
                        <li ng-repeat="name in names">
                            {{name}} from {{department}}
                        </li>
                    </ol>
                </div>
            </div>
        </body>
        <script src="js/angular-1.3.0.js"></script>
        <script src="Scope1.js"></script>
    </html>

Scope1.js

    function GreetCtrl($scope, $rootScope) {
        $scope.name = 'World';
        $rootScope.department = 'Angular';
    }
    function ListCtrl($scope) {
        $scope.names = ['Igor', 'Misko', 'Vojta'];
    }

程序中：
```$scope```表示作用域；
```$rootScope```表示根作用域；
MVC全部借助于```$scope```实现的。

```$scope```：

```$scope```是POJO（plain old Javascript Object）

```$scope```提供了一些工具方法$watch()/$apply()

```$scope```表达式的执行环境（作用域）

```$scope```是一个树形结构，与DOM标签平行

子```$scope```对象会继承父```$scope```上的属性和方法

每一个Angular应用只有一个根$scope,一般位于ng-app上

```$scope```可以传播事件，类似DOM事件，可以向上或向下传播

```$scope```不仅是MVC的基础，也是后面实现双向数据绑定的基础，对AngularJS非常重要。先创建```$rootScope```

可以用```angular.element($0).scope()```进行调试，获得当前元素上的scope

(2)

    <!doctype html>
    <html ng-app>
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" type="text/css" href="Scope1.css" />
        </head>
        <body>
            <div ng-controller="EventController">
                Root scope
                <tt>MyEvent</tt> count: {{count}}
                <ul>
                    <li ng-repeat="i in [1]" ng-controller="EventController">
                        <button ng-click="$emit('MyEvent')">
                            $emit('MyEvent')
                        </button>
                        <button ng-click="$broadcast('MyEvent')">
                            $broadcast('MyEvent')
                        </button>
                        <br>
                        Middle scope
                        <tt>MyEvent</tt> count: {{count}}
                        <ul>
                            <li ng-repeat="item in [1, 2]" ng-controller="EventController">
                                Leaf scope
                                <tt>MyEvent</tt> count: {{count}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </body>
        <script src="js/angular-1.3.0.js"></script>
        <script src="Scope2.js"></script>
    </html>

Scope2.js

    function EventController($scope) {
        $scope.count = 0;
        $scope.$on('MyEvent', function() {
            $scope.count++;
        });
    }

```$emit```只能向parent controller传递event与data

```$broadcast```只能向child controller传递event与data

```$on```用于接收event与data

在```$on```的方法中的event实践参数，其对象的属性和方法如下：

|事件属性 |目的  |
| :-------- | :-------- |
|event.targetScope|发出或传播原始事件的作用域|
|event.currentScope|目前正在处理的事件的作用域|
|event.name|事件名称|
|event.stopPropagation()|一个防止事件进一步传播（冒泡、捕获）|
|event.preventDefault()|没有用|
|event.defaultPrevented|如果调用了`preventDefault`则为true|

##### 2.路由、模块、依赖注入源代码

路由设置app.js：

    var bookStoreApp = angular.module('bookStoreApp', [
        'ngRoute', 'ngAnimate', 'bookStoreCtrls', 'bookStoreFilters',
        'bookStoreServices', 'bookStoreDirectives'
    ]);
    bookStoreApp.config(function($routeProvider) {
        $routeProvider.when('/hello', {
            templateUrl: 'tpls/hello.html',
            controller: 'HelloCtrl'
        }).when('/list',{
            templateUrl:'tpls/bookList.html',
            controller:'BookListCtrl'
        }).otherwise({
            redirectTo: '/hello'
        })
    });

controllers.js:

    var bookStoreCtrls = angular.module('bookStoreCtrls', []);
    bookStoreCtrls.controller('HelloCtrl', ['$scope',
        function($scope) {
            $scope.greeting = {
                text: 'Hello'
            };
        }
    ]);
    bookStoreCtrls.controller('BookListCtrl', ['$scope',
        function($scope) {
            $scope.books =[
                {title:"《Ext江湖》",author:"大漠穷秋"},
                {title:"《ActionScript游戏设计基础（第二版）》",author:"大漠穷秋"},
                {title:"《用AngularJS开发下一代WEB应用》",author:"大漠穷秋"}
            ]
        }
    ]);

services.js：

    var bookStoreServices = angular.module('bookStoreServices', []);
    bookStoreServices.service('bookStoreService_1', ['$scope',
        function($scope) {}
    ]);
    bookStoreServices.service('bookStoreService_2', ['$scope',
        function($scope) {}
    ]);

filters.js:

    ar bookStoreFilters = angular.module('bookStoreFilters', []);
    bookStoreFilters.filter('bookStoreFilter_1', ['$scope',
        function($scope) {}
    ]);
    bookStoreFilters.filter('bookStoreFilter_2', ['$scope',
        function($scope) {}
    ]);

directives.js:

    var bookStoreDirectives = angular.module('bookStoreDirectives', []);
    bookStoreDirectives.directive('bookStoreDirective_1', ['$scope',
        function($scope) {}
    ]);
    bookStoreDirectives.directive('bookStoreDirective_2', ['$scope',
        function($scope) {}
    ]);

booklist.html:(放在tpls文件夹下)

    <ul>
        <li ng-repeat="book in books">
            书名:{{book.title}}&nbsp;&nbsp;&nbsp;作者:{{book.author}}
        </li>
    </ul>

index.html:

    <body>
        <div ng-view>
        </div>
    </body>

(2)两种方式：

A；

    <html ng-app="HelloAngular">
        <body>
            <div ng-controller="helloNgCtrl">
                <p>{{greeting.text}},Angular</p>
            </div>
        </body>
    </html>


    var helloModule=angular.module('HelloAngular', []);
    helloModule.controller('helloNgCtrl', ['$scope', function($scope){
        $scope.greeting = {
            text: 'Hello'
        };
    }]);

B:

    <html ng-app>
        <body>
            <div ng-controller="HelloAngular">
                <p>{{greeting.text}},Angular</p>
            </div>
        </body>
    </html>

    function HelloAngular($scope) {
        $scope.greeting = {
            text: 'Hello'
        };
    }


##### 3.双向数据绑定

controllers.js:

    bookStoreCtrls.controller('HelloCtrl', ['$scope',
        function($scope) {
            $scope.greeting = {
                text: 'Hello'
            };
            $scope.pageClass="hello";
        }
    ]);
    bookStoreCtrls.controller('BookListCtrl', ['$scope',
        function($scope) {
            $scope.books = [{
                title: "《Ext江湖》",
                author: "大漠穷秋"
            }, {
                title: "《ActionScript游戏设计基础（第二版）》",
                author: "大漠穷秋"
            }, {
                title: "《用AngularJS开发下一代WEB应用》",
                author: "大漠穷秋"
            }];
            $scope.pageClass="list";
        }
    ]);

index.js

    <body>
        <div class="page {{pageClass}}" ng-view>
        </div>
    </body>

(2)

    <html ng-app="MyCSSModule">
        <body>
            <div ng-controller="CSSCtrl">
                <p class="text-{{color}}">测试CSS样式</p>
                <button class="btn btn-default" ng-click="setGreen()">绿色</button>
            </div>
        </body>
    </html>

    var myCSSModule = angular.module('MyCSSModule', []);
    myCSSModule.controller('CSSCtrl', ['$scope',
        function($scope) {
            $scope.color = "red";
            $scope.setGreen = function() {
                $scope.color = "green";
            }
        }
    ])

真正双向数据绑定的例子：

    <html ng-app="UserInfoModule">
        <form ng-controller="UserInfoCtrl">       
            <label>邮箱：</label>
            <input type="email" ng-model="userInfo.email"> 
            <label>密码：</label>
            <input type="password" ng-model="userInfo.password">
            <label>
                <input type="checkbox" ng-model="userInfo.autoLogin">自动登录
            </label>               
            <button class="btn btn-default" ng-click="getFormData()">获取Form表单的值</button>
            <button class="btn btn-default" ng-click="setFormData()">设置Form表单的值</button>
            <button class="btn btn-default" ng-click="resetForm()">重置表单</button>
        </form>

    var userInfoModule = angular.module('UserInfoModule', []);
    userInfoModule.controller('UserInfoCtrl', ['$scope',
        function($scope) {
            $scope.userInfo = {
                email: "253445528@qq.com",
                password: "253445528",
                autoLogin: true
            };
            $scope.getFormData = function() {
                console.log($scope.userInfo);
            };
            $scope.setFormData = function() {
                $scope.userInfo = {
                    email: 'damoqiongqiu@126.com',
                    password: 'damoqiongqiu',
                    autoLogin: false
                }
            };
            $scope.resetForm = function() {
                $scope.userInfo = {
                    email: "253445528@qq.com",
                    password: "253445528",
                    autoLogin: true
                };
            }
        }
    ])

```ng-bind```的作用:防止程序可能出现{{}}的情况，可以用
```<span ng-bind="greeting.text"></span>```来代替：```{{greeting.text}}```

```ng-click```

```ng-class```:中为元素添加类，有这个类则为true，否则为false。

    <div ng-controller='HeaderController'>
        <div ng-class='{error: isError, warning: isWarning}'>{{messageText}}</div>
        <button ng-click='showError()'>Simulate Error</button>
        <button ng-click='showWarning()'>Simulate Warning</button>
    </div>

    .error { background-color: red; }
    .warning { background-color: yellow; }

    myCSSModule.controller('HeaderController', ['$scope',
        function($scope) {
            $scope.isError = false;
            $scope.isWarning = false;
            $scope.showError = function() {
                $scope.messageText = 'This is an error!';
                $scope.isError = true;
                $scope.isWarning = false;
            };
            $scope.showWarning = function() {
                $scope.messageText = 'Just a warning. Please carry on.';
                $scope.isWarning = true;
                $scope.isError = false;
            };
        }
    ])

```ng-show```等于true：显示，等于false：隐藏。

```ng-hide```与上面的相反

    <div ng-controller='DeathrayMenuController'>
        <button ng-click='toggleMenu()'>Toggle Menu</button>
        <ul ng-show='menuState.show'>
            <li ng-click='stun()'>Stun</li>
            <li ng-click='disintegrate()'>Disintegrate</li>
            <li ng-click='erase()'>Erase from history</li>
        </ul>
    <div/>

    myCSSModule.controller('DeathrayMenuController', ['$scope',
        function($scope) {
            $scope.menuState={show:false};
            $scope.toggleMenu = function() {
                $scope.menuState.show = !$scope.menuState.show;
            };
        }
    ])

##### 4.路由

为了解决这些问题：

A. ajax请求不会留下history记录，

B. 用户无法直接复制收藏URL

C. SEO搜索引擎优化（ajax对SEO不友好）

AngularJS中通过引入模块ui-router。

前端路由的基本原理：

A. 锚点#页面内导航，哈希#

B. HTML5中新的history API

C. 路由的核心是给应用定义“状态”

D. 使用路由机制会影响到应用的整体编码方式（需预先定义好状态）

E.考虑兼容性问题与“优雅降级”

（1）

.config(function($stateProvider,$urlRouterProvider){})

$urlRouterProvider.otherwise();一个参数，为路径

$stateProvider.state();两个参数，如下：

其中：```ui-view```代表被取代的地方，```ui-sref```代表连接地址

    <html ng-app="MyUIRoute">
    <div ui-view></div>
    <a ui-sref="state1">State 1</a>
    <a ui-sref="state2">State 2</a>

对于state1.html：

    <h1>State 1</h1>
    <hr/>
    <a ui-sref="state1.list">Show List</a>
    <div ui-view></div>

    var myUIRoute = angular.module('MyUIRoute', ['ui.router', 'ngAnimate']);
    myUIRoute.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/state1");//配置默认路径
        $stateProvider
            .state('state1', {
                url: "/state1",
                templateUrl: "tpls/state1.html"
            })
            .state('state1.list', {
                url: "/list",
                templateUrl: "tpls/state1.list.html",
                controller: function($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }
            })
            .state('state2', {
                url: "/state2",
                templateUrl: "tpls/state2.html"
            })
            .state('state2.list', {
                url: "/list",
                templateUrl: "tpls/state2.list.html",
                controller: function($scope) {
                    $scope.things = ["A", "Set", "Of", "Things"];
                }
            });
    });

（2）

    <a ui-sref="home">Home</a>    
    <a ui-sref="about">About</a>  
    <div ui-view=""></div>

home.html：

    <a ui-sref=".list">List</a>
    <a ui-sref=".paragraph">Paragraph</a>
    <div ui-view></div>

about.html:

    <div class="row">
        <div class="col-md-6">
            <div ui-view="columnOne"></div>
        </div>
        <div class="col-md-6">
            <div ui-view="columnTwo"></div>
        </div>
    </div>

    var routerApp = angular.module('routerApp', ['ui.router']);
    routerApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'tpls2/home.html'
            })
            .state('home.list', {
                url: '/list',
                templateUrl: 'tpls2/home-list.html',
                controller: function($scope) {
                    $scope.topics = ['Butterscotch', 'Black Current', 'Mango'];
                }
            })
            .state('home.paragraph', {
                url: '/paragraph',
                template: 'I could sure use a scoop of ice-cream. '
            })
            .state('about', {
                url: '/about',
                views: {
                    '': {
                        templateUrl: 'tpls2/about.html'
                    },
                    'columnOne@about': {
                        template: '这里是第一列的内容'
                    },
                    'columnTwo@about': {
                        templateUrl: 'tpls2/table-data.html',
                        controller: 'Controller'
                    }
                }
            });
    });
    routerApp.controller('Controller', function($scope) {
        $scope.message = 'test';
        $scope.topics = [{
            name: 'Butterscotch',
            price: 50
        }, {
            name: 'Black Current',
            price: 100
        }, {
            name: 'Mango',
            price: 20
        }];
    });

(3)

    var routerApp = angular.module('routerApp', ['ui.router']);
    routerApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/index');
        $stateProvider
            .state('index', {
                url: '/index',
                views: {
                    '': {
                        templateUrl: 'tpls3/index.html'
                    },
                    'topbar@index': {
                        templateUrl: 'tpls3/topbar.html'
                    },
                    'main@index': {
                        templateUrl: 'tpls3/home.html'
                    }
                }
            })
            .state('index.usermng', {
                url: '/usermng',
                views: {
                    'main@index': {
                        templateUrl: 'tpls3/usermng.html',
                        controller: function($scope, $state) {
                            $scope.addUserType = function() {
                                $state.go("index.usermng.addusertype");
                            }
                        }
                    }
                }
            })
            .state('index.usermng.highendusers', {
                url: '/highendusers',
                templateUrl: 'tpls3/highendusers.html'
            })
            .state('index.usermng.normalusers', {
                url: '/normalusers',
                templateUrl: 'tpls3/normalusers.html'
            })
            .state('index.usermng.lowusers', {
                url: '/lowusers',
                templateUrl: 'tpls3/lowusers.html'
            })
            .state('index.usermng.addusertype', {
                url: '/addusertype',
                templateUrl: 'tpls3/addusertypeform.html',
                controller: function($scope, $state) {
                    $scope.backToPrevious = function() {
                        window.history.back();//返回上一级
                    }
                }
            })
            .state('index.permission', {
                url: '/permission',
                views: {
                    'main@index': {
                        template: '这里是权限管理'
                    }
                }
            })
            .state('index.report', {
                url: '/report',
                views: {
                    'main@index': {
                        template: '这里是报表管理'
                    }
                }
            })
            .state('index.settings', {
                url: '/settings',
                views: {
                    'main@index': {
                        template: '这里是系统设置'
                    }
                }
            })
    });

为多层路由嵌套。



##### 5.指令（最复杂）

第三方指令库

restrict：参数有四种:`A`：属性,`E`：元素,`C`：类,`M`：注释,

templateUrl：


    <body>
        <hello></hello>
    </body>

    //注射器加载完所有模块时，此方法执行一次
    myModule.run(function($templateCache){
        $templateCache.put("hello.html","<div>Hello everyone!!!!!!</div>");
    });
    myModule.directive("hello", function($templateCache) {
        return {
            restrict: 'AECM',
            template: $templateCache.get("hello.html"),
            replace: true
        }
    });

(2)

    ar myModule = angular.module('MyModule', ['ui.bootstrap']);
    myModule.controller('AccordionDemoCtrl', ['$scope',
        function($scope) {
            $scope.oneAtATime = true;
            $scope.groups = [{
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            }, {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }];
            $scope.items = ['Item 1', 'Item 2', 'Item 3'];
            $scope.addItem = function() {
                var newItemNo = $scope.items.length + 1;
                $scope.items.push('Item ' + newItemNo);
            };
            $scope.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };
        }
    ])

(3)

指令系统不想全部覆盖原来的指令，就要加上```ng-transclude```

.directive('accordion',function(){
    return {};
})

```replace```:如果replace为true，则将模板将会替换当前元素，而不是作为子元素添加到当前元素中。

---
```template```:如果replace为true，则将模板内容替换当前的HTML元素，并将原来的元素的属性、class一并迁移；如果为false，则将模板元素当前当前元素的子元素处理。

---
```templateUrl```：和```template```基本一致，但模板通过指定的URL进行加载。因为模板加载时异步的，所以comilation、linking都会暂停，等待加载完毕后再执行。

---
```transclude```:编译元素的内容，使它能够被directive所用。需要配合ngTransclude使用（引用）。transclude的优点是linking function能够得到一个预先与当前scope绑定的transclusion function。

true - 转换这个directive的内容。
‘element’ - 转换整个元素，包括其他优先级较低的directive。

---
```require```:请求另外的controller，传入当前directive的linking function中。require需要传入一个directive controller的名称。如果找不到这个名称对应的controller，那么将会抛出一个error。
？---不要抛出异常。这使这个依赖变成一个可选项
^ ---允许查找父元素的controller

---
```scope```:true - 将为这个directive创建一个新的scope。如果在同一个元素中有多个directive需要新的scope的话，它还是只会创建一个scope。新的作用域规则不适用于根模版（root of the template），因此根模版往往会获得一个新的scope。

---
```controller```:- controller 构造函数。controller会在pre-linking步骤之前进行初始化，并允许其他directive通过指定名称的require进行共享（看下面的require属性）。这将允许directive之间相互沟通，增强相互之间的行为。controller默认注入了以下本地对象：

$scope - 与当前元素结合的scope

$element - 当前的元素

$attrs - 当前元素的属性对象

$transclude - 一个预先绑定到当前转置scope的转置linking function :function(cloneLinkingFn)

---
```conplite```:这里是conpile function

---
```link```:这里是link function，这个属性仅仅是在compile属性没有定义的情况下使用。
---

    <html ng-app="expanderModule">
        <body ng-controller='SomeController' >
            <accordion>
                <expander class='expander' ng-repeat='expander in expanders' expander-title='expander.title'>
                    {{expander.text}}
                </expander>
            </accordion>
        </body>
    </html>

    var expModule=angular.module('expanderModule',[])
    expModule.directive('accordion',function(){
        return {
            restrict:'EA',
            replace: true,
            transclude: true,
            template: '<div ng-transclude></div>',
            controller: function(){
                var expanders = [];
                this.gotOpened = function(selectedExpander){
                    angular.forEach(expanders,function(expander){
                            if(selectedExpander != expander){
                                expander.showMe = false;
                            }
                        });
                }
                this.addExpander = function(expander) {
                    expanders.push(expander);
                }
            }
        }
    });
    expModule.directive('expander', function() {
        return {
            restrict : 'EA',
            replace : true,
            transclude : true,
            require : '^?accordion',
            scope : {
                title : '=expanderTitle'
            },
            template : '<div>'
                      * '<div class="title" ng-click="toggle()">{{title}}</div>'
                      * '<div class="body" ng-show="showMe" ng-transclude></div>'
                      * '</div>',
            link : function(scope, element, attrs, accordionController) {
                scope.showMe = false;
                accordionController.addExpander(scope);
                scope.toggle = function toggle() {
                    scope.showMe = !scope.showMe;
                    accordionController.gotOpened(scope);
                }
            }
        }
    });
    expModule.controller("SomeController",function($scope) {
        $scope.expanders = [{
            title : 'Click me to expand',
            text : 'Hi there folks, I am the content that was hidden but is now shown.'
        }, {
            title : 'Click this',
            text : 'I am even better text than you have seen previously'
        }, {
            title : 'Test',
            text : 'test'
        }];
    });


2.5节不是很懂！！！


##### 2.6 Service与Provider

（1）HTTP请求

    <div ng-controller="LoadDataCtrl">
        <ul>
            <li ng-repeat="user in users">
                {{user.name}}
            </li>
        </ul>
    </div>

    myModule.controller('LoadDataCtrl', ['$scope','$http', function($scope,$http){
        $http({
            method: 'GET',
            url: 'data.json'
        }).success(function(data, status, headers, config) {
            console.log("success...");
            console.log(data);
            $scope.users=data;
        }).error(function(data, status, headers, config) {
            console.log("error...");
        });
    }]);

data.json：

    [{
        "name": "《用AngularJS开发下一代WEB应用》"
    },{
        "name": "《Ext江湖》"
    },{
        "name": "《ActionScript3.0游戏设计基础（第二版）》"
    }]

（2）filters

    <body>
        {{'大漠穷秋'|filter1 }}
    </body>

    myModule.filter('filter1',function(){
        return function(item){
            return item + 'o(∩_∩)o';
        }
    });  

（3）factory

    <div ng-controller="ServiceController">
        <label>用户名</label>
        <input type="text" ng-model="username" placeholder="请输入用户名" />
        <pre ng-show="username">{{users}}</pre>
    </div>

    myServiceApp.factory('userListService',['$http',
        function($http){
            var doRequest = function(username,path) {
                return $http({
                    method:'GET',
                    url:'users.json'
                });
            }
            return {
                userList: function(username) {
                    return doRequest(username,'userList');
                }
            };
        }
    ]);
    myServiceApp.controller('ServiceController',['$scope','$timeout',
        function($scope,$timeout,userListService) {
            var timeout;
            $scope.$watch('username',function(newUserName) {
                if(newUserName) {
                    if(timeout) {
                        $timeout.cancel(timeout);
                    }
                    timeout = $timeout(function() {
                        userListservice.userList(newUserName)
                            .success(function(data,status) {
                                $scope.users = data;
                            });
                    },350);
                }
            });
        }
    ])

2.7未看

### AngularJS中文网

AngularJs使用了不同的方法，他尝试去弥补HTML本身在构建方面的缺陷。AngularJS通过使用我们成为标识符的结构，让浏览器能够识别新的语法。

例如:

1.使用双大括号{{}}语法进行数据绑定

2.使用DOM控制结构来实现迭代或者隐藏DOM片段

3.支持表单和表单的验证

4.能将逻辑代码关联到相关的DOM元素上

5.能将HTML分组成可重用的组件

特点：
构建一个CRUD应用可能用到的全部内容包括：数据绑定、基本模板标识符、数据验证、路由、深度连接、组件重用、依赖注入。

    <html ng-app>

当加载页面时，标记```ng-app```告诉AngularJS处理整个HTML页并引导应用。

绑定动态文本```{{}}```

双向数据绑定：
    
    Your name:<input type="text" ng-model="yourname" placeholder="world">
    <hr>
    hello {{yourname || 'world'}}!


    <script src="lib/angular/angular.js"></script>

这行代码载入angular.js脚本，当浏览器将整个HTML页面载入完毕后将会执行该angular.js脚本，angular.js脚本运行后将会寻找含有ng-app指令的HTML标签，该标签即定义了AngularJS应用的作用域。

### AngularJS基础（智课网）

AngularJS有五个主要核心特性：

1.双向数据绑定---实现了把model和view完全绑定在一起，model变化，view也变化，反之亦然。

2.模板---在AngularJS中，模板相当于HTML文件被浏览器解析到DOM中，AngularJS遍历这些DOM，也就是说AngularJS把模板当做DOM来操作，去生成一些指令来完成对view的数据绑定。

3.MVVM---吸收了传统的MVC设计模式针但有病不执行传统意义上的MVC，更接近于MVVM

4.依赖注入---AngularJS拥有内建的依赖注入子系统，可以帮助开发人员更容易的开发，理解和测试应用

5.指令---可以用来创建自定义的标签，也可以用来装饰元素或操作DOM属性。