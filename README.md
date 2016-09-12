# onmouseWheel
//自定义滚动;<br>
//使用方法<br>
//在页面引入mouseWheel.js<br>
var gund = new mouseWheel("demo",{<br>
  color:['pink','green'], //设置滚动条的颜色<br>
  speed:1,                //以及滚动的速度<br>
  width:'15px'           // 滚动条的宽度<br>
})<br>
var gund1 = new mouseWheel("demo1",{<br>
  color:['#cdcdd6','#616361'],<br>
  speed:1,<br>
  width:'5px'<br>
})<br>
/*<br>
   说明：<br>
   1、new mouseWheel(element,obj) 其中element为需要设置滚动的盒子元素，其内部只能有一个子元素需要滚动的，当子元素的高度<br>
   没有超过父元素时不会出现滚动，如图第一个盒子；<br>
   2、传递的参数obj可以设置滚动的颜色，宽度，滚动的速度；<br>
   3、当长按滚动长条时会进行匀速的滚动，单击时会跳跃过去；<br>
   4、点击滑块时可以进行拖拽滚动；<br>
*/
