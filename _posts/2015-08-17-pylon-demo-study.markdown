---
layout: post
category: "pylon"
title:  "pylon框架学习"
tags: ["pylon"]
---

####Pylon的功能介绍

1.Action功能介绍

相当于MVC中的controller作用，处理用户交互，负责从view中读取数据，控制输入，并向model发送数据。

(1)编写方法：

1).Action代码一般放置在src/apps/admin|console|front/actions

2).命名规则：

    class Action_<name> extands XAction

3).实现_run方法：

参数：

$request：输入，包含外部传递进来的信息。 

$xcontent：输出，包含向外部传递的信息。 返回值：即Action的后续行为定义 

XNext::useTpl ：使用模板，模板存放在/src/web_inf/admin|front/tpls 

XNext::action ：发起新的Http Request，执行新的Action 

XNext::nothing ：什么也不做，常用于无展示的Action 

XNext::gotoUrl ：直接跳转给定的URL

(2)实例

在src/apps/front/actions/index_act.php：

    class Action_index extends XAction
    {
        public function _run($request,$xcontext)
        {
            $xcontext->hello = 'hello';
            $xcontext->world = 'world';
            return XNext::useTpl('index.html');
        }
    }
    class Action_example extends XAction
    {
        public function _run($request,$xcontext)
        {
            $xcontext->hello = 'hello';
            $xcontext->world = 'world';
            return XNext::useTpl('index.html');
        }
    }

在src/web_inf/front/tpls/index.html:


    <?php echo $hello.",".$world."!";?>


在src/web_inf/front/tpls/example.html:

    <?php echo $hello.",".$bookstore."!"; ?>

F8部署，在浏览器中访问：http://xunyunyun.myfirstprojectdomain.com/index.php?do=index;
来访问index.html页面，上面的do=index根据```Action_index```而来；index.html根据
```return XNext::useTpl('index.html');```而来http://xunyunyun.myfirstprojectdomain.com/index.php?do=example
来访问example.html页面，上面的do=index根据Action_example而来；

2.Tpl功能介绍

3.RestApi功能介绍

使用rest可以通过URL路径来调用web service

(1) RestApi

1).规则为：

    http://$domain /$class_uri/$method?$get_param_key=$get_param_value&$get_param_key=$get_param_value

$domain:域名

$class_uri:请求服务的类名

$method:具体服务的方法名

$get_param_key：传入参数key

$get_param_value：传入参数value

返回值为json数据。

(2) 实例

修改src/apps/front/index.php:

    <?php
    require_once('pylon/pylon.php');
    //XPylon::action_serving("demo");
    XPylon::rest_serving("demo");

即将原来的action改为rest。

在src/apps/ front/actions下新建example_rest.php

    <?
    class example_test extends XSimpleRest implements XService
    {
        public function getParam($request,$xcontent)
        {
            return $xcontent->_result->success("you put param:".$request->param);
        }
        public function getParams($request,$xcontent)
        {
            return $xcontent->_result->success("you put the params:".$request->param1.",".$request->param2);
        }
    }

输入网址：

http://xunyunyun.myfirstprojectdomain.com/example/test/getParams?param=abc

{"errno":0,"errmsg":"","data":"you put param:abc'"}

http://xunyunyun.myfirstprojectdomain.com/example/test/getParams?param1=abc&param2=cba

{"errno":0,"errmsg":"","data":"you put the params:abc,cba'"}

4.Interceptor&XAop

(1)拦截器（Interceptor）是框架中对于不同请求，要使用相同处理逻辑时的接口

pylon的两种拦截器：

XScopeInterceptor（范围拦截器）和XErrorInterceptor（错误拦截器），分别处理逻辑和异常的情况

定义自己的拦截器类时，要遵守如下规定：

a. 若为XScopeInterceptor拦截器，则需要implements XScopeInterceptor，类中必须实现 _before 和 _after方法， 分别对应拦截动作前后分别要执行的逻辑 。

b. 若为XErrorInterceptor拦截器，则需要implements XErrorInterceptor，类中必须实现 _procError 方法，即为处理异常。

