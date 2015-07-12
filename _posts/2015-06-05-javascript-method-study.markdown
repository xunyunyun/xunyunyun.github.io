---
layout: post
category: "Javascript"
title: "实现一些小功能（月影老师）"
tags: ["月影课堂问题"]
---

####1.判断是否为素数

{% highlight javascript %}
function isPrime(number){
    var temp = Math.sqrt(number);
    if(number <= 1){ return false;}
    for(var i = 2; i <= temp;i++){
        if(number%i===0){
            result=false;
            break;
        }
    }
    return result;
}
//test
console.log(isPrime(7));
{% endhighlight %}

####2.判断是否为字符串或数组

{% highlight javascript %}
function isArray(arr) {
	return Array.isArray(arr)||Object.prototype.toString.call(arr)==='[object Array]';
}
//test
console.log(isArray([1,2,3,4,5]));

function isString(str) {
	return Object.prototype.toString.call(str)==='[object String]';
}
//test
console.log(isString("abcdefg"));
{% endhighlight %}


####3.字符串逆序

{% highlight javascript %}
// method first
function reverseStr(str){
	var arr=[].slice.call(str);
  	arr.reverse();
  	return result = arr.join("");  	
}
console.log(reverseStr("abcdefg"));
//  method second
function reverse(str){
	var temp = [];
	for(var i=str.length-1; i>=0; i--){
		temp.push(str.charAt(i));
	}
	return temp.join("");
}
//test
var str = "abcdefghi";
console.log(reverseStr(str));
console.log(reverse(str));
{% endhighlight %}

####4.数组去重

{% highlight javascript %}
//单个化
function normalize(arr) {
    if (arr && Array.isArray(arr)) {
        var i, len, map = {};
        for (i = arr.length; i >= 0; --i) {
            if (arr[i] in map) {
                arr.splice(i, 1);
            } else {
                map[arr[i]] = true;
            }
        }
    }
    return arr;
}
//生成0~100之间的随机整数组成长度为100的数组
function randomArr() {
	var res=[];
	var i;
	for( i = 0; i < 100; i ++ ){
		res.push(Math.floor(Math.random()*100));
	}
	return res;
}
//test
var input = randomArr();

// 加上一个排序，为了方便观察是否实现去重
input.sort(function (a, b) {
    return a - b;
});
console.log(input);

normalize(input);
console.log(input);

{% endhighlight %}

####5.将argument转化为数组

{% highlight javascript %}
//slice函数返回一个数组（部分）的浅拷贝，为一个新数组对象
function argumentsToArray(param){
	return Array.prototype.slice.call(param);
}
function test(){
	var args = argumentsToArray(arguments);
	return Object.prototype.toString.call(args) === '[object Array]';

}
console.log(test(1, 2, 3, 4));
{% endhighlight %}


####6.求传入参数的和

{% highlight javascript %}
//考察点argument转数组
function sum(){
	var arr = Array.prototype.slice.call(arguments);
	var sum = 0;
	for(var i = 0, len = arr.length; i < len; i++){
		sum += arr[i];
	}
	return sum;
}
//test
console.log(sum(1, 2, 3, 4));
console.log(sum(1, 2));
{% endhighlight %}

####7.第二大数

{% highlight javascript %}
//考察点：不能用sort函数实现数字型数组排序，但可以实现字符串型数组按首字母排序
var arr=[13,24,3,5,56,78,9];
arr.sort(function(n1,n2){
  return n1-n2;
});
console.log(arr[1]);
{% endhighlight %}

####8.离3近排序

{% highlight javascript %}
//与上面思路相同
var arr = [1,2,3,4,5,6,7,8,0];
arr = arr.sort(function(n1,n2){
	return Math.abs(n1-3)-Math.abs(n2-3);
});
console.log(arr);
{% endhighlight %}


####9.数组扁平化

{% highlight javascript %}
function flat(data, result) {
    var i, d, len;
    for (i = 0, len = data.length; i < len; ++i) {
        d = data[i];
        if (typeof d === 'number') {
            result.push(d);
        } else {
            flat(d, result);
        }
    }
}
//test
var data =  [1, [2, [ [3, 4], 5], 6]];
var result = [];
flat(data, result);
console.log(result);
{% endhighlight %}

####10.数组有序变无序

{% highlight javascript %}
Array.prototype.getRandomArray = function(){
    this.sort(function(a, b){
        return Math.random() - 0.5;
    });
    return this;
}
var arr = [];
for(var i = 0; i < 100; i++){
    arr[i] = i;
}
console.log(arr.getRandomArray());
{% endhighlight %}

####10.数组中的最大奇数和最小偶数

{% highlight javascript %}
// method first
Array.prototype.getSumOfMaxOddAndMinEven = function(){
	var oddArr = [],
		evenArr = [];
	for(var i = 0, len = this.length; i < len; i++){
		if(this[i] % 1 !== 0){
			console.log("不是整数数组");
			return;
		}
		if(this[i] % 2 == 0){
			evenArr.push(this[i]);
		}else{
			oddArr.push(this[i]);
		}
	}

	oddArr.sort(function(a, b){
		return b - a;
	});
	evenArr.sort(function(a, b){
		return a - b;
	});

	if(oddArr.length > 0 && evenArr.length > 0){
		return oddArr[0] + evenArr[0];
	}else{
		return null;
	}
}
//method second use filter
Array.prototype.getSumOfMaxOddAndMinEven = function(){
	for(var i = 0, len = this.length; i < len; i++){
		if(this[i] % 1 !== 0){
			console.log("不是整数数组");
			return;
		}
	}
	var oddArr = this.filter(function(a){
		return a % 2 == 1;
	});

	var evenArr = this.filter(function(a){
		return a % 2 == 0;
	});

	if(oddArr.length == 0 || evenArr.length == 0){
		return null;
	}else{
		return Math.max.apply(null, oddArr) + Math.min.apply(null, evenArr);
	}
}
//测试用例

var arr = [1, 2, 3, 4, 5];
console.log(arr.getSumOfMaxOddAndMinEven());//7

var arr = [2, 4, 6];
console.log(arr.getSumOfMaxOddAndMinEven());//null

var arr = [1, 3, 5];
console.log(arr.getSumOfMaxOddAndMinEven());//null

var arr = [-1, 0, 1];
console.log(arr.getSumOfMaxOddAndMinEven());//1

var arr = [1.1, 2.1, 3, 4, 5];
console.log(arr.getSumOfMaxOddAndMinEven());//不是整数数组

{% endhighlight %}


####11.判断字符串是否为回文

{% highlight javascript %}
//思路: 将字符串反转之后，与原字符串比较；
function ishuiwen(str){
	var str1 = [].slice.call(str).reverse().join('');
  	if(str1 === str){
  		return true;
  	}
  	else{
  		return false;
  	} 
}
console.log(ishuiwen("abcdedcba"));
console.log(ishuiwen("abcdecba"));
{% endhighlight %}

####12.将整数的10进制转化为其他进制

{% highlight javascript %}
//方法一 思路: 从低位转化，再反转；
function mulBase(num, base){
	var arr = [];
	for(;num > 0;){
		arr.push( num % base );
		num = Math.floor(num / base);
	}	
	console.log(arr);
	return arr.reverse().join('');  	
}
//方法二 思路: 从低位转化，数组前面插入
function mulBase2(num, base){
	var arr = [];
	for(;num > 0;){
		arr.unshift( num % base );
		num = Math.floor(num / base);
	}	
	console.log(arr);
	return arr.join('');  	
}

console.log(mulBase(64,8));
console.log(mulBase2(64,8));
{% endhighlight %}

