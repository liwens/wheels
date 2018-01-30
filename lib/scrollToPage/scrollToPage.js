//原生全屏页面滚动插件
    function scrollToPage(option) {
    	this.pages = option.pages;
    	console.log(option)
    	this.pagesTops = [];
		this.init();
		this.pauseTop = 0;
		this.timer = null;
		this.flag = false;
    }
    scrollToPage.prototype = {
    	constructor: scrollToPage,
    	//初始化
    	init:function() {
//  		this.RAF();
    		this.getPagesTop();
    		this.bindScroll();
    	},
    	
    	//获取传入元素scrollTop
    	getPagesTop() {
    		for(var i = 0,len = this.pages.length; i < len; i++) {
    			var page = document.querySelector(this.pages[i]);
    			this.pagesTops.push(page.offsetTop);
    		}
    		console.log(this.pagesTops)
    	},
    	
    	//绑定滚动事件
    	bindScroll: function() {
    		var body = document.body;
    		var _this = this;
			var mouseEvent = this.addEvent(body,'mousewheel',this.scrollHandler.bind(this)) ||
							this.addEvent(body,'DOMMouseScroll',this.scrollHandler.bind(this));
    	},
    	
    	//函数滚动事件
    	scrollHandler: function(_this) {
    		var curTop = document.documentElement.scrollTop || document.body.scrollTop;
    		console.log(curTop)
    		if(curTop < this.pauseTop) {
    			this.scrollMoveUp(curTop)
    		}else{
    			this.scrollMoveDown(curTop)
    		}
    	},
    	
    	//向下滚动
    	scrollMoveUp:function(curTop) {
			this.moveStart(this.diff(curTop,'up'));
    		this.pauseTop = document.documentElement.scrollTop || document.body.scrollTop;
    	},
    	
    	//向下滚动
    	scrollMoveDown: function(curTop) { 		
    		this.moveStart(this.diff(curTop,'down'));
    		this.pauseTop = document.documentElement.scrollTop || document.body.scrollTop;
    	},
    	
    	//计算应该滚动到相应位置
    	diff: function(curTop, direction) {
    		this.pagesTops.push(curTop);
    		this.pagesTops.sort(function(a,b) { return a-b });    		
    		var index = this.pagesTops.indexOf(curTop);

    		this.pagesTops.splice(index,1);

			if(direction == 'up') {
				return index == 0 ? this.pagesTops[0] : this.pagesTops[index - 1];
			}else{
				var len = this.pages.length;
				
				return index == len ? this.pagesTops[len - 1] : this.pagesTops[index];
			}
    	},
    	
    	//缓冲运动函数
    	moveStart: function(Target){
//		    window.cancelAnimationFrame(this.timer);
		    var speed = 0;
		    var _run = function() {
		    	speed=(Target - document.documentElement.scrollTop)/5;
		    	speed=speed>0?Math.ceil(speed):Math.floor(speed);
		    	document.documentElement.scrollTop = document.documentElement.scrollTop + speed;
		    	if(document.documentElement.scrollTop != Target){
		    		console.log('调用')
		            window.requestAnimationFrame(_run)
		        }
		    }
		    _run()
		    
//		    this.timer=window.requestAnimationFrame(function(){
//		    	console.log('执行了')
//		        var speed=(Target - document.documentElement.scrollTop)/5;
//		       speed=speed>0?Math.ceil(speed):Math.floor(speed);
//		        if(document.documentElement.scrollTop == Target){
//		            clearInterval(this.timer);
//		        }
//		        else{
//		            document.documentElement.scrollTop = document.documentElement.scrollTop + speed;
//		            window.requestAnimationFrame()
//		        }
//		    })
		},
		
		/*
		 *惰性加载函数方案， 此时addEvent依然被声明为一个普通函数，在函数里依然有一些分之判断，但是在第一次进入条件分支后，在函数内部会重写这个函数，重写之后的函数就是我们期望的addEvent函数，在下一次进入addEvent函数的时候，addEvent函数里不再存在条件分之语句
		 **/
    	addEvent: function(elem,type,handler) {
    		if(window.addEventListener) {
    			this.addEvent = function(elem,type, handler) {
    				elem.addEventListener(type, handler, false)
    			}
    		}else if(window.addEvent) {
    			this.addEvent = function(elem,type, handler) {
    				elem.attachEvent('on' + type, handler);
    			}
    		}
    		this.addEvent(elem, type, handler);
    	},
    	RAF: function() {
    		var lastTime = 0;
		    var vendors = ['webkit', 'moz'];
		    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
		                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
		    }
		
		    if (!window.requestAnimationFrame) {
		        window.requestAnimationFrame = function(callback, element) {
		            var currTime = new Date().getTime();
		            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
		            var id = window.setTimeout(function() {
		                callback(currTime + timeToCall);
		            }, timeToCall);
		            lastTime = currTime + timeToCall;
		            return id;
		        };
		    }
		    if (!window.cancelAnimationFrame) {
		        window.cancelAnimationFrame = function(id) {
		            clearTimeout(id);
		        };
		    }
		    console.log(requestAnimationFrame)
    	}
    	
    }



/*
 * Tween.js
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
*/
var Tween = {
    Linear: function(t, b, c, d) { return c*t/d + b; },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t-2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
            return c / 2*((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t*t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p/(2*Math.PI) * Math.asin(c/a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d / 2) == 2) return b+c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t, b, c, d) {
            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function(t, b, c, d) {
            if (t < d / 2) {
                return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}
Math.tween = Tween;