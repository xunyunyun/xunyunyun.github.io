---
layout: post
category: "net"
title:  "SSH学习"
tags: ["ssh", "net"]
---

#### SSH原理及应用

SSH是一种网络协议，用于计算机之间的加密登陆。

SSH主要用于远程登录。

SSH (secure Shell)是一项创建在应用层和传输层基础上的安全协议，为计算机上的shell提供安全的传输和使用环境。也是专为远程登录会话和其他网络服务提供安全性的协议。它能够有效防止远程管理过程中的信息泄露问题。通过SSH可以对所有传输的数据进行加密，也能够防止DNS欺骗和IP欺骗。 
```shell
ssh user@host #以用户名user，登陆远程主机host。
ssh host #当本地用户名和远程用户名相同时
```
ssh的默认端口是22，也就是说，登陆请求会发送远程主机的22端口，使用p参数，可以修改这个端口。
```shell
ssh -p 2222 user@host
```

#### 口令登录

当远程主机的公钥被接受以后，它会被保存在文件$HOME/.ssh/known_hosts之中(mac下在~/.ssh/known_hosts)。下次在连接这台主机，系统就会认出他的公钥已经保存在本地了，从而跳过警告部分，直接输入密码。

每个SSH用户都有自己的known_hosts文件，此外系统也有一个这样的文件，通常是/etc/ssh/ssh_known_hosts，保存一些对所有用户都可信赖的远程主机的公钥。

#### 公钥登陆

问题：使用密码登陆，每次都必须输入密码，非常麻烦。SSH还提供了公钥登陆，可以省去输入密码的步骤。

解决：公钥登陆，就是用户将自己的公钥存储在远程主机上。登陆时，远程主机会向用户发送一段随机字符串，用户用自己的私钥加密后，再发回去。远程主机用事先存储的公钥进行解密，如果成功，就证明用户是可信的，直接允许登陆shell，不再要求密码。

这种方法要求用户必须提供自己的公钥。如果没有现成的，可以直接使用ssh-keygen生成一个。
$ ssh-keygen
运行结束以后，在$HOME/.ssh/目录下，会新生成两个文件：id_rsa.pub和id_rsa。前者是公钥，后者是私钥。

$ssh-copy-id user@host 将公钥传到远程主机host上面，这样就不需要等输入密码了。

#### authorized_keys文件

远程主机将用户的公钥，保存在登陆后的用户主目录的$HOME/.ssh/authorized_keys文件中。公钥就是一段字符串，只要追加到authorized_keys文件的末尾就可以了。
这里不使用上面的ssh-copy-id命令，改用上面的命令，解释公钥的保存过程：

$ ssh user@host 'mkdire -p .ssh && cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub

这条命令由多个语句组成，依次分解开来看：
（1）"$ ssh user@host"，表示登录远程主机；
（2）单引号中的mkdir .ssh && cat >> .ssh/authorized_keys，表示登录后在远程shell上执行的命令：
（3）"$ mkdir -p .ssh"的作用是，如果用户主目录中的.ssh目录不存在，就创建一个；
（4）'cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub的作用是，将本地的公钥文件~/.ssh/id_rsa.pub，重定向追加到远程文件authorized_keys的末尾。

#### SSH使用技巧
~/.ssh/config文件的配置你可以大大简化SSH相关的操作。
```shell
Host example #关键词
    HostName example.com #主机地址
    User root #用户名
    #IdentityFile ~/.ssh/id_ecdsa #认证文件
    #Port 22  #指定端口
```
通过执行ssh example 就可以登录我的服务器。而不需要更多的命令$ ssh root@example.com。又如我们想要向服务器传文件$ scp a.txt example:/home/user_name。比以前方便多了。

更过相关帮助文档请参考$ man ssh_config 5。

##### 配置项说明
SSH的配置文件有两个：
~/.ssh/config #用户配置文件
/etc/ssh/ssh_config  #系统配置文件

Host 用于我们执行SSH命令时如果匹配到该配置
    * 匹配所有主机名
    *.example 匹配以 .example.com 结尾。
    !*.dialup.example.com,*.example.com 以 ! 开头是排除的意思。
    192.168.0.? 匹配 192.168.0.[0-9] 的 IP。


##### 参考文档
https://deepzz.com/post/how-to-setup-ssh-config.html

