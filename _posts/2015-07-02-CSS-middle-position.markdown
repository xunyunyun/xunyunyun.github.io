---
layout: post
category: "CSS"
title: "几种居中布局"
tags: ["布局"]
---

####一、水平居中设置

#####**1.对于行内元素**

为父元素设置：
```
text-align：center
```

#####**2.对于定宽块状元素**

  a.设置

```
margin:0 auto
```

  b.参考下文中的负外边距居中

#####**3.对于不定宽块状元素**

  a.通过加<table>标签

  b.父元素设置：
```
text-align：center
```
子元素：
```
display: inline;
```

  c.父元素设置：
```
float: left; position: relative; left: 50%;
```
子元素：
```
position: relative; left: -50%;
```
    这种方法在移动端有问题

#####**4.对于浮动元素**
可用下文中的负外边距居中和绝对定位居中

####二、垂直居中设置

#####**1.对于父元素高度确定的单行文本**

对父元素设置：height=line-height

#####**2.对于父元素高度确定的多行文本、图片、块状元素**

  a.使用<table>标签，同时设置
  ```
  vertical-align: middle;
  ```

  b.设置
  ```
  display:table-cell; vertical-align: middle;
  ```

  c.根据下文中的设置

####三、水平垂直同时居中问题

#####**1.绝对定位居中**

```
{ margin: auto; position: absolute; top: 0; left:0; bottom: 0; right: 0;}
```

    适用情况：不定宽高的img元素在固定宽高父元素中居中显示
    如果父元素宽高小于子元素会溢出，若给子元素设置width:100%会使图像有放大失真的风险。解决方法：max-width=父元素宽度
    其优点：
    1.支持跨浏览器，包括IE8-IE10  
    2.无需其它标记，CSS代码量少  
    3.支持百分比属性值和min-/max-属性   
    4.只用这一个类实现任何内容块的居中（不适用box-sizing属前提下）    
    5.内容块可以被重绘    
    6.完美支持图片居中   
    其缺点：   
    1.必须声明高度（图片不声明也可以，按图片大小）   
    2.建议使用overflow:auto来防止内容溢出或通过上文提到的max-width=父元素宽度|max-width=100%   
    3.在window phone设备上不起作用 
    两点说明：
    绝对定位元素不在普通流中渲染，因此margin: auto可使内容通过{ top: 0; left:0; bottom: 0; right: 0;}实现边界内居中
    给内容块元素设置padding也不影响内容块元素的绝对居中实现。

#####**2.不定宽高（负外边距居中）**

```
div { width: 300px; height: 200px; margin: -100px 0 0 -150px; position: absolute;
left:50%; top:50%;}
```

    其优点：
    1.良好跨浏览器兼容IE6-7
    2.代码量少
    其缺点：
    1.不能自适应，不支持百分比和min-/max-属性设置
    2.内容可能溢出