在src/apps/front/intercept.php中定义局部性拦截器，只能在front下访问。

在src/logic/mechanism/intercept.php中定义全局性拦截器，可以在front，admin下访问

(2)XAop是框架提供面向方面编程的接口

    const LOGIC= 1 ;  //逻辑处理
    const TPL= 2 ;    //模板展现
    const ACTION= 3 ; //NEXT Action
    const JUMP= 4 ;   //URL 跳转
    const ERROR= 10 ; //错误处理
    const NORET= 11 ; //无返回值       
 
XAop的用法：

在assembly中设定拦截器:

    XAop::pos(XAop::TPL  )->append_by_match_name(".*", new FntView());    //前端展现控制

设定规则

    <append|replace>_by_<match|dismatch>_<name|url|method>[_<name|uri|method>]

    append
    replace
    match 正则匹配
    dismatch 正则不匹配
    name action名 ， restful 下无效
    uri    restFul 下使用uri路径匹配
    method : get、 post 、 put 、 delete

(3)实例

1)定义拦截器，修改src/apps/front/intercept.php,加入如下代码：

    class ExampleInterceptor implements XScopeInterceptor
    {
        
        public function _before($request, $xcontext)
        {
            echo "here is ExampleInterceptor::_before()"."</br/>";
        }
        public function _after($request, $xcontext)
        {
            echo "here is ExampleInterceptor::_after()"."</br/>";
        }
    }
    class ExampleErrorPoc implements XErrorInterceptor
    {
        public function _procError($e,$request,$xcontent)
        {
            echo $e->getMessage()."<br/>";
            echo "here is ExampleErrorPoc::_procError()"."<br/>";  
        }
    }

2)在src/apps/front/assembly中注册拦截器

    public function setup()
    {
        CommonAssembly::setup();
        XAop::pos(XAop::TPL  )->append_by_match_name(".*", new ExampleInterceptor());
        XAop::pos(XAop::ERROR)->append_by_match_name(".*", new ExampleErrorPoc());
        XAop::pos(XAop::LOGIC)->append_by_match_name(".*", new AutoCommit());
        XAop::pos(XAop::TPL  )->append_by_match_name(".*", new FntView()); 
    }

I.F8部署

在浏览器中访问http://xunyunyun.myfirstprojectdomain.com/index.php?do=example
执行结果如下：

here is ExampInterceptor::_before()
hello, bookstore!
here is ExampInterceptor::_after()

II.在src/apps/front/actions/index_act.php中抛出异常

    $xcontext->hello = 'hello';
    $xcontext->bookstore = 'bookstore';
    throw new Exception("I'am an error");
    return XNext::useTpl('example.html');

再次访问http://xunyunyun.myfirstprojectdomain.com/index.php?do=example
执行结果如下：

I'am an error
here is ExampleErrorPoc::_procError()

5.Mysql操作相关（Entity & DQuery & Dwrite & SQLExecuter & LZLExecutor &XDaoUtls）

数据库的创建

使用命令/home/q/tools/game_team/bin/buildprj.sh 创建项目模板，框架会创建相应的数据库。数据库的信息在_rg/res.yaml中。

(1) Entity

实体是框架中用来完成数据插入的功能。实体是如何映射到数据库中的呢？我们使用如下的约定：

1) 数据库的表名和实体的属性名一致，不区分大小写（表名全为小写）

2) 实体中对象与对象是1对1的关系：在表中使用classname_id的方式表示关联的对象
编写一个简单的实体
       （1）继承Entity类
       （2）重载createByBiz方法；update方法是根据业务需要定义的更新表中相关数据
       （3）当是复杂对象时，需要提供load静态构造方法，用于在数据库中加载它


注释：

1)EntityID完成表中 id，ver，cratetime，updatetime四个字段的的赋值 ，Entity::createByBiz是完成obj对象的注册，即把obj这个对象中的数据插入到对应的表中

2)update方法用于实现具体业务需要的更新操作

(2)数据库的查询、删除（DDA，Dquery，自定义query）

框架提供了三种常用的方法对数据库完成查询，删除和修改的操作

