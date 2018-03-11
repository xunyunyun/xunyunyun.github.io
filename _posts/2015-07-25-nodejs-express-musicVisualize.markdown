---
layout: post
category: "express"
title:  "音乐可视化"
tags: ["nodejs", "express","visualize","canvas"]
---

#### 知识点概括

1.服务器端：Node+Express+ejs

2.前端界面：HTML+CSS+JS

3.音频操作：webAudio

4.音频数据可视化：Canvas

5.尝试实现节奏大师

#### 环境配置

安装express

```$npm install -g express-generator```

1.创建express环境下的文件夹music

```$express -e music ``` 

2.转到musi文件夹下

```$cd music```

```$npm install```

3.安装supervisor

```$npm install -g supervisor```

4.supervisor可监控程序实时变化

```$supervisor bin/www```

默认端口为3000端口，可通过localhost:3000来访问。

#### webAudio

1.AudioContext对象：

为audio上下文对象，一个document只有一个AudioContext创建：

```var ac = new window.AudioConetxt()```

属性有：

a.destination，为AudioDestinationNode对象，所有的音频输出聚集地，相当于音频的硬件，所有的AudioNode都直接或间接连接到这里

b.currentTime:AudioContext从创建开始到当前的时间（秒）

方法有：

a.decodeAudioData(arrayBuffer,succ(buffer),err)：异步解码包含在arrayBuffer中的音频数据

b.createBufferSource()：创建audioBufferSourceNode对象

c.createAnalyser()创建AnalyserNode对象

d.createGain()/createGainNode()创建GainNode对象

2.AudioBufferSourceNode对象

内存中的一段音频资源，其音频数据存于AudioBuffer中

创建方法：

var bufferSource = ac.createBufferSource();

属性：

a.buffer:AudioBuffer对象。表示要播放的音频资源，有子属性：duration：音频时长

b.loop：是否循环播放

c.onended：可绑定音频播放完毕时绑定事件处理程序

方法：

a.start/noteOn(when = ac.currentTime,offset = 0,duration = buffer,duration-offset)

开始

b.stop/noteOff(when = ac.currentTime)

结束

改变音量大小的属性：GainNode对象下的gain下的volue属性

```GainNode.gain.value = percent;```

3.AnalyserNode音频分析对象

它实时的分析音频资源的时频域信息

```var analyser = ac.createAnalyser();```

fftSize:设置FFT值的大小，用于分析频域

frequencyBinCount:FFT值的一半，即实时得到的音频频域的数据个数

getByteFrequencyData(Uint8Array),复制音频当前的频域数据，到Unit8Array中。

#### canvas实现音乐可视化的程序实现过程

1.封装函数EventUtil

实现了兼容IE和其他浏览器的函数：添加事件删除事件，获取目标事件，阻止冒泡和默认事件等。以方便使用。

2.实现音频文件的请求和下载

{% highlight javascript %}
var xhr = new XMLHttpRequest();//创建XMLHttpRequest对象
xhr.abort();//终止可能存在的ajax请求
xhr.open("GET",url);
xhr.responseType = "arraybuffer";//数据类型为arraybuffer
xhr.onload = function(){
    ac.decodeAudioData(xhr.response,function(bufffer){
        var bufferSource = ac.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(that.analyser);
        bufferSouce[bufferSource.start?"start":"noteOn"](0);
        that.source = bufferSource;
    },function(err){
        console.log(err);
    });
}
xhr.send();
{% endhighlight %}

3.动画使用了Javascript 的API：requestAnimationFrame(function) 实现可视化

{% highlight javascript %}
_visializer:function(){
        var that = this;
        var arr = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(arr);
        requestAnimationFrame = window.requestAnimationFrame || 
                                window.webkitrequestAnimationFrame ||
                                window.mozrequestAnimationFrame;
        function v() {
            that.analyser.getByteFrequencyData(arr);
            that._draw(arr);
            requestAnimationFrame(v);
        }
        requestAnimationFrame(v);
    }
{% endhighlight %}

4.使用canvas实现每一帧的频域信号显示：

{% highlight javascript %}
_draw:function(arr){
        //清空上一帧数据显示的画布
        this.ctx.clearRect(0,0,this.width,this.height);
        // 改变模式
        if(this.draw_type === "dot"){
            // 画点图
            for(var i = 0;i < this.size; i++){
                this.ctx.beginPath();
                var o = this.Dots[i];
                var r = arr[i] / 128 * (this.height > this.width ? this.width : this.height)/20;
                this.ctx.arc( o.x, o.y, r, 0, Math.PI*2, true);
                //填充渐变样式
                var g = this.ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
                g.addColorStop(0, o.color);
                g.addColorStop(1, "#FFF");
                this.ctx.fillStyle = g;
                this.ctx.fill();
                //实现小点的移动效果
                o.x += o.dx;
                o.x = o.x > this.width ? 0 : o.x;
            }
        }else{
            //画条形图
            //对图形的线性渐变填充
            this.ctx.fillStyle = this.line;
            var w = this.width/this.size;
            var cw = w * 0.6;
            cw = cw > 6 ? 6 : cw;
            var capH = cw;
            for(var i = 0;i < this.size; i++){
                var o = this.Dots[i];
                var h = arr[i] / 256 * this.height;
                this.ctx.fillRect(w * i, this.height - h, cw, h);
                this.ctx.fillRect(w * i, this.height - (o.cap + capH), cw, capH);
                o.cap--;
                if(o.cap < 0){
                    o.cap = 0;
                }
                if(h > 0 && o.cap < h + 40){
                    o.cap = (h + 40 > this.height - capH) ? (this.height - capH) : (h + 40);
                }
            }
        }     
    },
{% endhighlight %}

