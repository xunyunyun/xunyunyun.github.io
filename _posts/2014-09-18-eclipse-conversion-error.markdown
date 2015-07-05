---
layout: post
category: "android"
title:  "Eclipse签名打包遇“Conversion to Dalvik format...”处理"
tags: [Eclipse]
---
Eclipse单个Android App打包正常，但Lib+App方式时，签名打包总报如下错误：  
"Export Wizard: Conversion to Dalvik format failed with error 1"

解决办法：Project关闭“Build Automatically”选项，再Clean Lib+App，最后用Key来签名打包。  
参考：<http://stackoverflow.com/questions/20355333/conversion-to-dalvik-format-failed-with-error-1>

（完~）