document.addEventListener('touchstart',function (e) {
        e.preventDefault();
    });
setBigImg();
function setBigImg() {
    var bigImg=document.querySelector("#bigImg");
    var navs=document.querySelectorAll("#imgNavs a");
    var startRotate=0;
    var startScale=0;
    var maxScale=1.4;
    var minScale=.5;
    setGesTure({
        el:bigImg,
        start:function(e) {
            startRotate=css(this,'rotate');
            startScale=css(this,'scale')/100;
        },
        change:function(e){
            //e.scale
            //e.rotation
            var scale=startScale*e.scale;
            if (scale>maxScale){
                scale=maxScale;
            } else if (scale<minScale){
                scale=minScale;
            }
            css(this,'rotate',startRotate+e.rotation);
            css(this,'scale',scale*100);
        },
        end:function (e) {
            var deg=css(this,"rotate");
            deg=Math.round(deg/90)*90;
            MTween({
                el:this,
                target:{rotate:deg},
                time:300,
                type:"easeOut"
            });
        }
    });
    navs[2].addEventListener("touchend",function () {
        var scale=css(bigImg,'scale')/100;
        scale+=.1;
        if(scale>maxScale){
            scale=maxScale;
        }
        MTween({
            el:bigImg,
            target:{scale:scale*100},
            time:300,
            type:"easeOut"
        });
    });
    navs[3].addEventListener("touchend",function () {
        var scale=css(bigImg,'scale')/100;
        scale-=.1;
        if(scale<minScale){
            scale=minScale;
        }
        MTween({
            el:bigImg,
            target:{scale:scale*100},
            time:300,
            type:"easeOut"
        });
    });
    navs[0].addEventListener("touchend",function () {
        var deg=css(bigImg,"rotate");
        deg=Math.round(deg/90)-1;
        deg=deg*90;
        MTween({
            el:bigImg,
            target:{rotate:deg},
            time:300,
            type:"easeOut"
        });
    });
    navs[1].addEventListener("touchend",function () {
        var deg=css(bigImg,"rotate");
        deg=Math.round(deg/90)+1;
        deg=deg*90;
        MTween({
            el:bigImg,
            target:{rotate:deg},
            time:300,
            type:"easeOut"
        });
    });
}
function getDis(point1,point2) {
    var x=point2.x-point1.x;
    var y=point2.y-point1.y;
    return Math.sqrt( x*x+y*y);
};
//Math.atan2(x,y) 斜率 由一条直线与x轴正方向所形成的角的正切 返回弧度
//角度转弧度  deg*Math.PI/180
//弧度转角度  rad*180/Math.PI
function getDeg(point1,point2) {
    var x=point2.x-point1.x;
    var y=point2.y-point1.y;
    return Math.atan2(y,x)*180/Math.PI;
}
function setGesTure(init) {
    var el=init.el;
    var isGesTure=false;
    var startPoint=[];
    if (!el){
        return;
    }
    el.addEventListener('touchstart',function (e) {
        event.preventDefault();
        if (e.touches.length>=2){
            isGesTure=true;//记录用户当前触发了gesture
            startPoint[0]={x:e.touches[0].pageX, y:e.touches[0].pageY};//获取第一根手指坐标
            startPoint[1]={x:e.touches[1].pageX, y:e.touches[1].pageY};//获取第二根手指坐标
            init.start&&init.start.call(el,e);
        };
    });
    el.addEventListener('touchmove',function (e) {
        if (isGesTure&&e.touches.length>=2){
            var nowPoint=[];
            nowPoint[0]={x:e.touches[0].pageX, y:e.touches[0].pageY};//获取第一根手指坐标
            nowPoint[1]={x:e.touches[1].pageX, y:e.touches[1].pageY};//获取第二根手指坐标
            var startDis=getDis(startPoint[0],startPoint[1]);
            var nowDis=getDis(nowPoint[0],nowPoint[1]);
            var startDeg=getDeg(startPoint[0],startPoint[1]);
            var nowDeg=getDeg(nowPoint[0],nowPoint[1]);
            e.scale=nowDis/startDis;
            e.rotation=nowDeg-startDeg;
            init.change&&init.change.call(el,e);
        };
    });
    el.addEventListener('touchend',function (e) {
        if (isGesTure){
            if (e.touches.length<2||e.targetTouches.length<1){
                isGesTure=false;
                init.end&&init.end.call(el,e);

            };
        };
    });
};