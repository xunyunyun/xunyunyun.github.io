---
layout: post
category: "android"
title:  "Android常见问题汇集"
tags: [Android,问题汇集]
---
#### 1、4大组件:Activity,Service,Content Provider,BroadcastReceiver.

#### 2、AbsoluteLayout,FrameLayout,RelativeLayout,LinearLayout,TableLayout.

#### 3、startservice和bindService生命周期差别：
onCreate()..onStart()..onDestroy();  
OnCreate()..onBind()..onUnbind()..onDestroy();  
可startService()或bind()多次，但只onCreate()一次。

#### 4、Handler, Looper, MessageQueue和UI Thread关系。
Message：消息，其中包含了消息ID，消息处理对象以及处理的数据等，由MessageQueue 统一列队，终由Handler 处理。  
Handler：处理者，负责Message 的发送及处理。使用Handler 时，需要实现handleMessage(Message msg)方法来对特定的Message 进行处理，例如更新UI 等。  
MessageQueue：消息队列，用来存放Handler 发送过来的消息，并按照FIFO 规则执行。当然，存放Message并非实际意义的保存，而是将Message以链表的方式串联起来的，等待Looper 的抽取。  
Looper：消息泵，不断地从MessageQueue 中抽取Message 执行。因此，一个MessageQueue需要一Looper。Thread：线程，负责调度整个消息循环，即消息循环的执行场所。

#### 5、Android多线程方法。
1)Activity.runOnUiThread(Runnable)  
2)View.post(Runnable) ;View.postDelay(Runnable , long)  
3)Handler  
4)AsyncTask

#### 6、sleep(),wait()含义。
sleep是静态方法，是进入等待池中等待。  
wait()是进入等待池等待，让出系统资源。等待其他线程调用notifyall方法唤醒等待池中的所有线程。  

#### 7、单例模式中,懒汉式和饿汉式的区别。
饿汉式是线程安全的,在类创建的同时就已经创建好一个静态的对象供系统使用,以后不在改变。  
懒汉式如果在创建实例对象时不加上synchronized则会导致对对象的访问不是线程安全的。

#### 8、JNI、AIDL区别。
jni  是用于 java 应用层去调用 c++ 或者c 编写的库。比如Cocos2dx游戏开发，游戏主体在C++中实现，通过Java层调用。  
aidl 是用于进程间的通信，跨进程服务。有点像应用群体内的一个能提供特定服务的供应商。

#### 9、Android APK的数字签名的作用
这个数字签名由应用程序的作者完成，并不需要权威的数字证书签名机构认证，它只是用来让应用程序包自我认证的。 

#### 10.ListView解决方案。
setTag,图片缓存

#### 11.同步异步区别。
同步解决数据共享问题，控制某一资源的访问。对象锁。  
异步解决一个对象的某一方法同时被多个点竞争访问的问题。对象锁，信号量。

#### 12.多屏幕适配问题
a.使用宽度及高度适配的界面布局，最大限度兼容各类尺寸屏幕。  
b.对于一些特殊界面，如仅能一屏显示，而不同尺寸屏幕显示效果不一样时，可针对特定屏建立布局文件来解决。  
c.相应地，不同布局会用到不同分辨率图片。  
例子有，MEZU手机，华为手机，作过针对适配。

#### 13.Android View 树的绘制
Adroid的UI界面都是由View和ViewGroup及其派生类组合而成的。View 树的绘制从顶向下逐层进行绘制。

#### 14.低版本如何实现高版本功能及风格统一。
引入android-support-v4.jar。自定义一些界面风格，从而在不用厂商生产的手机上达到一致的界面效果。

#### 15.遇到过的难于解决的问题
视情况回答。
