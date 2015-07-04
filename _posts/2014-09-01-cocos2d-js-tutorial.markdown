---
layout: post
category: "cocos2d"
title:  "Cocos2d-JS steps under web and Android Platform."
tags: [Cocos2d]
---
folder structure of sdk:  
	http://www.cocos2d-x.org/wiki/Folder_Structure_of_Cocos2d-JS  
why js?  
	http://cocos2d-x.org/docs/manual/framework/html5/v2/cocosh5-advantages/en

####Environment Requirements
	A Supported OS (Ubuntu 12.10+, OS X 10.7+, Windows 7+)
	Cocos2d-x v3.0 (https://github.com/cocos2d/cocos2d-x/)
	JDK/SDK 1.6+
	NDK r9d+
	Apache Ant
	Python 2.7.5
	WebStorm8.0.4(Key:http://peter2009.iteye.com/blog/1975994) & JetBrains-IDE-support for Chrome.
	IDE & Android SDK: ADT Bundle For Windows (64-bit)

####Environment setting:
	cd cocos2d/cocos2d-js-v3.0-rc3/
	python ./setup.py
	COCOS2D_CONSOLE_ROOT & NDK_ROOT & ANDROID_SDK_ROOT & ANT_ROOT。

####Build and Test
	@new project
	cocos new js-helloworld -l js

	@run test
	cd js-helloworld
	@cocos run -p web
	or
	@cocos run -p android

COCOS CODE IDE 创建工程。运行为Adnroid工程。然后用Eclipse打开工程，导入js-binding下的cocos库，可以调试Android。