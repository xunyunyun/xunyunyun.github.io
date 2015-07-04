---
layout: post
category: "git"
title: "Git的Merge和Rebase"
tags: ["git"]
---
####一、特定分支下Rebase
    git branch//确认在master分支下  
    *master  
    git pull  
    git rebase  
    git add -u//遇到冲突，要解决，再执行...  
    git rebase --continue  
    ...
    over when arrive "master"//到master为止  

参考：http://www.cnblogs.com/sinojelly/archive/2011/08/07/2130172.html  

####二、把B库merge到A库来
    git clone git@git.abc.com:user/space/A.git //准备A库代码  
    cd A  
    git branch //确保在master分支下  
    *master  
    
    git remote add B git@git.abc.com:user/space/B.git //设置B库  
    git fetch B  
    
    git diff B/master //查看diff  
    
    git fetch origin //更新A  
    git merge origin/master (master = git pull)  
    
    git merge B/master  //merge B to A  
    git mergetool //有冲突解决掉  
    git commit  //测试OK再commit  
    git push origin master //Push合并更新到A库远端  

####三、其它可能用到的命令
    git clean -i: clean untracked files  
    git remote //show branches  
    git remote -v //show branches details  
    git remote show B //show B info  
    git reset --hard //rest to latest commit status
    git stash //save eidit status, back to latest commit status

（完~）
