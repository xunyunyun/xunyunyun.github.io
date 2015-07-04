---
layout: post
category: "android"
title: "Cocos JS 布局及控件相关"
tags: ["cocos2d-js"]
---
####Node显示设置：  

    node.setVisible(true);
    node.setVisible(false);


####渐变背景：  

    var backgroundStartColor = cc.color(27, 23, 21); 
    var backgroundEndColor = cc.color(21, 17, 15);
    
    var  layerGradient = new cc.LayerGradient(); 
    layerGradient.setStartColor(backgroundStartColor);  //起始色
    layerGradient.setEndColor(backgroundEndColor); //结束色
    layerGradient.setVector(cc.p(0,-1)); // 渐变方向
    layerGradient.setContentSize(cc.size(winSize.width, winSize.height));    // Layer大小


####框背景（按钮/选中效果）：  

    var bgFocus = cc.DrawNode.create();
    bgFocus .drawRect(cc.p(0, 0),
                cc.p(260, 86),
                cc.color(220, 67, 0, 255),
                0,
                cc.color(220, 67, 0, 255));
    bgFocus .setAnchorPoint(cc.p(0, 0));
    bgFocus .setPosition(cc.p(0, 6));


####LabelTTF文字标签：  

    var fontColor = cc.color(255, 255, 255, 102);
    var fontSize = 32;
    var fontName ="res/font/newfont.ttf";
    var fontText="hello world";
    
    var myLabel =  new cc.LabelTTF();
    myLabel .setFontSize(fontSize );
    myLabel .setString(fontText);
    myLabel.setFontName(fontName);//cc.LabelTTF(text, fontName, fontSize);
    myLabel .setAnchorPoint(1,0);
    myLabel .setColor(fontColor );
    myLabel .setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);//对齐
    myLabel.setOpacity(120);//透明度
    myLabel .x=0;
    myLabel .y=1;//myLabel.setPosition(0,1);


####TableView操作：  

    var = new Array("NO.1", "NO.2", "NO.3", "NO.4");
    var  listView = cc.TableView.create(this, cc.size(ITEM_WIDTH,ITEM_HEIGHT*LIST_VISIBLE_ITEM_COUNT));
    listView .setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
    listView .setPosition(0, 0);
    listView .setDelegate(this);
    listView .setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
    var offset = this.mList.getContentOffset();
    
    tableCellAtIndex: function (table, idx) {
        //init cell
    }
    
    numberOfCellsInTableView: function (table) {
        return count;
    }


####ccui.Layout用作布局，也可以用cc.Node：  

    var list = new ccui.Layout(); 
    list.setContentSize(800，480);
    list.setClippingEnabled(true);
    list.setPosition(0,76);
    list.setAnchorPoint(0,0);
    this.addChild(list);
    
    list.addChild(xxx);
    list.addChild(yyy);


####cc.director主要方法：  

    cc.director.getWinsize();
    cc.director.runScene(scene);//运行新场景，取代原有scene
    
    cc.director.pushScene(scene);//运行新场景，盖住上一个scene
    cc.director.popScene(scene);//弹出stack最上一个scene


####事件：  

    cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                }.bind(this),
                onKeyReleased: function (key, event) {
    
                }.bind(this)
    }, this);


####调用java:  

    jsb.reflection.callStaticMethod(className, methodName, signature, param1,parm2);



####JS文件加载：  

    var jsList = [
        "src/A.js",
        "src/B.js",
    ];
    
    function load()
     {
         for( var i=0; i < jsList.length; i++) {
                    require( jsList[i] );
           }
    }
