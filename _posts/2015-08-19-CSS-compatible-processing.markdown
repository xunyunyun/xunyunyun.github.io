---
layout: post
category: "CSS"
title:  "CSS兼容处理"
tags: ["CSS","IE兼容"]
---


#### CSS兼容性处理学习

1.对于IE6不支持png图片的处理，有两种方式：

（1）对图片做处理，通过PS存成PNG8+杂边处理为背景色，但是存在背景色不是单一色的问题

（2）对有png的图片加上pngfix类，然后对html文件加上一个js文件如下：

    <!--[if lt IE 6 ]>
        <script src="http://s5.qhimg.com/!3a9fa3bb/evpng.js"></script>
    <![endif]-->

2.对于IE7-不支持display：inline-block的问题，对于原来的块级标签改成行级标签，使元素不占满整行。但是具体问题需调整。

3.对于IE8-不支持HTML5新标签，通过对html文件加上一个js文件如下：

    <!--[if IE]>
        <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    < ![endif]-->

使其能够在IE下对html5标签识别。并且设置新标签样式为 display:block;

一定在打开页面的时候允许阻止的内容，不然会影响js文件的加载。

4.通过text-align:center设置:

可以使display:block;的元素中的单行文本左右居中；使display:inline;和display:inline-block;的元素直接居中。

5.对于第一个li元素没有左边框，其他元素需要左边框的问题；但在IE6下不支持第一个元素first-child选择器的问题。

可以通过设置li元素的父元素ul的margin-left:-1px; overflow:hidden;

这个方案同样可以解决最后一行的li标签没有border-bottom，其他行li标签有border-bottom的问题。

6.IE下设置zoom:1;的作用。触发IE下的haslayout。

什么是haslayout？

haslayout是IE特有的一个属性。很多的ie的css bug都与其息息相关。在ie中，一个元素要么自己对自身的内容进行计算大小和组织，要么依赖于父元素来计算尺寸和组织内容。当一个元素的haslayout属性为true时，他负责对自己和可能的子孙元素尺寸计算和定位。虽然这意味着这个元素需要花更多的代价来维护自身和里面的内容，而不是依赖于祖先元素来完成这些工作。

下列元素默认 hasLayout=true 

```<table> <td> <body> <img> <hr> <input> <select> <textarea> <button> <iframe> <embed> <object> <applet> <marquee> ```

很多情况下，我们把 hasLayout的状态改成true 就可以解决很大部分ie下显示的bug。 

hasLayout属性不能直接设定，你只能通过设定一些特定的css属性来触发并改变 hasLayout 状态。下面列出可以触发hasLayout的一些CSS属性值。 

------------------------------------- 

display 
启动haslayout的值:inline-block 
取消hasLayout的值:其他值 

-------------------------------------- 

width/height 
启动hasLayout的值：除了auto以外的值 
取消hasLayout的值：auto 

--------------------------------------- 

position 
启动hasLayout的值：absolute 
取消hasLayout的值：static 

---------------------------------------- 

float 
启动hasLayout的值：left或right 
取消hasLayout的值：none 

--------------------------------------- 

zoom 
启动hasLayout的值：有值 
取消hasLayout的值：narmal或者空值 
（zoom是微软IE专有属性，可以触发hasLayout但不会影响页面的显示效果。zoom: 1常用来除错，不过 ie 5 对这个属性不支持。） 


#### CSS注意问题

1.对于小图片，没有实际意义的图片；尽量以北京图片的方式显示

2.页面上整体布局尽量不要使用position:absolute；这种脱离文档流。使用margin来定位即可。

3.对于一些CSS3新的选择器在IE下的兼容很不好，不适合使用在PC页面。但是可以在为移动页面上采用。

除此，还有一些box-sizing:border-box;对于考虑IE兼容问题上，也不要再PC页面上使用。

4.对于一些margin定位问题，一般设置上一个元素的margin-bottom，而不是设置下一个元素的margin-top；这样设置修改更方便。



