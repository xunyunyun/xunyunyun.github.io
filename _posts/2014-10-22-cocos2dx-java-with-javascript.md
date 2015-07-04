---
layout: post
category: "cocos2d"
title: "cocos2dx javascript与java互相调用途径"
tags: ["cocos2d"]
---
libcocos2dx工程中添加Cocos2dxJavascriptJavaBridge.java  
该文件在frameworks\js-bindings\bindings\manual\platform\android\java\src\org\cocos2dx\lib中。  

java代码：//cn.winfirm.tools.JavascriptHelper.java

	public class JavascriptHelper {
		//method to call javascript
		public static final void callJavascriptMethod() {//【java调用javascript方法】
			final String jsCallStr = String.format("JavaHelper.javascriptMethod('%s')", "hello world, from javascript");
			Cocos2dxHelper.runOnGLThread(new Runnable() {
				@Override
				public void run() {
					Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
				}
			});
		}
		//call by javascript
		public static final String loadJavaMethod(final int no, final String description) {
			return "no="+no+",description="+description;
		}
	}

javascript代码：//JavaHelper.js

	var JavaHelper = JavaHelper||{};
	JavaHelper.callClassName = "cn/winfirm/tools/JavascriptHelper";

	JavaHelper.javascriptMethod=function(param) {
		cc.log(param); // "hello world, javascript"
	}

	JavaHelper.callToJava=function() {//【javascript调用java方法】
		var methodName = "loadJavaMethod";
		var signature = "(ILjava/lang/String;)Ljava/lang/String;";
		var param1=30;
		var param2="hello world, from javascript";
		
		var result = jsb.reflection.callStaticMethod(JavaHelper.callClassName, methodName, signature, param1, param2);
		cc.log(result);//"no=30,description=hello world, from javascript"
	}

javascript调用java方法时的签名类型：  
[JAVA]	[signature]  
int		I  
float	F  
boolean	Z  
String	Ljava/lang/String;  
void	V  
与JNI规范相似，但类型少得多。  

（完~）
