---
layout: post
category: "android"
title:  "Android 点按钮不让AlertDialog退出方法"
tags: [Android,AlertDialog]
---
在AlertDialog中加入布局后，发现数据验证无论通过与否，点了AlertDialog提供的按钮后总是退出。如何使数据在校验未成功的时候hold住AlertDialog呢？网友提供了一种可行方法：
{% highlight java %}
final Builder dialog = new AlertDialog.Builder(mContext);
...
LayoutInflater inflater = LayoutInflater.from(mContext);
View layout = inflater.inflate(R.layout.tsm_person_info, null);
final EditText nameText = (EditText) layout.findViewById(R.id.editText1);
final EditText cardIdText = (EditText) layout.findViewById(R.id.editText2);
final EditText phoneText = (EditText) layout.findViewById(R.id.editText3);
... 
dialog.setView(layout);
dialog.setNeutralButton("确定", new DialogInterface.OnClickListener() {
  @Override
 public void onClick(DialogInterface dialog, int which) { 
  String name = nameText.getText().toString().trim();
  String idCard = cardIdText.getText().toString().trim();
  String phone = phoneText.getText().toString().trim();
  if (name.equals("") || idCard.equals("") || phone.equals("")) {
  holdDialog(dialog, false); //校验不通过界面保持
  return;
 }
 holdDialog(dialog, true); //allow exit
 }
});
dialog.setNegativeButton("取消", new DialogInterface.OnClickListener() {
 @Override
 public void onClick(DialogInterface dialog, int which) {
  Toast.makeText(mContext, "未进行个人化处理！", Toast.LENGTH_SHORT).show();
  holdDialog(dialog, true);//allow exit
 }
});
/**
 *界面保持开关
* @param dialog
*/
private void holdDialog(DialogInterface dialog, boolean flag) {
 try {
  Field field = dialog.getClass().getSuperclass().getDeclaredField("mShowing");
  field.setAccessible(true);
  field.set(dialog, flag);
 } catch (Exception e) {
  e.printStackTrace();
 }
}
{% endhighlight %}

参考文章：http://gjican.iteye.com/blog/1130538
