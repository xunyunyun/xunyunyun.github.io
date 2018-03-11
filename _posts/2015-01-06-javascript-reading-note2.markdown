---
layout: post
category: "javascript"
title:  "javascript高级程序设计笔记-6章"
tags: ["javascript","面向对象"]
---

### 面向对象的程序设计

#### 1.理解对象

数据属性：

[[Configurable]]:能否通过delete删除属性而重新定义属性

[[Enumerable]]:表示能否通过for-in循环返回属性

[[Writable]]:表示能否修改属性的值。

[[Value]]:包含这个属性的数据值。

要修改属性默认的特性，必须使用E5的Object.defineProperty()方法。这个方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象。

访问器属性：

函数： 

	getter：读取访问器属性
	setter：写入访问器属性


[[Configurable]]:能否通过delete删除属性而重新定义属性

[[Enumerable]]:表示能否通过for-in循环返回属性

[[get]]:在读取属性时调用的函数

[[set]]:在写入属性时调用的函数

访问器属性不能直接定义，必须使用E5的Object.defineProperty()方法来定义。

var book = {
	-year：2004，
	edition：1
};

object.defineProperty(book,"year",{
	get: function(){
		return this._year;
	}
	set:function(newValue){
		if(newValue >2004 ){
			this._year = newValue;
			this.edition +=newValue - 2004;
		}
	}
});

book.year = 2005;
alert(book.edition);

...


#### 2.创建对象

（1）工厂模式

	function createPerson(name,age,job){
		var o = new Object();
		o.name = name;
		o.age = age;
		o.job = job;
		o.sayName = function(){
			alert(this.name);
		}
		return o;
	}
	var person1 = createPerson("xun",25,"front-end engineer");

（2）构造函数模式

	function Person(name,age,job){
		this.name = name;
		this.age = age;
		this.job = job;
		this.sayName = function(){
			alert(this.name);
		};
	}
	var person1 = new Person("xun",25,"front-end engineer");

这种构造函数的方法

	1.创建一个新对象
	2.将构造函数的作用域付给新对象（this指向新对象）
	3.执行构造函数中的代码（为这个新对象添加属性）
	4.返回新对象

a.将构造函数当做函数

b.构造函数存在问题

缺点：使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。
person1和person2都有一个sayName()方法，但那两个方法不是同一个Function的实例。因为js中函数是对象，因此，每定义一个函数，也就是实例化一个对象。
相当于：

	function Person(name,age,job){
		this.name = name;
		this.age = age;
		this.job = job;
		this.sayName = new Function('alert(this.name);'};
	}
	

（3）原型模式

我们创建的每一个函数都有一个prototype属性，这个属性是一个指针，指向一个对象，

isPrototypeOf()方法来确定对象之间是否存在这种关系。

	alert(Person.prototype.isPrototypeOf(person1)); //true

Object.getPrototypeOf()

	alert(Object.getPrototypeOf(person1) == Person.prototype); //true

hasOwnPrototype()方法可以检测一个属性是否存在于实例中，还是存在于原型中。只有给定属性存在于对象实例中时，才会返回true。

原型与in操作符

可以访问本对象的属性，和其原型上的属性。

原生引用类型：Object/Array/string都在构造函数的原型上定义了方法。

	Array.prototype.sort()
	String.prototype.subString()

原型对象的问题：他省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都取得相同的属性值。

原型中所有属性是被很多实例共享的，这种共享对于函数非常适合。对于啊些包含基本值的属性，通过在实力上添加一个同名属性，可以隐藏原型中的对应属性。然而，对于包含引用类型的属性来说，问题比较突出。

	function Person(){}
	
	Person.prototype = {
		constructor:Person,
		name:'Nicholas',
		age:29,
		firends:["xun","yun"],
		sayName: function(){
			alert(this.name);
		}
	}

	var person1 = new Person();
	var person2 = new Person();
	person1.friends.push("van");

	alert(person1.friends); //'xun,yun,van'
	alert(person2.friends); //'xun,yun,van'
	alert( person1.friends == person2.friends )

由于friends数组存在于Person.prototype而非person1中，person1和person2指向同一个数组。所以原型模式一般也很少单独使用。

（4）组合使用构造函数模式和原型模式

创建自定义方式的最常见方式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，但同时又共享着方法的引用。最大限度地节省了内存。

	function Person(name,age,job){
		this.name = name;
		this.age = age;
		this.job = job;
	}
	
	Person.prototype = {
		constructor:Person,	
		sayName: function(){
			alert(this.name);
		}
	}

	var person1 = new Person();
	var person2 = new Person();
	person1.friends.push("van");

	alert(person1.friends); //'xun,yun,van'
	alert(person2.friends); //'xun,yun'
	alert( person1.friends == person2.friends );  //false
	alert( person1.sayName == person2.sayName );  //true

这种方法是目前在ES中使用最广泛、认同度最高的一种创建自定义类型的方法。这是定义引用类型的一种默认模式。

