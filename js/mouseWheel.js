/*
  创建于：2016-09-12
  作者：JasonCloud
*/
 var mouseWheel = (function(w){
        /*工具类*/
        Tool = {
          Event:{
            "addEvent":addEvent,
            "removeEvent":removeEvent,
            "eventObj":eventObj,
            "preventDefault":preventDefault,
            "stopPropagation":stopPropagation,
            "getTarget":getTarget
          },
          DomControl:{
            "getElement":getElement,
            "getClass":getClass
          }
        }
            //事件继承
    function bindFunction(obj,fn,data){
      return function(){
        fn['fn'] = arguments.callee;
        fn.apply(obj,[arguments,data]);
      }
    }

     function addEvent(element,type,fn,data,_this){
          _this = _this ? _this : element;
          if(element.addEventListener){
            element.addEventListener(type,bindFunction(_this,fn,data),false);
          }else if(element.attachEvent){
            element.attachEvent('on'+type,fn);
          }else{
            element['on'+type] = fn;
          }
        }
      function removeEvent(element,type,fn){
          if(element.removeEventListener){
            element.removeEventListener(type,fn['fn'],false);
          }else if(element.attachEvent){
            element.detachEvent('on'+type,fn['fn']);
          }else{
            element['on'+type] = null;
          }
        }

        function eventObj(e){
          return e||window.event;
        }
        function preventDefault(e){
          var ev = Tool.Event.eventObj(e)[0];
          if(ev.preventDefault){
            ev.preventDefault();
          }else if(ev.returnValue){
            ev.returnValue = false;
          }
        }
       function stopPropagation(e){
        var ev = Tool.Event.eventObj(e)[0];
        if(ev.stopPropagation){
          ev.stopPropagation();
        }else if(ev.cancelBubble){
          ev.cancelBubble = true;
        }
       }
       function getTarget(e){
        var ev = Tool.Event.eventObj(e);
        if(ev.target){
          return ev.target;
        }else if(ev.srcElement){
          return ev.srcElement;
        }       
       }

       function getClass(className){
        var tem = [];
        if(document.querySelectorAll){
          var all = document.querySelectorAll('.'+className);
          for(var i=0;i<all.length;i++){
            tem.push(all[i])
          }
        }else{
          var all=document.getElementsByTagName('*');
           for(var i=0;i<all.length;i++){
                   if((new RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[i].className)){
                      temps.push(all[i]);
                 }
                } 
        }
        
        return tem;        
       }
       //判断浏览器是否为FF；
       function isFirefox(){
           var nav = navigator.userAgent;
           if(nav.indexOf("Firefox")>-1){
            return true;
          }else{
            return false;
          } 
       }

      
      
       function getElement(str){
          if(typeof str !="string") return false;
          var element =[];
          if(/^[#|\.]/.test(str)){
            var firsStr = str[0];
            switch(firsStr){
              case '#':
              element.push(document.getElementById(str.substr(1)));
              break;
              case '.':
              element = Tool.DomControl.getClass(str.substr(1));
              break;
              default:
              break
            }
          }else{
             var strId = document.getElementById(str);
             if(strId){
              element.push(strId);
             }
             var strClass = Tool.DomControl.getClass(str);
             for(var i=0;i<strClass.length;i++){
                element.push(strClass[i]);
             }
          }
          return element;
       }

       function getstyle(element,attr){
        return (element.currentStyle? element.currentStyle : window.getComputedStyle(element, null))[attr];
       }

       var main = function(strWheelElement,data){
          var elements = Tool.DomControl.getElement(strWheelElement);
             this.color = data.color ? data.color : ["#eee","#ccc"];
             this.speed = (data.speed&&data.speed>0) ? data.speed : 1;
             this.width = data.width?data.width:'20px';
          var mousewheel = isFirefox() ? "DOMMouseScroll" : "mousewheel"; 
          if(elements.length === 0)return false;
          for(var i=0;i<elements.length;i++){
            elements[i].onselectstart=function(){return false;}
           if(getstyle(elements[i],'position') == 'static'){elements[i].style.position = "relative"}
            elements[i].style.overflow = "hidden";
            var child = elements[i].children[0];
            child.style.position = "absolute";
            child.style.top = 0;
            child.style.left = 0;
            var h = elements[i].offsetHeight,H = child.offsetHeight;
            var bfb = h/H;
            if(bfb>=1)continue;
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = 0;
            div.style.right = 0;
            div.style.width = this.width;
            div.style.height ="100%";
            div.style.cursor = "pointer";
            div.style.backgroundColor = this.color[0];
            
            var span = document.createElement('span');
            span.style.position = "absolute";
            span.style.backgroundColor = this.color[1];
            span.style.width = "100%";
            span.style.height = h*h/H+'px';
            span.style.cursor = "pointer";
            div.appendChild(span);
            elements[i].appendChild(div);
            Tool.Event.addEvent(span,'mousedown',mousedownfn,{'H':H,'h':h,"bfb":bfb});
            Tool.Event.addEvent(elements[i],mousewheel,mousewheelfn,{'H':H,'h':h,"bfb":bfb,'speed':this.speed,'elementspan':span});
            Tool.Event.addEvent(div,'mousedown',longmousefn,{'H':H,'h':h,"bfb":bfb,'speed':this.speed,'elementspan':span,'elementchild':child})
          }
       }

       //移动
       function move(element,elebox,start,end,type,data,speed){
        var h = data.h,H = data.H,bfb = data.bfb;
         if(!!type){
          element.style.top = end +'px';
          elebox.style.top = -(H-h)*(element.offsetTop/(h-bfb*h))+'px';
          return false;
         }
         var speed = speed?speed:1;
             speed = end>start ? speed :-speed;
         element.timer = setInterval(function(){
                  element.style.top = (start+=speed) +'px';
                  elebox.style.top = -(H-h)*(element.offsetTop/(h-bfb*h))+'px'
                  if(Math.abs(end-start)<1.5){
                    clearInterval(element.timer);
                     element.style.top = end +'px';
                     elebox.style.top = -(H-h)*(element.offsetTop/(h-bfb*h))+'px';
                  } 
          },30)

       }
      //长按和短按的滚动
      function longmousefn(e,data){
            var ev = Tool.Event.eventObj(e)[0];
            var _this = this;
            var cY = ev.clientY;
            data.zt = false;//如果是长按就设置为true，就不会再执行短按的函数
            var parentNode = data.elementspan.parentNode.parentNode;
            var parentTop = parentNode.offsetTop,height = data.elementspan.offsetHeight,top = data.elementspan.offsetTop;
            if(cY>(parentTop+height+top)){
              var end = cY-parentTop-height;
            }else{
               var end = cY-parentTop;
            }
            data.end = end;
            data.start = top;
            var timer = setTimeout(function(){
               move(data.elementspan,data.elementchild,data.start,end,false,data,data.speed);
               data.zt = true;
            },500);
            data.timer = timer;
            data.end = end;
            data.start = top;
            Tool.Event.addEvent(_this,'mouseup',mouseupdiv,data);
      }
      //鼠标弹起
      function mouseupdiv(e,data){
        Tool.Event.stopPropagation(e);
        clearTimeout(data.timer);
        clearInterval(data.elementspan.timer);
        if(!data.zt)move(data.elementspan,data.elementchild,data.start,data.end,true,data);
        Tool.Event.removeEvent(this,'mouseup',mouseupdiv);
      }
      function mousewheelfn(e,data){
           var ev = Tool.Event.eventObj(e)[0];
           var wheelDelta = ev.wheelDelta ? ev.wheelDelta : ev.detail;
           var speed = 0,topH = data.elementspan.offsetTop,H = data.H,bfb = data.bfb,h = data.h;
           wheelDelta = isFirefox() ? -wheelDelta :wheelDelta;
           Tool.Event.preventDefault(e);
          if(wheelDelta<0){
          speed = data.speed;
          if(topH>=(h-bfb*h)){
           data.elementspan.style.top = (h-bfb*h) +'px';
           this.children[0].style.top = -(H-h)+'px';
           return ;
            }
         }else{
          speed = -data.speed;
         if(topH<=0){
           data.elementspan.style.top = 0 +'px';
           this.children[0].style.top = 0+'px';
           return ;
            }
         }

         topH = (topH+speed);
        data.elementspan.style.top = topH+'px';
        this.children[0].style.top = -(H-h)*(topH/(h-bfb*h))+'px';

      }

       function mousedownfn(e,data){
            var ev = Tool.Event.eventObj(e)[0];
            Tool.Event.stopPropagation(e);//阻止事件冒泡
            var _this = this;
            var parentNode = _this.parentNode.parentNode;
            var chaz = ev.clientY-parentNode.offsetTop-_this.offsetTop;
            var chz_x = _this.offsetHeight-chaz;
            Tool.Event.addEvent(parentNode,'mousemove',mousemovefn,{'chaz':chaz,'chz_x':chz_x,'spanthis':_this,'H':data.H,'h':data.h,"bfb":data.bfb});
            Tool.Event.addEvent(document,'mouseup',mouseupfn,{'parentdiv':parentNode});
       }
       function mouseupfn(e,data){
        Tool.Event.removeEvent(this,'mouseup',mouseupfn);
        Tool.Event.removeEvent(data.parentdiv,'mousemove',mousemovefn);
       }
      function mousemovefn(e,data){
         var ev = Tool.Event.eventObj(e)[0];
         var _this = this;
         var topH = data.spanthis.offsetTop;
         var spanParent = _this.children[0];
         var H = data.H,h = data.h,bfb = data.bfb;
          if(ev.clientY-_this.offsetTop>(_this.offsetHeight-data.chz_x)){
                 data.spanthis.style.top = (h-bfb*h) +'px';
                 spanParent.style.top = -(H-h)+'px';
                 return ;
          }else if(ev.clientY-_this.offsetTop-data.chaz<0){
                    data.spanthis.style.top = 0 +'px';
                    spanParent.style.top = 0+'px';
                    return ;
          }
                    data.spanthis.style.top = ev.clientY-_this.offsetTop-data.chaz+'px';
                    spanParent.style.top = -(H-h)*(topH/(h-bfb*h))+'px';
       }
       return main;
      })(window);