---
layout: post
category: "android"
title:  "Android调用系统安装/卸载apk过程"
tags: [Android,apk]
---
1、安装apk
{% highlight java %}
String dirPath = "/data/data/" + getPackageName() + "/files/test.apk"; //文件需有可读权限
Intent intent = new Intent();
intent.setAction(android.content.Intent.ACTION_VIEW);
intent.setDataAndType(Uri.parse("file://" + filePath), "application/vnd.android.package-archive");
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
startActivity(intent);
{% endhighlight %}

2、卸载apk
{% highlight java %}
 private void startUninstall(final String pkg) {
  if (!InstallUtils.isApkInstalled(mContext, pkg)) {
   Toast.makeText(mContext, "程序未安装，无需卸载！", Toast.LENGTH_SHORT).show();
   return;
  } else {
   Uri packageURI = Uri.parse("package:" + pkg);
   Intent uninstallIntent = new Intent(Intent.ACTION_DELETE, packageURI);
   startActivity(uninstallIntent);
  }
 }
{% endhighlight %}

3、run运行
{% highlight java %}
  Intent to = new Intent();
  to.putExtra("TOP", "你好，来自上层信息");
  to.setClassName(pkgName, clsName);
  to.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
  startActivity(to);
{% endhighlight %}

4、工具
{% highlight java %}
 InstallUtils.java　public static boolean isApkInstalled(Context context, final String pkgName) {
　try {
   context.getPackageManager().getPackageInfo(pkgName, 0);
   return true;
  } catch (NameNotFoundException e) {
   //e.printStackTrace();
  }
  return false;
{% endhighlight %}

5、将安装的程序AndroidManifest.xml设置入口类为：
{% highlight xml %}
<intent-filter >
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
</intent-filter>就不会在桌面出现该应用的启动图标了。
{% endhighlight %}

6、启动任意另一个apk中的任一Activity。 与第5点一样，需在启动的Activity配置Intentfilter：
{% highlight java %}
<intent-filter >
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
</intent-filter>
{% endhighlight %}