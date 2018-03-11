---
layout: post
category: "javascript"
title:  "this指针"
tags: ["this"]
---

#### this

this是执行上下文中的一个属性。

##### 影响了函数代码中this值的变化有几个因素：

首先，在通常的函数调用中，this是由激活上下文代码的调用者来提供的，即调用函数的父上下文(parent context )。this取决于调用函数的方式。

为了在任何情况下准确无误的确定this值，有必要理解和记住这重要的一点。**正是调用函数的方式影响了调用的上下文中的this值**。

##### 作为构造器调用的函数中的this

	function A() {
	  alert(this); // "a"对象下创建一个新属性
	  this.x = 10;
	}
	 
	var a = new A();
	alert(a.x); // 10


new运算符调用“A”函数的内部的[[Construct]方法，接着，在对象创建后，调用内部的[[Call]]方法。 **所有相同的函数“A”都将this的值设置为新创建的对象**。


#####附上一段代码：

{% highlight javascript %}
<script>
// "foo"函数里的alert没有改变
// 但每次激活调用的时候this是不同的
 
function foo() {
  console.log(this);
}
 
// caller 激活 "foo"这个callee，
// 并且提供"this"给这个 callee
 
foo(); // 全局对象
foo.prototype.constructor(); // foo.prototype
 
var bar = {
  baz: foo
};

bar.baz(); // bar

(bar.baz)(); // also bar
//调用这个方法之前先加了一个括号。加上括号后好像只是引用一个函数，但是this值得到了维持。因为bar.baz和(bar.baz)的定义相同

(bar.baz = bar.baz)(); // 这是一个全局对象
// 上面这条语句，先执行了一条赋值语句，然后再调用赋值后的结果。因为这个赋值表达式的值是函数本身，所以就返回了“the window”

(bar.baz, bar.baz)(); // 也是全局对象

(false || bar.baz)(); // 也是全局对象
 
var otherFoo = bar.baz;
otherFoo(); // 还是全局对象
</script>
{% endhighlight %}


未完成，更新中！！！