---
layout: post
category: "android"
title:  "Android Dialog风格Activity"
tags: [Android,Dialog]
---
在Manifist文件中，对Activity添加一项theme的属性，值为@android:style/Theme.Dialog就能将Activity以对话框形式显示。例如：

{% highlight xml %}
<activity android:name=".DialogActivity" android:label="@string/new_name"android:theme="@android:style/Theme.Dialog"/>
{% endhighlight %}