（5）动态原型模式

	function Person(name,age,job){
		this.name = name;
		this.age = age;
		this.job = job;
	}

	if(typeof this.sayName != "function"){
		Person.prototype.sayName = function(){
			alert(this.name);
		}
	}
	
	var friend = new Person("xun",29,"FE");
	friend.sayName();

使用动态原型模式时，不能使用对象字面量重写原型。

（6）寄生构造函数模式

	function Person(name,age,job){
		var o = new Object();
		o.name = name;
		o.age = age;
		o.job = job;
		o.sayName = function(){
			alert(this.name);
		};
		return o;
	}
	var person1 = new Person("xun",25,"front-end engineer");
	person.sayName();//"xun"

（7）稳妥构造函数模式

	function Person(name,age,job){
		var o = new Object();
		o.name = name;
		o.age = age;
		o.job = job;
		o.sayName = function(){
			alert(name);
		};
		return o;
	}

这种模式创建的对象中，除了使用sayName()方法之外，没有其他方法访问name的值。

	var person1 = Person("xun",25,"front-end engineer");
	person.sayName();//"xun"

#### 3.继承

依靠原型链来实现
	
（1）原型链

基本思想：利用原型让一个引用类型继承另一个引用类型的属性和方法。

确定原型与实例的关系：
	
	alert(instance instanceof object) //true
 
	alert(object.prototype.isPrototypeOf(instance)); //true

原型链的问题：

a.来自包含引用类型值的原型。包含引用类型值的原型属性会被所有实例共享；而这也是要在过早函数中，而不是原型对象中定义属性的原因。

	function SuperType() {
		this.colors = ["red","green","blue"];
	}
	function SubType(){}
	
	SubType.prototype = new SuperType();

	var instance1 = new SubType();
	instance1.colors.push("black");
	alert(instance1.colors);  //"red,blue,green,black"

	var instance2 = new SubType();
	alert(instance2.colors);  //"red,blue,green,black"


在通过原型实现继承时，原型实际上会变成另一个类型的实例。于是，原来的实例属性也就变成了现在的原型属性了。

b.在创建子类型的实例时，不能像超类型的构造函数中传递参数。实际上，应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。

很少单独使用原型链

（2）借用构造函数

基本思想：在子类型构造函数的内部调用超类构造函数。

apply()和call()可以在新创建的对象上执行构造函数。

	function SuperType() {
		this.colors = ["red","green","blue"];
	}
	function SubType(){
		//继承了SuperType
		SuperType.call(this);
	}

	var instance1 = new SubType();
	instance1.colors.push("black");
	alert(instance1.colors);  //"red,blue,green,black"

	var instance2 = new SubType();
	alert(instance2.colors);  //"red,blue,green"

通过使用call()方法（apply()方法也可以），在新创建的SubType实例下调用了SuperType构造函数。这样就会在新SubType对象上执行SuperType()函数中定义的所有对象初始化代码。SubType的每一个实例都会具有自己的colors属性副本。

a.传递参数

	function SuperType(name) {
		this.name = name;
	}
	function SubType(){
		//继承了SuperType
		SuperType.call(this,'xun');
		this.age = 25;
	}

	var instance = new SubType();
	alert(instance.name); //'xun' 
	alert(instance.age);  //25

b.借用构造函数的问题：

函数复用无法实现。

（3）组合继承

将原型链和借用构造函数的技术组合到一起。使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。即通过在原型上定义方法实现了函数复用，又能够保证每个实例都有自己的属性。

	function SuperType(name) {
		this.name = name;
		this.colors = ["red","blue","green"];
	}
	SuperType.prototype.sayName = function(){
		alert(this.name);
	};
	function SubType(name,age){
		//继承SuperType属性
		SuperType.call(this,name);
		this.age = age;
	}
	//继承方法
	SubType.prototype = new SuperType();

	SubType.prototype.sayName = function(){
		alert(this.age);
	}

	var instance1 = new SubType("xun",25);
	instance1.colors.push("black");
	alert(instance.name); //'xun' 
	alert(instance.age);  //25
	alert(instance.colors);  //"red,blue,green,black"

	var instance2 = new SubType("yun",27);
	alert(instance.name); //'yun' 
	alert(instance.age);  //27
	alert(instance.colors);  //"red,blue,green"

组合继承避免了原型链和借用构造函数的缺陷，融合了他们的优点，称为js中最常用的继承方式。而且 instanceof、isPrototypeOf()也能够用于识别基于组合继承创建的对象。

。。。未完

#### 4.小结

原型链的问题是对象实例共享所有继承的属性和方法，因此不适合单独使用。解决方法就是借用构造函数，即在子类型构造函数的内部调用超类型构造函数。这样就可以做到每个实例又具有自己的属性，同时还能保证只使用构造函数模式来定义类型。

使用最多的继承模式是组合继承。这种模式使用原型链继承共享属性和方法，通过借用构造函数继承实例属性。

