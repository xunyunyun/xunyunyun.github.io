---
layout: post
category: "https"
title:  "https迁移nginx配置"
tags: ["https","openssl"]
---

#### 背景
ios系统要求网址尽量采用https安全协议，因此，对项目进行https迁移配置。

主要是对测试环境下，此域名走https因为没有安全的CA签名证书不能正确访问问题进行解决。

为了解决这个问题，需要如下两个步骤：
1. openssl生成自签名证书
2. nginx配置支持https

#### openssl生成自签名证书

openssl

是一个多功能命令行工具，他可以实现加密解密，甚至还可以当CA来用，可以让你创建证书、吊销证书。

1. 颁发证书：

1) CA要给别人颁发证书，首先要有一个作为根证书。配置文件在mac下的路径为System/Library/OpenSSL/openssl.cnf

2) 生成根密钥：
```shell
openssl genrsa -out cakey.pem 2048
```
3) 生成根证书：
```shell
openssl req -new -x509 -key cakey.pem -out cacert.pem
```
4）为nginx web服务器生成ssl密钥：
```shell
openssl genrsa -out nginx.key 2048
```
5）为nginx生成证书签署请求：
```shell
openssl req -new -key nginx.key -out nginx.csr
```
会提示输入一些内容，common Name一定要输入要属于证书的服务器域名或主机号。即输入域名：st.example.com，challenge password不填即可。

6) 私有CA根据请求来签署证书：
```shell
openssl ca -in nginx.csr -out nginxcrt //同下面一样的效果：默认使用了-cert cacert.pem -keyfile cakey.pem
openssl x509 -req -in nginx.csr -CA cacert.pem -CAkey cakey.pem -CAcreateserial -out nginx.crt
```
即可以通过根密钥（cakey.pem）、根证书（cacert.pem）、证书签署请求（nginx.csr）来生成nginx需要的证书（nginx.crt）。
但是此处生成的证书在nginx配置好后，浏览器访问https请求时，有可能有问题（sha1密钥的等级过低）
因为，上面的命令没有指定生成证书的签名算法，就使用了默认的sha1算法，所以，改成通过SHA-256来作为签名算法生成nginx.crt，即可解决这个问题。
```shell
openssl x509 -sha256 -req -in nginx.csr -CA cacert.pem -CAKey cakey.pem -CAcreateserial -out nginx.crt
```

2. 使用证书

1) nginx配置支持https，使用刚刚生成的证书

    listen 443 ssl;
    ssl_certificate /opt/meituan/apps/meituan.movie.maoyan.proxy/HTTPS/st.example.com.crt // 证书
    ssl_certificate_key /opt/meituan/apps/meituan.movie.maoyan.proxy/HTTPS/st.example.com.key // 密钥

2) 将需要访问此域名（st.example.com）的https请求的地方（PC或手机），都要导入上面步骤3生成的根证书（cacert.pem）

#### OpenSSL与SSL数字证书概念介绍：

SSL是客户端和服务器之间建立一条SSL安全通道的安全协议，而OpenSSL是TLS/SSL协议的开源实现，提供开发库和命令行程序。HTTPS是HTTP的加密版，底层使用的加密协议是SSL。

PKI就是 Public Key Infrastructure 的缩写，翻译过来就是公开密钥基础设施。它是利用公开密钥技术所构建的，解决网络安全问题的，普遍适用的一种基础设施; 是一种遵循既定标准的密钥管理平台,它能够为所有网络应用提供加密和数字签名等密码服务及所必需的密钥和证书管理体系。

PKI是一个标准，在这个标准之下发展出的为了实现安全基础服务目的的技术统称为PKI。可以说CA（认证中心）是PKI的核心，而数字证书使PKI的最基本元素。

CA：
为保证用户之间在网上传递信息的安全性、真实性、可靠性、完整性和不可抵赖性

CA机构，又称为证书认证中心，是一个负责发放和管理数字证书的第三方权威机构，它负责管理PKI结构下的所有用户的证书，把用户的公钥和用户的其他信息捆绑在一起，在网上验证用户的身份。CA机构的数字签名使得攻击者不能伪造和篡改证书。

1. 证书的颁发：接收、验证用户(包括下级认证中心和最终用户)的数字证书的申请。可以受理或拒绝
2. 证书的更新：认证中心可以定期更新所有用户的证书，或者根据用户的请求来更新用户的证书
3. 证书的查询：查询当前用户证书申请处理过程；查询用户证书的颁发信息，这类查询由目录服务器ldap来完成
4. 证书的作废：由于用户私钥泄密等原因，需要向认证中心提出证书作废的请求；证书已经过了有效期，认证中心自动将该证书作废。认证中心通过维护证书作废列表 (Certificate Revocation List,CRL) 来完成上述功能。


#### 扩展一些nginx配置基础

nginx依赖Host决定访问是什么主机
proxy_pass
    默认情况, 使用proxy_pass中写的host, 如proxy_pass http://st.example.com;
    如果上下文存在 proxy_set_header Host xxxx; 则使用 xxx 作为域名;
    上下文最近优先, proxy_set_header可以被使用在全局, server, location

#### 参考文档

http://seanlook.com/2015/01/15/openssl-certificate-encryption/