实现效果图如下:

![球状移动显示效果]({{"/img/musicvisualizedot.png" | prepend:site.baseurl}})

![条状显示效果]({{"/img/musicvisualizecolumn.png" | prepend:site.baseurl}})


#### 扩展编写“节奏大师”

##### 设计思路：

1.节奏大师中的节奏按钮是按照什么规律设计的？[根据知乎上的回答](http://www.zhihu.com/question/21626668)，可知节奏按键设计复杂，不能根据用户随机选择歌曲，只能选择节奏大师中已有的歌曲。

自己设计的小程序中考虑的比较简单，直接根据音乐频率的变化设置按键下降的速度，实现节奏控制。

主要实现过程：

1.通过canvas实现节奏大师的游戏场景：

a.首先需要画出赛道近大远小的效果

通过canvas画线来实现：

{% highlight javascript %}
this.ctx.lineWidth = 4;
this.ctx.moveTo(this.width/3,0);
this.ctx.lineTo(0,this.height);
this.ctx.lineTo(this.width/4,this.height);
this.ctx.lineTo(this.width*5/12,0);
this.ctx.lineTo(this.width*6/12,0);
this.ctx.lineTo(this.width*2/4,this.height);
this.ctx.lineTo(this.width*3/4,this.height);
this.ctx.lineTo(this.width*7/12,0);
this.ctx.lineTo(this.width*8/12,0);
this.ctx.lineTo(this.width*4/4,this.height);
this.ctx.stroke();
{% endhighlight %}

b.对于每一个按键来说，下降过程也是一个在各自的赛道上逐渐变大的过程，下降速度为音频信号的实时频率来控制。

实现如下：

{% highlight javascript %}
for(var i = 0;i < this.size; i++){
    this.ctx.beginPath();
    var o = this.Dots[i];
    var r = arr[i] / 128 * (this.height > this.width ? this.width : this.height)/20;
    var y = o.cap;
    var w = 1/6 * this.width * (1/2+y/this.height); 
    var x = 0;
    switch(i){
        case 0: x = 1/3*this.width * (1-y/this.height); break;
        case 1: x = this.width/2 - w; break;
        case 2: x = this.width/2; break;
        case 3: x = this.width/2 + w; break;
    }
    this.ctx.fillRect( x, y , w, 20);
    this.ctx.fill();
    o.cap += r/20;  //10
    o.cap = o.cap > this.height ? 0 : o.cap;
    if(o.cap > this.height - 40){
        this.array[i] = 1;
    }else{
        this.array[i] = 0;
    }
}
{% endhighlight %}

由于自己的canvas知识有限，设计出来的效果如下：

![游戏场景]({{"/img/jiezoudashi.png" | prepend:site.baseurl}})

2.通过ASKL四个按键来作为游戏按键，四个按键的捕获事件如下：

{% highlight javascript %}
// 捕获按键过程
EventUtil.addHandler(document,"keydown",function(e){
    var event = EventUtil.getEvent(e);
    switch(event.keyCode){
        case 65://A
            if(that.array[0] === 1){
                that.array_error[0] = 0;
            }
            break;
        case 83://S
            if(that.array[1] === 1){
                that.array_error[1] = 0;
            }
            break;
        case 75://K
            if(that.array[2] === 1){
                that.array_error[2] = 0;
            }
            break;
        case 76://L
            if(that.array[3] === 1){
                that.array_error[3] = 0;
            }
            break;
        default://default
            break;
    }
});
{% endhighlight %}

#### 错误判断

当信号下降到距离底部位置为40px时，这个阶段发生对应的按键事件认为用户音符按键正确，而这个阶段没能发生对应的按键事件为人用户丢失音符按键。当错误数为10次时，游戏结束。


#### 待完善功能

1.当用户捕获音符按键时，应有提示，一些放大或发散的动画效果。当用户丢失音符按键。也应给域动画提示。

2.用户有10次机会，应该在荧幕上显示剩余机会次数，用来提醒用户。

3.赛道和音符键仅为了实现功能，没有考虑美观，学习用canvas怎么设计来实现更好的用户界面。

<p class="sentence">
总结比学习要重要，要善于总结学习中遇到的问题！
</p>



