---
layout: post
category: "android"
title:  "Android数据保存与恢复"
tags: [数据恢复]
---
在一个项目中，我使用onSaveInstanceState和onRestoreInstanceState中对数据做了保存与恢复，但应用被91助手等清理后重新进入，还是偶有Activity报空指针错误的情况。查看LOG发现onCreate使用数据代码行，在onRestoreInstanceState数据恢复之前就已执行了。后来换成在onCreate中进行数据恢复，就没再出现这种情况了。  

示例代码：
{% highlight java %}
	private String data="some user data";
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		if(savedInstanceState!=null) {//如果有数据被需恢复，onRestoreInstanceState会被触发，并将savedInstanceState传递到onCreate
			Log.d(TAG,"onRestoreInstanceState is not null...");
			data=savedInstanceState.getString("data");
		}
		
		//tv.setText(data);
	}

	@Override
	protected void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
		outdate.putString("data", data);
	}

	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {//savedInstanceState会传递到onCreate，在onCreate中恢复
		super.onRestoreInstanceState(savedInstanceState);
		//data=savedInstanceState.getString("data");//不在这里用data=savedInstanceState.getString("data");直接来恢复。
	}
{% endhighlight %}

参考文章：<http://blog.csdn.net/lixiang0522/article/details/7565401>

