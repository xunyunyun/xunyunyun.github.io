---
layout: post
category: "javascript"
title:  "javascript高级程序设计笔记-4到5章"
tags: ["javascript","数据类型"]
---

##### Javascript函数没有重载！！！因为可以不指定函数个数，后面的同名函数定义会覆盖。

#### 基本类型&引用类型:

##### 基本数据类型

undefined null Boolean number string。这五种基本类型是**按值访问**的，以为可以操作保存在变量中的实际的值。

##### 引用类型

其值是保存在内存中的对象。Js不允许直接访问内存中的位置，不能直接操作对象的内存空间。在操作对象时，实际上时在操作对象的引用而不是实际的对象。为此，引用类型的值**按引用访问**的。


### 第五章 引用类型

#### 1. Object类型

for(i in Object){
	console.log(i);//返回属性名
	console.log(Object(i));//返回属性值
}

#### 2. Array类型

(1)检测方法

```Array.isArray(arr)||Object.prototype.toString.call(arr)==='[object Array]'```

(2)转换方法

toString()：方法返回一个由数组中每个值的字符串形式拼接而成，以逗号分开。

valueOf():返回的还是数组。

(3)栈方法

push():入栈(尾进)
pop(): 出栈(尾出)

(4)队列方法

push()入队(尾进)
shift()出队(头出)

unshift()：(头进)

(5)重排序方法

reverse()；反转
sort()：排序，会调用toString转型方法。

是一种首字母排序，对数字不可用（10<5），对字符串数组可用。

(6)操作方法

concat():基于当前的数组中的所有项创建一个新数组。

slice():基于当前的数组中的一项or多项创建一个新数组。
两个参数：开始index，结束index（不包括在新数组中）

splice()方法：很强大，可增加or删除or替换。

	删除：可删除任一项，两个参数：要删除开始位置，删除项数
	插入：3个参数：起始位置，0（删除个数），要插入的项
	替换：3个参数：起始位置，删除的项数，插入的项（可不止一个）

返回值：删除的项，若无，返回空数组。

(7)位置方法

indexOf()
lastIndexOf()

(8)迭代方法

every()：每一项返回true，则返回true

some()：有一项返回true，则返回true

filter()：返回true的项组成的数组

map()：返回结果组成的数组

forEach()：每一项执行函数，没有返回值。

对于这些方法中的函数：

	function(item,index,array){
		item：代表数组中的每一项
		index：代表数组每项的索引
		array：代表数组
	}


(9)缩小数组

reduce()：第一项开始
reduceRight()：最后一项开始

迭代数组所有的项，构建一个最终返回的值。

对于这些方法中的函数：
	function(prev,cur,index,array){
		prev: 上一项的返回值，前一个值
	}

#### 3. Date类型

	var now = new Date();

```Date.parse();```参数：表示日期的字符串，根据这个字符串返回毫秒数
```Date.UTC();```返回表时日期的毫秒数。

ECMAScript5添加了：

	Date.now()方法，返回表示调用这个方法时的日期和时间毫秒数。

常用例子：
	
	var start = Date.now();
	dosomething();
	var stop = Date.now(),
		result = stop - start;


#### 4.正则表达式

	var expression = /pattern/flags;//字面量的形式
	var expression = new RegExp("pattern","flag");//构造函数创建方式，字符串的形式

注意：在构造函数中的pattern，在某些情况下要对字符进行双重转义。所有的元字符必须双重转义，
\n转为\\n

flag取值：
	
	g：表示全局，而非在第一个匹配项立即停止。
	i：表示不区分大小写
	m：表示多行匹配。

##### RegExp实例属性

	global：布尔值，是否设置g标志。
	ignoreCase：布尔值，是否设置i标志。
	lastIndex：整数，表示开始搜索下一个匹配项的字符位置，从0算起。
	multiline：布尔值，是否设置m标志。
	source：正则表达式的字符串表示，按照字面量形式而非传入的构造函数中的字符串模式返回。

##### RegExp实例方法

```exec()```：专门为捕获组设计。

参数为应用模式的字符串。

返回第一个匹配新的的数组；或者没有匹配，返回null。

返回的数组虽是Array的实例，有两个额外的属性：index：表示匹配项在字符串中的位置；input：表示应用正则表达式的字符串。数组中的第一项为整个模式匹配的字符串，之后为第一个，第二个捕获组匹配的字符串。

```test()```；它接收一个字符串参数。在模式匹配的情况下返回true; 否则，返回false。


#### 5.Function类型

（1）没有重载；

（2）函数声明，函数表达式；解析器解析方式不同，函数声明会提升。

（3）作为值的函数，可把函数当参数一样传递给另一个函数，或者把一个函数作为另一个函数的结果返回。

（4）函数内部属性

```arguments```：类数组对象，包含着传入函数的所有参数。有属性callee，该属性是一个指针，指向拥有这个arguments对象的函数。arguments.callee指向函数本身。

```this```：引用的是函数据以执行的环境对象。

	window.color = 'red';
	var o = { color:"blue" };
	function sayColor(){
		alert(this.color);
	}

	sayColor(); //red
	o.sayColor() = sayColor;
	o.sayColor(); //blue;

