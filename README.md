# onmouseWheel
//自定义滚动;
//使用方法
//在页面引入mouseWheel.js<br>
var gund = new mouseWheel("demo",{
  color:['pink','green'], //设置滚动条的颜色
  speed:1,                //以及滚动的速度
  width:'15px'           // 滚动条的宽度
})
var gund1 = new mouseWheel("demo1",{
  color:['#cdcdd6','#616361'],
  speed:1,
  width:'5px'
})
/*
   说明：
   1、new mouseWheel(element,obj) 其中element为需要设置滚动的盒子元素，其内部只能有一个子元素需要滚动的，当子元素的高度
   没有超过父元素时不会出现滚动，如图第一个盒子；
   2、传递的参数obj可以设置滚动的颜色，宽度，滚动的速度；
   3、当长按滚动长条时会进行匀速的滚动，单击时会跳跃过去；
   4、点击滑块时可以进行拖拽滚动；
*/
