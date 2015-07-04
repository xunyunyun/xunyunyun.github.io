---
layout: post
category: "java"
title: "Manven构建基本步骤"
tags: ["manven"]
---
####主要步骤
1, download and install maven。  
2, mvn archetype:create -DgroupId=com.mycompany.app -DartifactId=my-app 创建新工程。  
3, mvn package 将代码打包到输出到target目录。  
4, mvn test 将测试代码到包输出到target目录。  
5, mvn clean 清理target目录。  
6, mvn install 将打包好的jar包安装到本地库中，一般没默认是在用户目录下的.m2\目录。  
7, mvn deploy 发布到nexus远程仓库。  

####其它
1, 搜索需要的包：http://mvnrepository.com/  
2, maven中心库访问总出现超时问题解决。  
开源中国提供了镜像（同步于http://mirrors.ibiblio.org/maven2/），使用方法见：http://maven.oschina.net/help.html  
3, Maven报错“未结束的字符串字面值”，参考：http://www.cnblogs.com/yeyong/p/3906371.html  
4, eclipse 提示tools.jar找不到，则检查下jre环境。  

####附pom.xml主要结构：

	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	  <modelVersion>4.0.0</modelVersion>

	  <groupId>com.youth168.maventest</groupId>
	  <artifactId>my-maven-app</artifactId>
	  <version>1.0-SNAPSHOT</version>
	  <packaging>jar</packaging>

	  <name>my-maven-app</name>
	  <url>http://maven.apache.org</url>

	  <properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	  </properties>

	  <dependencies>
		<dependency>
		  <groupId>junit</groupId>
		  <artifactId>junit</artifactId>
		  <version>{latest-version}</version>
		  <scope>test</scope>
		</dependency>
	  </dependencies>
	</project>
	

（完~）
