---
layout: post
category: "android"
title:  "基于Android+WebView的OAuth2.0认证过程分析及简单模型实现"
tags: [Android,OAuth2.0]
---

A simple oauthv2 model for android by webview
一、以Android+WebView为例，简要说明一下OAuth2.0认证授权过程：

1，以在开放平台注册应用的appId,appSecret,callbackUrl，组装认证url，以WebView为桥梁，向开放平台认证中心发起认证请求。

2，认证中心判断应用来源，合法则跳转到用户授权界面(网页)，用户输入帐号及密码并同意授权则向认证中心发起授权。

3，认证中心对授权请求进行处理，以callbackUrl加参数的方式Rediret，这时拦截Rediret url后附带的参数即可知认证结果。

4，认证成功将获得open_id，access_token，refresh_token，expire_time等参数，用这些参数就可以向开放平台的业务层接口发起请求了。

注：开放平台各异，OAuth2.0中appSecret也可能没用到，也不一定都返回了open_id这东西。


二、测试

运行apk后即可模拟认证授权，输入admin,888888就可以授权成功了。