（5）函数的属性和方法

对于引用类型而言，prototype是保存它们所有实例方法的真正所在。

每个函数都包含两个非继承而来的方法：```apply()```和```call()```

这两个方法的用途都是在特定的作用域中调用函数，等于设置函数体内this对象的值。

apply()方法接收两个参数：一个是其中运行函数的作用域，另一个是参数数组。第二个参数可为Array实例，也可为arguments对象。

call()方法，接收参数的方式不同。第一个参数是this值，其他参数为直接传递给函数的参数。

E5中还定义了：bind()，这个方法会创建一个函数的实例，其this值会被绑定到传给bind()函数的值。

	window.color = "red";
	var o = { color:'blue' };
	function sayColor(){
		alert(this.color);
	}
	var objectSayColor = sayColor.bind(o);
	objectSayColor(); //blue

objectSayColor()函数的this值等于o，因此即使在全局作用域中调用这个函数，也会看到'blue'.

#### 6.基本包装类型

3个特殊的引用类型：Boolean、Number和String。

引用类型和基本包装类型的主要区别就是对象的生存期。使用new操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存中。而自动创建的基本类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。这意味着不能在运行时为基本类型值添加属性和方法。

（1）Boolean类型

与布尔值对应的引用类型。要创建Boolean对象，可以像下面这样调用Boolean构造函数并传入true或false值。
var booleanObject = newBoolean(true);

（2）Number类型

Number是与数字值对应的引用类型。

（3）String类型

每个实例都有一个length属性，表示字符串中包含多少个字符。

String类型有很多方法：

1.字符方法

charAt():参数：基于0的字符位置。会返回那个位置的单个字符的字符串形式

charCodeAt():基于0的字符位置。会返回那个位置的单个字符编码的字符串形式

2.字符串操作方法

concat():将一个或多个字符拼接起来，返回拼接得到的新字符串。

可接收任意多个参数。

更多的情况下，通过+实现拼接

slice():第二个参数表示字符串结束位置（不包括）。

substr()：第二个参数表示返回字符串长度。

substring()第二个参数表示字符串结束位置（不包括）。


都返回一个子字符串。一到两个参数：第一个参数指定字符串的开始位置，

为负的情况：

对于substring(3,0) 这种情况下：小数开始，大数结束。

3.字符串位置方法

indexOf("ello")

lastIndexOf()

如果有两个参数，表示从哪个位置开始搜索。

4.trim()方法

创建一个字符串的副本，删除前置及后缀的所有空格，然后返回结果。

5.字符串大小写转换方法

toLowerCase():转小写

toUpperCase():转大写

6.**字符串的模式匹配**

match()：与调用RegExp的exec()方法相同。 一个参数：正则表达式|RegExp对象

```string.match(pattern);```等价于```pattern.exec(string);```

search()：参数和上面一致

返回字符串中第一个匹配项的索引；如果没有匹配项，返回-1.

replace()：两个参数：RegExp对象|字符串，字符串|函数(被替换内容) 

第一个参数若为字符串，只会替换第一个字符串，替换所有用正则表达式/g

split() ：基于指定的分隔符将字符串分割成多个子字符串，并将结果放入一个数组中。

分隔符参数：字符串|RegExp对象

第二个参数：可选，用于指定数组的大小，不会超出既定的大小。

7.localeCompare()方法

比较两个字符串，并返回下列值中的一个：

	如果字符串在字母表中应该排在字符串参数之前，则返回一个负数。
	如果字符串在字母表中应该排在字符串参数之后，则返回一个正数。
	如果字符串等于字符串参数，则返回0。

8.fromCharCode()方法

接收一个多个字符编码，然后将它们转换成一个字符串。

#### 7.单体内置对象

（1）Global对象

1.encodeURI() decodeURI()

用于整个URI，不会对本身属于URI的特殊字符进行编码

2.encodeURIComponent() decodeURIComponent()

用于URI中的某一段，会对他发现的任何非标准字符进行编码

3.Global对象的属性

undefined/NaN/infinity/object/Array/Function/Boolean/String/Number

/Date/RegExp/Error/...

4.window对象

web浏览器都是将这个全局对象作为window对象的一部分加以实现的。因此，在全局变量中声明的所有变量和函数，就都成为了window对象的属性。

另一种取得Global对象的方法

	var global = function(){
		return this;
	}();


（2）Math对象：

1.Math对象的属性

	Math.E
	Math.PI

2.max(),min()

对于这两个方法的参数为多个数值参数

	var max = Math.max(4,54,32,16);
	alert(max);

对于找到数组中最大值或最小值：

	var arr = [1,2,3,4,5];
	var max = Math.max.apply(Math,arr); 

3.四舍五入

Math.ceil()：向上舍入
Math.floor()：向下舍入
Math.round()：四舍五入

4.random()方法

返回介于0和1之间一个随机数，不包括0和1。

5.其他方法

Math.abs()/exp()/log()/pow()/sqrt()/...

##### 完。。。



