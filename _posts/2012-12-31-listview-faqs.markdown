---
layout: post
category: "android"
title:  "ListView与条目显示相关问题解决"
tags: [Android,ListView]
---
1.对一般布局如(LinearLayout)设置selector后,点击没有选中的效果，可设置其android:clickable="true" 即可。

2.对item_layout.xml设置selector后点击效果无效反而为系统效果时。可能是selector中颜色值使用了透明度，这是不行的，不能直接用带透明度的颜色。也可以把item_layout.xml中的selector换到ListView设置listSelector中去。

3.item_layout设置了高度却不起作用，那就让高度wrap_content，添加minHeight="50dp"这样的设置吧。

4.item_layout中若有Button或CheckBox之类的控件，设置selector是不起作用的，需对Button或CheckBox设置android:focusable="false"才行。

5.关于更改已有ListView中的某条目显示时，需要通过更改ListView Adapter所使用的原始list数据，再调用Adapter的notifyDatesetChanged来刷新界面才行，当然Adapter的getView操作要能重新适配数据才行。

6.ListView设置了divider及dividerHeight，但当数据不够一页时最下一条无下划线，可设置ListView为     android:layout_height="fill_parent"即可。

7.GridView如果不设置listSelector则在某些手机上，其四周会出现边框。
