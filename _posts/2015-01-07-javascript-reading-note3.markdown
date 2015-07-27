---
layout: post
category: "javascript"
title:  "javascript高级程序设计笔记-7章"
tags: ["javascript","函数"]
---


###函数表达式

####1.递归

	function factorial(num){
		if(num <=1){
			return 1;
		}else{
			return num*factorial(num-1);
		}
	}

	var fac = factorial;
	factorial = null;
	alert(fac(4)); //报错！
			
	//改为这样就可以		
	function factorial(num){
		if(num <=1){
			return 1;
		}else{
			return num*arguments.callee(num-1);
		}
	}

但在严格模式下，不能通过脚本访问arguments.callee,访问这个属性会导致错误。

可以通过命名函数实现。

####2.闭包

在另一个函数内部定义的函数会将包含外部函数的**活动对象**添加到它的作用域链中。因此，在createComparisonFunction()函数内部定义的匿名函数的作用域链中，实际上将会包含外部函数createComparisonFunction()的活动对象。
	
	function createComparisonFunction(propertyName) {
		return function(object1,object2){
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];

			if(value1 <value2){
				return -1;
			}else{
				return 1;
			}
		}
	}

	//创建函数
	var compare = createComparisonFunction('name');
	//调用函数
	var result = compare({name:'xun'},{name:'yun'});
	//解除对匿名函数的引用（以便释放内存空间）
	compare = null;

createComparisonFunction()函数在执行完毕后，其活动对象也不会被销毁，因为匿名函数的作用域链仍然在引用这个活动对象。话句话说，当createComparisonFunction()函数返回后，**其执行境的作用域链**会被销毁，但它的活动对象仍然会保留在内存中；直到匿名函数被销毁后，createComparisonFunction()的活动对象才被销毁。

（2）关于this对象

在闭包中使用this对象也可能会导致一些问题。this对象是在运行时基于函数的执行环境绑定的：在全局函数中，this等于window，而当函数被作为某个对象调用时，this等于那个对象。不过，匿名函数的执行环境具有全局性，因此其this对象通常指向window。

	var name = 'the window';
	var object = {
		name:'My object',
		getNameFunc:function(){
			return function(){
				return this.name;
			};
		}
	};
	alert(object.getNameFunc()()); //"the window"

	var name = 'the window';
	var object = {
		name:'My object',
		getNameFunc:function(){
			name:'hello';
			return function(){
				return this.name;
			};
		}
	};
	alert(object.getNameFunc()()); //"the window"

这个对象包含一个方法：getNameFunc()，它返回一个匿名函数，匿名函数又返回this.name。由于getNameFunc()返回一个函数，因此调用object.getNameFunc()()就会立即调用它返回的函数，

每个函数在被调用时，其活动对象都会自动取得两个特殊变量：this和arguments。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量。

this和arguments也存在同样的问题。如果想访问作用域中的arguments对象，必须将对象的引用保存到另一个闭包能够访问的变量中。

	var name = 'the window';
	var object = {
		name:'My object',
		getName:function(){
				return this.name;
		}
	};
	alert(object.getName()); //"My object"
	alert((object.getName)()); //"My object"
	alert((object.getName = object.getName))(); //"the window"

####4.私有变量
javascript中没有私有成员的概念；所有对象属性都是公有的。任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量。私有变量包括函数的参数、局部变量和在函数内部定义的其他函数。

如果在函数内部创建一个闭包，那么闭包通过自己的作用域链也可以访问这些变量。利用这一点，就可以创建用于访问私有变量的公有方法。

在构造函数中定义特权方法也有一个缺点，那就是必须使用构造函数模式来达到这个目的。构造函数模式的缺点是针对每个实例都会创建同样一组新方法，而使用静态私有变量来实现特权方法就可以避免这个问题。

（1）静态私有变量

通过在私有作用域重定义私有变量或函数，同样也可以创建特权方法，其基本模式如下所示。

	(function(){
		//私有变量和私有函数
		var privateVariable = 10;
		function privateFunction(){
			return false;
		}
		//构造函数 全局变量
		MyObject = function(){
		};
		//共有/特权方法
		MyObject.prototype.publicMethod = function(){
			privateVariable++;
			return privateFunction();
		};
	})();

公有方法在原型上定义的，这点体现了典型的原型模式。需要注意的是，这个模式在定义构造函数时并没有使用函数声明，而是使用了函数表达式。

这个模式的私有变量和函数时有实例共享的。由于特权方法在原型上定义的，因此所有的实例都是用同一个函数。而这个特权方法，作为一个闭包，总是保存着对包含作用域的引用。

（2）模块模式

为单例创建私有变量和特权方法。所谓单例，指的就是只有一个实例的对象。Javascript是以对象字面量的方式来创建单例对象的。

	var singleton = {
		name:value,
		method:function(){}
	};

	var singleton = function(){
		var privateVariable = 10;
		function privateFunction(){
			return false;
		}
		//共有/特权方法
		return {
			publicProperty: true,
			publicMethod: function(){
				privateVarable++;
				return privateFunction();
			}
		};
	}();

将一个对象字面量作为函数的值返回。这个对象字面量定义的是单例的公共接口。

必须创建一个对象并以某些数据对其进行初始化，同时还要公开访问这些私有数据的方法，那么就可以使用模块模式。以这种模式创建的每一个单例都是object的实例，因为最终要通过一个对象字面量来表示他。

####5.小结

递归函数应该使用arguments.callee来递归调用自身，不要使用函数名---函数名可能会发生变化。

当在函数内部定义了其它函数时，就创建了闭包。闭包有权访问包含函数在内的所有变量：
1.在后台执行环境中，闭包的作用域链包含着他自己的作用域、包含函数的作用域和全局作用域。
2.函数的作用域及其所有变量都会在函数执行结束后被销毁。
3.但是，当函数反悔了一个闭包时，这个函数的作用域将会一直在内存中保存到闭包不存在为止。

使用闭包可以在javascript中模仿快级作用域，要点是：
1.创建并立即调用一个函数，这样既可以执行其中的代码，又不会在内存中留下对该函数的引用。
2.结果就是函数内部的所有变量都会被立即销毁---除非将某些变量赋值给了包含作用域中的变量（外部作用域）。

