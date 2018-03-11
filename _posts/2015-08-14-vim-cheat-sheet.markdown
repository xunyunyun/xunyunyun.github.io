---
layout: post
category: "blog"
title:  "vim操作学习"
tags: ["blog"]
---

#### Vim cheat sheet常用快捷键

1. shift+T tab方式打开文件

2. ctrl+p 查找文件

3. 文件增删改

o -> 
    
     a  创建一个文件

     m  修改一个文件

     d  删除一个文件

     c  复制一个文件

     f  filter file's  extention

|快捷键|功能|
|:---|:---|
|ESC|退出insert模式，进入Normal模式|
|dd |删除当前行|
|\dc|自动为函数添加注释|
|y|在ctrl+v或者shift+v选中内容后，复制到剪贴板|
|yy|复制光标所在整行|
|u|输入u来撤销最后执行的命令|
|ctrl+r|恢复命令，也就是撤销掉撤销命令|
|p|粘贴剪切板|
|0|跳转到行首|
|$|跳转到行尾|
|gg=G|对整个文本进行格式化|
|=|用shift+v选中多行后，按=号，可以格式化所选行|
|\be|查看最近编辑过的文件列表|
|ctrl+6|查看上一次编辑过的文件|
|zm|全部关闭folder|
|zn|全部展开folder|
|zc|展开一级folder|
|v|进入可视模式，选中代码块，上下左右移动，可选中更多。|
|ctrl+v|进入可视模块，选中摸个区块内的字符|
|alt + 鼠标移动|进入自由选择模式，可实现跨tab拷贝粘贴|
|shift + insert|插入|
|ctrl + insert|复制|
|ctrl+w，然后 |最大化当前分栏|
|:sp|快速横向分屏|
|ctrl+wv|快速竖向分屏|
|:set paste|进入粘贴模式，不会自动缩进，退出的话:set nopaste|
|:set wrap|自动换行，退出的话:set nowrap|
|:set foldmethod=indent|html代码折叠|

