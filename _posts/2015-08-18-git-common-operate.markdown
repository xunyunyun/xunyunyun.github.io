---
layout: post
category: "git"
title:  "git常用操作"
tags: ["git"]
---

常用操作

1、上传远端服务器过程

(1) ```git add .```

(2) ```git commit -m``` "提交代码信息" 

//如果本地的版本删除了部分内容的话，必须加上-a，不然后面的推送操作不能将远端内容也删除。

```git commit -m -a "delete data sym"```

(3) ```git push -u origin master``` //提交主分支,-u可加可不加，第一次使用必须加，之后可以不再添加。

//如果没有clone现有的仓库，并欲将自己的仓库链接到摸个远程服务器

```git remote add origin <server>```

2、分支

```git checkout``` //检查现有的分支

```git checkout -b xunyunyun``` //创建名为xunyunyun的分支，并切换过去

```git checkout master```  //切换到master分支上去

```git branch -d xunyunyun``` //删除xunyunyun分支

```git push origin xunyunyun ```//将分支xunyunyun推送到远端仓库

3.更新和合并

```git pull ``` //要更新你的本地仓库至最新改动

```git merge <branch>```  //合并其他分支<branch>到你的当前分支

//在这两种情况下，git都会尝试去自动合并改动。遗憾的是，这可能并非每次都成功，并可能出现冲突（conflict）。这个时候就需要修改这些文件来手动合并这些冲突（conflict）。改完后，执行如下命令以将他们标记为合并成功：

```git add <filename>```

```git diff <source_branch> <target_branch>``` //预览差异

4.标签

//为软件发布创建哎标签是推荐的。

```git tag 1.0.0 21312432``` //创建一个叫做1.0.0的标签

```git log ```//获取提交ID

5.替换本地改动

```git checkout --<filename>```  //换掉本地改动

此命令会使用HEAD中的最新内容替换掉你的工作目录中的文件。已添加到暂存区的改动以及新文件都不会受到影响。

上面提到的HEAD中的内容，为上一次git commit提交的内容，如果后面没有执行git push的话，并不是远端仓库中的内容。

如果想丢弃本地的所有改动与提交，可以到服务器上获取最新的版本历史，并将本地主分支指向他

```git fetch origin```

```git reset --hard origin/master```

####git规范：

1.一次commit提交一件事

2.Message要写清楚

3.本地多commit，有功能完成要push

4.要谨慎处理冲突文件

---

为了更好的理解git分支在项目协作中的作用，引入git的工作机制如下：

![git workplace]({{"/img/git_workplace.png" | prepend:site.baseurl}})
