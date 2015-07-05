---
layout: post
category: "cocos2d"
title:  "Android Cocos2dx 编译过程"
tags: [android,cocos2dx]
---
可能用到JDK，Python，Eclipse建议先行安装与配置好，在此不再多述。最好将adt-bundle-windows，android-ndk-r9c，cocos2dx2.2解压到同一目录下，如D:\cocos2dx。以下主要讨论Windows下NDK环境编译cocos2d-x工程的步骤。

####一、工程创建
cmd进入cocos2d-x2.2目录的tools\project-creator，执行: python create_project.py -project helloworld -package com.allthelucky.game -language cpp<br/>
末尾出现Have Fun!时，表示工程创建成功，在D:\cocos2dx\cocos2d-x-2.2.2\projects\helloworld可看到各平台对应项目，包括Android平台的pro.android，然后就是程序编写或编译了。

####二、Android工程编译
1)单独NDK编译方法：<br/>
1)添加NDK路径D:\cocos2dx\android-ndk-r9c Path。<br/>
2)添加环境变量NDK_MODULE_PATH，其值为D:\cocos2dx\cocos2d-x-2.2.2;D:\cocos2dx\cocos2d-x-2.2.2\cocos2dx\platform\third_party\android\prebuilt。<br/>
3)cmd进入pro.android目录下，执行ndk-build就可开始编译了。

2)Eclipse(CDT)编译方法：<br/>
1)导入Android工程序所需的Library库工程。D:\cocos2dx\cocos2d-x-2.2.2\cocos2dx\platform\android\java<br/>
2)打开pro.android工程Properties，选中C/C++ Build选项，将Build Settings选项卡下“Build command”的值由原来的bash ${ProjDirPath}/build_native.sh改为：D:\cocos2dx\android-ndk-r9c\ndk-build.cmd，子栏目Environment下加入NDK_MODULE_PATH，值为E:D:\cocos2dx\cocos2d-x-2.2.2;D:\cocos2dx\cocos2d-x-2.2.2\cocos2dx\platform\third_party\android\prebuilt<br/>
3)最后Clean一下工程，再运行Android程序即开始编译了。<br/>
4)查看cocos2dx代码：Preference->Workspace->Linked Resources添加COCOS2DX变量及值D:\cocos2dx\cocos2d-x-2.2.2

####三、Win32工程编译
1)环境WIN7+VS2012，方便代码查看或输入，建议安装Visual Assist X插件<br/>
2)进入目录,运行build-win32.bat编译cocos2d-x库。<br/>
3)vs2012打开cocos2d-win32.vc2012.sln,然后Build Solution编译工程。

####四、演示项目
<https://github.com/panxw/android-develop-toolkit/tree/master/AndroidCocos2dx>

#####五、其它问题
fatal error: AppDelegate.h: No such file or directory，原因可能是pro.android已不在D:\cocos2dx\cocos2d-x-2.2.2\projects\helloworld目录下了。
