---
layout: post
category: "android"
title:  "git分支开发、合并、删除等主要命令"
tags: [git]
---
####1、克隆远程版本库。
git clone git@github.com:youth168/test.git  
输入密码:git，等待完成。  
cd ./test

####2、建立本地分支进行开发
git checkout -b dev-branch master‘ 子分支时为git checkout -b dev-branch origin/develop  
经过对本地dev-branch开发后...  
git add .  
git commit -am "feature adding and bugs fixing"

####3、合并本地分支(dev-branch)到master分支
git checkout master  
git merge dev-branch  
git push origin master‘推送到远程  
或者在dev-branch分支下执行：  
git push origin dev-branch:master 'git push orign HEAD:new_branch  

再次对dev-branch开发：  
git checkout dev-branch  
再重复第上述过程...

####4、分支删除
git branch -d dev-branch ’不再基于dev-branch开发了，删除之  
git push origin --delete dev-branch ’删除远程分支

####5、设置Tag(快照)
git tag v1.0 '新建本地tag  
git tag -d v1.0 '删除本地tag  
git push --tag 'push本地tag到远程  
git push origin --delete tag v1.0 '删除远程tag  

（完~）
