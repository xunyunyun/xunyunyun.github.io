---
layout: post
category: "linux"
title:  "linux基本操作"
tags: ["linux"]
---

#### linux命令

##### 文件目录
```shell
mkdir -p foo/bar #创建目录
mv -f foo bar #移动文件/目录
cp -rf foo bar #复制文件/目录
rm -rf bar #删除文件
locate foo #快速查找文件（在mac下不可用！）
# 这个数据库中含有本地所有文件信息。Linux系统自动创建这个数据库，并且每天自动更新一次，所以使用locate命令查不到最新变动过的文件。
open . #用Finder打开当前目录
```

##### 权限

```shell
chmod -R ugo+rwx foo/bar #增加文件权限 u: user, g: group, o:other
chmod -R ugo-rwx #移除权限
chown -R user:group foo/bar #修改所属用户或组
sudo command #以root用户执行command
sudo -s #进入root的命令行，即后续命令默认自动以root用户执行
```

##### 进程

进程类建议sudo执行
```shell
top -o cpu #以CPU占用倒叙定时刷新进程列表
ps aux #查看进程列表
./app #运行当前目录下的app程序
kill -9 7890 #强行终止id为7890的进程
```
##### 网络

网络类建议sudo运行
```shell
ping 123.45.67.89 #发送ping数据包，检测网络
ifconfig #查看本地网络信息
netstat -anp tcp #查看tcp连接
lsof -Pni tcp #查看tcp连接及对应进程和pid
```

##### 组合命令

```shell
lsof -Pni tcp | grep 8080 #管道
cat foo.md | less #输出
ps aux > ps.txt #输出重定向
```

##### ssh基础和配置

安全Shell
非对称加密：密钥对 = 私钥（含公钥）+ 公钥
对称加密：hash,finderprint指纹

```shell
ssh-keygen 产生新的密钥对
ssh-keygen -p -P old_pass -N new_pass -f keyfile 修改私钥密码
ssh-keygen -y -f keyfile > id_rsa.pub 从私钥中抽取出公钥
```

多私钥配置 ~/.ssh/config
    Host github.com
        IdentityFile ~/.ssh/id_rsa_github
    Host git.sankuai.com
        IdentityFile ~/.ssh/id_rsa_sankuai

了解更多ssh, 查看下一节[ssh学习](http://xunyunyun.github.io/javascript/net-ssh-study.html)

##### 环境变量

```shell
env #查看所有环境变量
echo $PATH #查看环境变量
export NVM_PATH=/lib/node #设置环境变量
```

永久设置

    /etc/profile
        /etc/bashrc
    bash
        login shell: ~/.bash_profile, ~/.bash_login
        interactive: /.bashrc

环境变量
zsh
    /etc/zshenv, ~/.zshenv
    login shell: /etc/zprofile, ~/.zprofile 
    interactive: /etc/zshrc, ~/.zshrc
    login shell: /etc/zlogin, ~/.zlogin

##### 编辑器
nano
vi vim emacs
man, less

vi vim man less等交互式程序的通用操作
j k 上下滚动
space f b 下forward 上backward翻页 
/ 开始搜索，输入待搜索文本
n N 向下next上搜索
q :q 退出quit
g gg G 回到go头begin尾


##### crontab命令
这个命令可用来在特定时间（服务器某个空闲时间段）对服务器进行压测

通过crontab命令，我们可以在固定的间隔时间执行指定的系统指令或shell script脚本。时间间隔的单位是分钟、小时、日、月、周及以上的任意组合。
这个命令非常适合周期性的日志分析或数据备份等工作。

```shell
crontab [-u user] file 
crontab [-u user] [-e|-I|-r]
```

-u user：用来设定某个用户的crontab服务；
file：file是命令文件的名字,表示将file做为crontab的任务列表文件并载入crontab。如果在命令行中没有指定这个文件，crontab命令将接受标准输入（键盘）上键入的命令，并将它们载入crontab。
-e：编辑某个用户的crontab文件内容。如果不指定用户，则表示编辑当前用户的crontab文件。
-l：显示某个用户的crontab文件内容，如果不指定用户，则表示显示当前用户的crontab文件内容。
-r：从/var/spool/cron目录中删除某个用户的crontab文件，如果不指定用户，则默认删除当前用户的crontab文件。
-i：在删除用户的crontab文件时给确认提示。

crontab的文件格式
分 时 日 月 星期 要运行的命令
0-59 0-23 1-31 1-12 0-7（0和7表示星期天） 

#### shell脚本学习

判断符号，在if语句中经常使用

[-z $(name)]: 中的-z代表是否存在这个变量
[-n $(name)]: 代表这个变量是否为数值

-d：判断指定的是否为目录 
-z：判断指定的变量是否存在值
-f：判断指定的是否为文件
-L：判断指定的是否为符号链接
-r：判断指定的是否为可读
-w：判断指定的是否为可写
-s：判断存在的对象长度是否为0
-x：判断存在的对象是否可执行
! ：测试条件的否定符号

test n1 -eq n2
-eq 相等
-ne 不等
-gt 大于
-lt 小于
-ge 大于等于
-le 小于等于

