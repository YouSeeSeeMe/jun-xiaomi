window.onload=function () {
    var wrap=document.getElementById("wrap");
    var imgPage=document.getElementById('imgPage');
    var backBtn=document.getElementById('backBtn');
    var refresh=document.getElementById('refresh');
    var arrSrc=["img/mi8.png","img/max3.png","img/mix2.png"];
    var isTab=true;
    var oUl=document.getElementById('list');
    var aLi=oUl.getElementsByTagName('li');
    var bigImg=document.getElementById('bigImg');
    var mask=document.getElementById('mask');
    var task=document.getElementById('task');
    var sideBar=document.getElementById('sideBar');
    myScroll({
        el:wrap,
        offBar:false
    });
    refresh.addEventListener('touchend',function () {
        document.location.reload();
    });
    
    oUl.addEventListener('touchmove',function () {
        isTab=false;
    });
    for (var i=0;i<aLi.length;i++){
        aLi[i].index=i;
        aLi[i].addEventListener('touchstart',function () {
            bigImg.src=arrSrc[this.index%3];
        })
    }
    oUl.addEventListener('touchend',function () {
        if (isTab) {

            imgPage.style.display='block';
            MTween({
                el:imgPage,
                time:200,
                target:{scale:100},
                type:"easeOut"
            })
        }
        isTab = true;
    });

    backBtn.addEventListener('touchend',function () {
        MTween({
            el:imgPage,
            time:200,
            target:{scale:0},
            type:"easeOut",
            callBack:function () {
                bigImg.style.transform='';
                imgPage.style.display='none';
            }
        })

    });
    task.addEventListener('touchend',function () {
       MTween({
           el:sideBar,
           target:{translateX:0},
           time:100,
           type:"linear",
           callIn:function () {
               mask.style.display='block';
               MTween({
                   el:mask,
                   target:{opacity:50},
                   time:100,
                   type:'linear'
               })
           }
       })
    })
    mask.addEventListener('touchend',function () {
        MTween({
            el:sideBar,
            target:{translateX:-1000},
            time:100,
            type:"linear",
            callIn:function () {
                MTween({
                    el:mask,
                    target:{opacity:0},
                    time:100,
                    type:'linear',
                    callBack:function () {
                        mask.style.display='none';
                    }
                })
            }
        })
    })

};
function myScroll(init) {
    if (!init.el){
        return;
    }
    document.addEventListener('touchstart',function (ev) {
        ev.preventDefault();
    });
    var wrap=init.el;
    var inner=init.el.children[0];
    var startPoint=0;
    var startEl=0;

    var lastY=0;//上一次位置
    var lastDis=0;//上一次距离
    var lastTime=0;//上一次时间
    var lastTimeDis=0;//时间差
    var maxTranslate=wrap.clientHeight-inner.offsetHeight;

    if (!init.offBar) {
        var scale = wrap.clientHeight / inner.offsetHeight;
        inner.style.minHeight = "100%";
        var scrollBar = document.createElement("div");
        scrollBar.style.cssText = "width:6px;background:rgba(239,50,50,.5);position:absolute;right:0;top:0;border-radius:3px;opacity:0;transition:.3s opacity";
        wrap.appendChild(scrollBar);
    }
    css(inner,'translateZ',0.01);//3D硬件加速
    inner.addEventListener('touchstart',function (e) {
        maxTranslate=wrap.clientHeight-inner.offsetHeight;
        if (!init.offBar) {
            if (maxTranslate >= 0) {
                scrollBar.style.display = 'none';
            } else {
                scrollBar.style.display = 'block';
            }
            scale = wrap.clientHeight / inner.offsetHeight;
            scrollBar.style.height = wrap.clientHeight * scale + 'px';
        }
        clearInterval(inner.timer);
        startPoint=e.changedTouches[0].pageY;
        startEl=css(inner,'translateY');
        lastY=startEl;
        lastTime=new Date().getTime();
        lastTimeDis=lastDis=0;
        (init.offBar)||(scrollBar.style.opacity='1');
    });
    inner.addEventListener('touchmove',function (e) {
        var nowTime=new Date().getTime();
        var nowPoint=e.changedTouches[0].pageY;
        var dis=nowPoint-startPoint;
        var translateY=startEl+dis;
        css(inner,'translateY',translateY);
        (init.offBar)|| css(scrollBar,'translateY',-translateY*scale);


        lastDis=translateY-lastY;
        lastY=translateY;
        lastTimeDis=nowTime-lastTime;
        lastTime=nowTime;
    });
    inner.addEventListener('touchend',function (e) {
        var type='easeOut';
        var speed=Math.round(lastDis/lastTimeDis*10);
        speed=lastTimeDis<=0?0:speed;
        var target=Math.round(speed*30+css(inner,'translateY'));
        if (target>0){
            target=0;
            type='backOut';
        }else if(target<maxTranslate){
            target=maxTranslate;
            type='backOut';
        }
        MTween({
            el:inner,
            target:{translateY:target},
            time:Math.round(Math.abs(target-css(inner,'translateY'))*1.8),
            type:type,
            callBack:function () {
                (init.offBar)||(scrollBar.style.opacity='0');
            },
            callIn:function () {
                var translateY=css(inner,'translateY');
                (init.offBar)||css(scrollBar,'translateY',-translateY*scale);
            }
        })
    });
}