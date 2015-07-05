---
layout: post
category: "android"
title:  "消除Animation残余线条"
tags: [Animation,TranslateAnimation]
---
1,继承TranslateAnimation或RotateAnimation，在applyTransformation中刷新动画parentView的界面。如：

{% highlight java %}
private final class MyTranslateAnimation extends TranslateAnimation {
        private View backgroundView;

        public MyTranslateAnimation(View backgroundView, int fromXType, float fromXValue, int toXType, float toXValue,
                int fromYType, float fromYValue, int toYType, float toYValue) {
            super(fromXType, fromXValue, toXType, toXValue, fromYType, fromYValue, toYType, toYValue);
            this.backgroundView = backgroundView;
        }

        @Override
        protected void applyTransformation(float interpolatedTime, Transformation t) {
            super.applyTransformation(interpolatedTime, t);
            backgroundView.postInvalidate();
        }
    }
{% endhighlight %}

2,调用：

{% highlight java %}
TranslateAnimation cardAnimation = new MyTranslateAnimation(backgroundView, Animation.RELATIVE_TO_PARENT, 0.01f,
                Animation.RELATIVE_TO_PARENT, 0.35f, Animation.RELATIVE_TO_PARENT, 0.1f, Animation.RELATIVE_TO_PARENT,
                0.1f);
cardAnimation.setDuration(2000);
cardAnimation.setRepeatCount(Animation.INFINITE);
cardAnimation.setRepeatMode(Animation.REVERSE);
imageView.setAnimation(cardAnimation);
{% endhighlight %}
