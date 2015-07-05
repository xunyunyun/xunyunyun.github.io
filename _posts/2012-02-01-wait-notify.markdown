---
layout: post
category: "android"
title:  "wait和notify/notifyAll"
tags: Java 线程
---
wait等待某个条件发生，而改变这个条件超出了当前方法的控制能力，常由另一个任务来改变。而notify和notifyAll则表示感兴趣的事件发生了，于是唤醒wait之后动作执行。
