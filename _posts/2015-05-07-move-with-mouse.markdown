---
layout: post
category: "javascript"
title:  "鼠标拖拽和遮罩的实现"
tags: ["javascript"]
---

//获取元素对象

    function g(id){
        return document.getElmentById(id);
    }

//弹出窗的自动居中

    function autoCenter(el){ 
        var bodyW = document.documentElement.clientWidth;
        var bodyH = document.documentElement.clientHeight;
        
        var elW = el.offsetWidth;
        var elH = el.offsetHeight;
        
        el.style.left = (bodyW - elW)/2+'px';
        el.style.left = (bodyW - elW)/2+'px';
    }

//自动全屏 - 遮罩

    function fillToBody(el){
        el.style.width = document.documentElement.clientWidth +'px';
        el.style.height = document.documentElement.clientHeight +'px';
    }

//鼠标按下---计算鼠标距离标题栏左边界和上边界的距离

    g('dialogTitle').addEventListener('mousedown',function(e){
       var e = e || window.event;
       mouseOffsetX = e.pageX - g('dialog').offsetLeft;
       mouseOffsetY = e.pageY - g('dialog').offsetTop;
       isDraging = true;
    });

    document.onmousemove = function(e){
        var e = e || window.event;
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var moveX = 0;
        var moveY = 0;
        if(isDraging === true){
            moveX = mouseX - mouseOffsetX;
            moveY = mouseY - mouseOffsetY;
            //碰撞检测
            var pageWidth = document.documentElement.clientWidth;
            var pageHeight = document.documentElement.clientHeight;
            var dialogWidth = g('dialog').offsetWidth;
            var dialogHeight = g('dialog').offsetHeight;
            var maxX = pageWidth - dialogWidth;
            var maxY = pageHeight - dialogHeight;
            mouseX = Math.min(maxX, Math.max(0,moveX));
            mouseY = Math.min(maxY, Math.max(0,moveY));
            g('dialog').style.left = mouseX +'px';
            g('dialog').style.top = mouseY +'px';
        }
    }

//鼠标松开

    document.onmouseup = function(){
        isDraging = false; 
    }

