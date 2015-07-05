---
layout: post
category: "web"
title:  "PHP学习入门级练习"
tags: [PHP,服务器,Mysql]
---
####一、PHP基础操作
1,基本语法：
<pre>
<?php
	echo '---------------start--------------';
	echo __FILE__;//打印预定义常量
	echo "Hello world";//一般打印
	define('SCHOOL',"YANTZE UNIVERSITY");//定义常量
	echo SCHOOL;//打印常量
	$name="savant";//name
	$age=28;
	echo 'name='.$name.',age='.$age;//打印变量，字符串连接
	$array=array('name'=>'allthelucky','age'=>28);//定义数组
	echo json_encode($array);//转成json输出
	$array=array(array("id"=>'1',"name"=>'hello'),array("id"=>'2',"name"=>'world'));
	echo json_encode($array);//转成jsonarray输出
	$array=array('this','is','php','test');//定义数组
	echo($array[0]);//打印第一个元素
	print_r($array);//全打印
	$have=true;//定义boolean
	echo($have);
	function show($result) {//定义函数
		echo 'result is:'.$result;
	}
	$result='number 1';
	show($result);//调用函数
	function mult($a, $b) {//定义带返回值函数
		return $a*$b;
	}
	$a=10;
	$b=20;
	echo 'result='.mult($a,$b);//调用函数
	$c=20;
	if ($c == 20) {//if else 语句
		echo 'yes';
	} else {
		echo 'no';
	}
	$num=1;
	while($num < 10) {//while循环
		echo 'num='.$num;
		$num+=1;
	}
	$array=array('1'=>'hellsf','2'=>'sadfadfsd','3'=>'asdfasdfasdfsdf');
	foreach($array as $key=>$value) {//foreach 语句，输出key,value
		echo $key.'='.$value;
	}
	foreach($array as $value) {//foreach语句，只输出值 
		echo $value;
	}
	print_r($array);
	$str = ' asdf safsd ';
	echo trim($str);//trim函数
	echo strlen($str);//strlen函数
	echo md5($str);//md5加密
	echo sha1($str);//sha1加密
</pre>

2,使用类：
<pre>
<?php
	class User {
		public $name="savant";
		public $age ="age";
		public function __construct($name, $age) {//构造方法
		$this->name=$name;
		$this->age=$age;
		}
		public function show() {//成员函数
		echo 'name='.$this->name.',age='.$this->age;
		}
	}
	$user = new User('hello world', 26);
	$user->show();
	echo '---------------end--------------';
?>
</pre>

3,表单操作
<pre>
<?php
	echo '---------------start--------------';
	echo 'name'.$_GET['name'];//get参数
	echo 'age'.$_GET['age'];
	echo 'name='.$_POST['name'];//post参数
	echo 'password='.$_POST['password'];
	echo 'desc='.$_POST['desc'];
	$path='./upfiles'.$_FILES['pic']['name'];
	move_uploaded_file($_FILES['pic']['temp'],$path);
	echo $_POST['pic'];
	echo '---------------end--------------';
?>
</pre>

FORM代码
<pre>
<form name="data" method="post" action="test.php" enctype="multipart/form-data" >
	name:<input name="name" type="text" value=""></input>
	<br/>
	password:<input name="password" type="password" value=""></input>
	<br/>
	desc:<textarea name="desc"></textarea>
	<br/>
	pic:<input name="pic" type="file" value=""></input>
	<br/>
	<input name="submit" type="submit"></input>
</form>
</pre>

####二、数据库MySql简单操作练习
1,MySql服务启动和停止
<pre>
net start mysql
net stop mysql
</pre>

2,数据库操作
<pre>
create database USER_DB;//创建数据库
show databases;//查看数据库
use USER_DB;//选择数据库
drop database DBNAME;//删除数据库
</pre>

3,表格操作
<pre>
create table if not exists USER(id int auto_increment primary key, user varchar(20) not null, password varchar(40) not null, createtime datetime);//创建表格
rename table USER to USERS;//改表格名
drop table if exists USER;//删除表格
show tables;//表出表格 
describe USER;//显示表结构
insert into admin(user,password) values("pan","123456");//添加记录到表格 
select * from USER;//查询表格记录
update USER set passowrd="111111";//更新表格记录
delete from USER where user="abc";//删除记录
</pre>
