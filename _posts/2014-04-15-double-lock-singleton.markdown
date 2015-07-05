---
layout: post
category: "java"
title:  "双重检查加锁单例"
tags: [单例]
---
双重检查加锁单例，解决多线程访问和效率问题。
{% highlight java %}
public class Singleton {
	private volatile static Singleton instance=null;
	private Singleton(){
	}
	
	public static Singleton getInstance(){
		if(null == instance) {
			synchronized(Singleton.class) {
				if(null==instance) {
					instance = new Singleton();
				}
			}
		}
		return instance;
	}
}
{% endhighlight %}

以上java 5及以上版本有效。

