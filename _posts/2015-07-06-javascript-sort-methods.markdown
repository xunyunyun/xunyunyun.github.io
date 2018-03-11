---
layout: post
category: "Javascript"
title: "用javascript实现排序"
tags: ["排序"]
---

#### 各种排序算法的js实现（从小到大排序）

#### **选择排序**
{% highlight javascript %}
//依次选择最小，次小的。。。
//方法一
function selectSort(arr){
	var len = arr.length;
	var temp;
	for(var i = 0; i < len-1; i++){
		min = i;
		for(var j = i + 1; j < len; j++){
			if(arr[min] > arr[j]){
				min = j;
			}
		}
		temp = arr[min];
		arr[min] = arr[i];
		arr[i] = temp;
		//console.log(arr);
	}
	return arr;
}
// 方法二 这种排序，不用交换顺序
function selectSort2(arr){
	var len = arr.length;
	var result = [];
	var min;
	for(;len > 0;){
		min = 0;
		for(var j = 0; j < len; j++){
			if(arr[min] > arr[j]){
				min = j;
			}
		}
		result.push(arr[min]);
		arr.splice(min,1);
		len = arr.length;
		//console.log(arr);
	}
	return result;
}
//test
var arr = [4,6,2,3,1,8,0,5,7];
console.log(selectSort(arr));

var arr = [4,6,2,3,1,8,0,5,7];
console.log(selectSort2(arr));

{% endhighlight %}

#### **冒泡排序**

{% highlight javascript %}
//相邻两个比较，大的数逐个后移
function bubbleSort(arr){
	var len = arr.length;
	var temp;
	for( var i = 0; i < len - 1; i++){
		for(var j = 0; j < len - i - 1; j++){
			if(arr[j] > arr[j+1]){
				temp = arr[j+1];
				arr[j+1] = arr[j];
				arr[j] = temp;
			}
		}
		//console.log(arr);
	}
	return arr;
}
//test
var arr = [9,8,7,7,6,5,4,3,2,1];
console.log(bubbleSort(arr));
{% endhighlight %}

#### **快排**

{% highlight javascript %} 
//方法一
 function quickSort(arr){
 	if(arr.length <= 1){
 		return arr;
 	}
 	var flag = arr.pop();

 	return quickSort(arr.filter(function(i){
 		return i < flag;
 	})).concat(flag,quickSort(arr.filter(function(i){
 		return i >= flag;
 	})));
 }
 //test
var arr = [9,8,7,7,6,5,4,3,2,1,2];
console.log(quickSort(arr));

//方法二
function quicksort(arr){
	if(arr.length <= 1){return arr;}
	var pivoIndex = Math.floor(arr.length/2);
	var pivot = arr.splice(pivoIndex,1)[0];
	var left = [];
	var right = [];
	for(var i = 0; i < arr.length; i++){
		if(arr[i]<pivot){
			left.push(arr[i]);
		}else{
			right.push(arr[i]);
		}
	}
	return quicksort(left).concat([pivot],quicksort(right));
};
var array = [85,24,5,17,17,96,50];
console.log(quicksort(array));

{% endhighlight %}

#### **堆排序**

{% highlight javascript %}

/*
 *二叉堆为近似完全二叉树，此二叉树通过数组实现；
 *在数组中i节点的父节点下标为(i-1)/2；它的左右子节点下标分别为2i+1和2i+2；
 *需要先构建二叉堆（每个节点的左右子树都小于该节点）
 *思路：最大堆来得到从小到大的排序
 *堆的插入：插入到数组的尾部（二叉树的最下面的子节点），向上遍历：若父节点小于子节点，则交换；得到的父节点为最大值
 *堆的删除：删除数组的头部（二叉树的根节点），相当于头部和数组最后一个数交换，数组长度减1。向下遍历：找出左右子树中较大的和父节点比较，若父节点小于这个较大值，则交换；得到的父节点依旧最大；相当于调整堆。
 */
function stackSort(arr){

}	

// 构建二叉堆，上升过程
Array.prototype.buildMaxHeap = function() {
	// 从最后一个父节点向上面的父节点遍历
	for(var i = Math.floor(this.length/2)-1; i >= 0; i--){
		this.heapAdjust(i,this.length);
	}
}
// 交换
Array.prototype.swap = function(i,j) {
	var temp = this[i];
	this[i] = this[j];
	this[j] = temp;
}
// 堆排序
Array.prototype.heapSort =function() {
	this.buildMaxHeap();
	for(var i = this.length; i > 0; i--){
		this.swap(0,i);
		this.heapAdjust(0,i);
	}
	return this;
}
// 堆调整，下沉过程
// 参数：i为判断节点，j为长度
// 从i父节点开始调整,j为节点总数 从0开始计算 i节点的子节点为 2*i+1, 2*i+2
Array.prototype.heapAdjust = function(i,j) {
	var largest = i;
	var left = 2*i + 1;
	var right = 2*i + 2;
	if(left < j && this[largest] < this[left]){
		largest = left;
	}
	if(right < j && this[largest] < this[right]){
		largest = right;
	}
	// 使父节点最大
	if (largest !== i) {
		this.swap(i,largest);
		this.heapAdjust(largest,j);
	}
}
//test
var array = new Array();
[].push.apply(array,[4,6,2,3,1,8,0,5,7,9]);
var array = array.heapSort();
for(var i = 0, len = array.length; i < len; i++){
	if(array[i] === undefined){
		array.splice(i,1);
	}
}
console.log(array);
{% endhighlight %}