1.DDA(Data Direct Access)

    class Action_index extends Action
    {
        public function _run($request,$xcontext)
        { 
            $dda = DDA::ins(); 
            $info = $data->list_msg(); 
            $xcontext->info = $info; 
            return XNet::useTpl('index.html'); 
        }
    } 


DDA对象提供了方便的对象的查询、删除的方法。可以根据方法名和参数构造有条件的查询、删除的操作。方法的规则如下：

```\[get\|list\|del\]_classname\[_by_arg1name\[_arg2name(\[$arg1value,$arg2value]\)```

返回数据格式： 

1）get获取单个对象，未找到时，返回null

2）list获取一批对象，为空时返回空数组 

3）del删除一批对象，无返回值 

Tips:

1) 通过get或者list获取到的对象，由框架生成的四个属性：id，ver，createtime和updatetime不能按照对象成员输出，而是按照方法来输出。即：
$info[]->id() ;自己定义的属性可以按照正常成员输出， $info[]->name

2) 用DDA获取到的实体对象可以直接访问其关联的实体)

2.Dquery

Dquery和DDA的使用方式类似，区别在于Dquery获取到的是一个数组的数组，即查询到的每一条数据记录都是以数组的形式返回，而不是实体对象的数组。DDA是以实体对象的形式返回。

3.自定义query

通过Query对象，编写sql，实现复杂的多表查询或者要求性能更高的系统
一般在 src/logic/bizdomain/dao写添加自定义的Query

如：定义 msgbd_query.php

    class msgQuery extends Query 
    {
        public function display_all()
        { 
            $sql = "select * from msg"; 
            return $this->listByCmd($sql); 
        } 
    }

自定义查询方法display_all，可以在自定义Query中定义多个不同的查询方法
Tips：类名XXXQuery中的XXX要和查询的数据表名一致

使用： $info = DaoFinder::query("msgQuery")->display_all();
DaoFinder::query的返回值也是数组的数组，不是对象的数组。

6.Session相关

7.日志相关（XlogKit）*不太懂*

日志是后端开发中非常重要的，日志可以帮助我们快速的定位问题，统计数据等。Pylon框架本身会记录项目运行过程中的多种日志，同时Pylon框架中提供了方便记录日志的工具--XLogKit。Pylon项目存放日志的目录是 ```/data/projlogs/<your project name>/```

(1) Wlog

Wlog是查看框架生成日志的一个工具```（/home/q/tools/game_team/bin/wlog.sh）```。进入自己的工程目录，Wlog后可以看到``` _all，pylon，_pylon，_res，_speed，_sql```这几个目录。

    _all：记录pylon中所有的日志
    _speed：记录请求的时间
    _sql：记录产生的SQL语句

查看方式：

1）wlog _all ：查看_all下面的文件 ，其他的类似 2）到日志目录下直接查看相关的文件

(2)XLogKit
                 
XLogKit工具可以方便的记录自己想要记录的日志信息。创建log的步骤：

1）XLogKit::log_tag($name,tag) //给日志加上tag，一般可以不用这一步

2）$logger = XLogKit::logger($name) //在日志目录下创建一个以$name为名字的日志目录，并创建一个logger对象，

3） $logger->info("The things put into the log") // 往log中添加信息


####Pylon-BASE

#####依赖注入：

所谓依赖注入，是指程序运行过程中，如果需要调用另一个对象协助时，无须再代码中创建被调用者，而是依赖于外部的注入。

#####webservice框架

目标：

为了实现webservice的业务逻辑，然后装配进系统。

在logic/bizservice目录下，实现webservice业务逻辑，通常我们先定义接口，再做实现。

#####提示

成功提示：

$xcontenx->successMsg="YES! add book success!"      

#####数据库执行器

public function _construct($host,$username,$password,$dbname,$connType=FastSQLExecutor::SHORT_CONN,$charset='GBK',$cls='FastSQLExecutor')

$executer = new LZLExecutor($dbConf->host,$dbConf->user,$dbConf->password,$dbConf->name,
    FastSQLExecutor::SHORT_CONN,'utf8',"FastSQLExecutor");

---

未完，待续

