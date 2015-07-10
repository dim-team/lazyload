/* 图片延迟加载 */
var $ = require('zepto');//引入alias里面的配置好的插件
var lazy = {};
var imgSize = ''; //pic1域image能在url后面加上尺寸和质量参数

function getPosition(h){
	var a=navigator.userAgent.toLowerCase();
	var b=(a.indexOf("opera")!=-1);
	var e=(a.indexOf("msie")!=-1&&!b);
	var d=h;
	
	if(d.parentNode===null||d.style.display=="none"){
		return false;
	}
	
	var l=null;	var k=[];var i;
	if(d.getBoundingClientRect){
		i=d.getBoundingClientRect();
		if(a.indexOf("ipad")!=-1){
			return{x:i.left,y:i.top}
	    }
	    var c=$(window).scrollTop();
	    var f=$(window).scrollLeft();
	    return{x:i.left+f,y:i.top+c}
	}
	else{
		if(document.getBoxObjectFor){
			i=document.getBoxObjectFor(d);
			var j=(d.style.borderLeftWidth)?parseInt(d.style.borderLeftWidth):0;
			var g=(d.style.borderTopWidth)?parseInt(d.style.borderTopWidth):0;
			k=[i.x-j,i.y-g];
		}
		else{
			k=[d.offsetLeft,d.offsetTop];
			l=d.offsetParent;
			if(l!=d){
				while(l){
					k[0]+=l.offsetLeft;
					k[1]+=l.offsetTop;
					l=l.offsetParent;
				}
			}
			if(a.indexOf("opera")!=-1||(a.indexOf("safari")!=-1&&d.style.position=="absolute")){
				k[0]-=document.body.offsetLeft;
				k[1]-=document.body.offsetTop;
			}
		}
	}
	
	if(d.parentNode){
		l=d.parentNode;}
	else{l=null}
	while(l&&l.tagName!="BODY"&&l.tagName!="HTML"){
		k[0]-=l.scrollLeft;k[1]-=l.scrollTop;
		if(l.parentNode){
			l=l.parentNode
		}
		else{l=null}
	}
	return{x:k[0],y:k[1]}
}

function delFileExt(str){
	var reg = /\.\w+$/;
	return $.trim(str).replace(reg,'');
}
function imgLoad(b,a){
	b.each(function(){
		var d=$(this).attr("data-src");
		var src=$(this).attr("src");
		var that = $(this);
		
		if(d){
			if (imgSize){
				d = delFileExt(d)+imgSize+'.jpg';
			}
			var c=getPosition($(this)[0]).y;
			if(a >= c && (c+$(this).height()) >= ($(window).scrollTop()-$(window).height())){
				var img = new Image();
				img.onload = function () {
					$(that).attr("src",d).removeAttr("data-src");
					img.onload = null;
				}
				img.src = d;
			}
		}
	});
	imgLoadStatus=1;
}



lazy.init = function(selector,size){
	if (size){
		imgSize = size;
	}

	var d=$(selector).find("img[data-src]");
	//2代表加载两屏
	var a=function(){ return $(window).height()*2+$(window).scrollTop();}
	var Event = 1;
	imgLoad(d,a());
	var c=150;
	var b=0;
	$(window).bind("scroll",function(){
		var e=Math.abs($(window).scrollTop()-b);
		if(e>=c){
			imgLoad(d,a());
			if(imgLoadStatus==1){
				b+=c;
				imgLoadStatus=0;
			}
		}
	});
	$(window).trigger('scroll');
}

module.exports = lazy;

