---
layout: post
category: "android"
title:  "Android退出前的stopService"
tags: [Android,Service]
---
Android退出System.exit(0)前stopService可能使Service未来得及进入onDestroy进程就已退出了。解决办法：延时100ms左右再调stopService. 
