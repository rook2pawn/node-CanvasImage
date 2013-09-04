;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var CanvasImage = require('../');
$(window).ready(function() {
    var anim = new CanvasImage.Animation;
    var canvas = document.getElementById('canvas');
    var bar = new CanvasImage;
    bar
    .setDimensions(canvas)
    .setFrames(100)
    .setImg('5thmedal.png',401,436)
    .setAnchor('center')
    .setRotate({easing:'linear',start:0,end:360})
    .setScaling({easing:'sinusoidal',start:0.5,end:1});
    anim.animate([bar],canvas);
});

},{"../":2}],2:[function(require,module,exports){
var lib = require('./lib');
var Preloader = require('imagepreloader');
var animation = function() {
    // draws all canvas in list onto canvasA
    this.masterIndex = 0;
    this.blend = function(canvasA, list) {
        var ct = canvasA.getContext('2d');
        ct.clearRect(0,0,240,120)
        for (var i = 0; i < list.length; i++) {
            ct.drawImage(list[i].canvas,0,0);
        }
    };
    this.animate = function(list,canv) {
        clearInterval(this.myinterval);
        canv.getContext('2d').clearRect(0,0,canv.width,canv.height);
        this.masterIndex = 0;
        for (var i = 0; i < list.length; i++) {
            list[i].done = false;
            list[i].index = 0;
        }
        var foo = function(){ 
            this.masterIndex++;
            var results = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].hasOwnProperty('draw')) { 
                    results.push(list[i].draw.call(list[i]));
                } 
                else { 
                    if (list[i].hasOwnProperty('start')) {
                        if (this.masterIndex >= list[i].start)
                            results.push(list[i].img.draw.call(list[i].img,{loop:list[i].loop}));
                    } else
                        results.push(list[i].img.draw.call(list[i].img,{loop:list[i].loop}));
                }
            }
            this.blend(canv,results);
            var alldone = true;
            for (var i = 0; i < results.length; i++) {
                if (results[i].done === false) {
                    alldone = false;
                }
            }
            if (alldone) { 
                clearInterval(this.myinterval);
            }
        };
        this.myinterval = setInterval(foo.bind(this),30);
    }
};
var CanvasImage = function() {
    this.mycanvas = document.createElement('canvas');
    this.myct = this.mycanvas.getContext('2d');
    this.canvasmidx;
    this.canvasmidy;
    this.myimage;
    this.offx;this.offy;
    this.frames = 60;
    this.anchor = {x:0,y:0};
    this.opacity = {start:0,end:1};
    this.scaling = {start:0,end:1};
    this.rotate = {start:0,end:180};
    this.position = {start:{},end:{}};
    this.index = 0;
    this.parametric_x = undefined;
    this.parametric_y = undefined;
    this.done = false;
    this.draw = lib.draw.bind(this);
    this.setFrames = lib.setFrames.bind(this);
    this.setDimensions = lib.setDimensions.bind(this);
    this.setCanvasImg = lib.setCanvasImg.bind(this);
    this.setImg = lib.setImg.bind(this);
    this.setAnchor = lib.setAnchor.bind(this);
    this.setRotate = lib.setRotate.bind(this);
    this.setOpacity = lib.setOpacity.bind(this);
    this.setScaling = lib.setScaling.bind(this);
    this.setMovement = lib.setMovement.bind(this);
}
CanvasImage.Animation = animation;
exports = module.exports = CanvasImage;

},{"./lib":3,"imagepreloader":5}],3:[function(require,module,exports){
var Ease = require('easing');
exports.setRotate = function (rotObj) {
    if ((rotObj.start !== undefined) && (rotObj.end !== undefined)) {
        this.rotate.start = rotObj.start * (Math.PI / 180);
        this.rotate.end = rotObj.end * (Math.PI / 180);
    }
    if ((rotObj.easing !== undefined) && (typeof rotObj.easing == 'string')) {
        this.rotate.easing = Ease(this.frames,rotObj.easing,{endToEnd:rotObj.endToEnd});
    } else {
        this.rotate.easing = Ease(this.frames, 'linear', {endToEnd:rotObj.endToEnd});
    }
    return this;
};
exports.setOpacity = function (opacObj) {
    if ((opacObj.start !== undefined) && (opacObj.end !== undefined)) {
        this.opacity.start = opacObj.start;
        this.opacity.end = opacObj.end;
    }
    if ((opacObj.easing !== undefined) && (typeof opacObj.easing == 'string')) {
        this.opacity.easing = Ease(this.frames,opacObj.easing,{endToEnd:opacObj.endToEnd});
    } else {
        this.opacity.easing = Ease(this.frames, 'linear', {endToEnd:opacObj.endToEnd});
    }
    return this;
};

exports.setScaling = function (scaleObj) {
    if ((scaleObj.start !== undefined) && (scaleObj.end !== undefined)) {
        this.scaling.start = scaleObj.start;
        this.scaling.end = scaleObj.end;
    }
    if ((scaleObj.easing !== undefined) && (typeof scaleObj.easing == 'string')) {
        this.scaling.easing = Ease(this.frames,scaleObj.easing,{endToEnd:scaleObj.endToEnd});
    } else {
        this.scaling.easing = Ease(this.frames, 'linear', {endToEnd:scaleObj.endToEnd});
    }
    return this;
};
exports.setMovement = function(posObj) {
    if ((posObj.start !== undefined) && (posObj.end !== undefined)) {
        this.position.start = posObj.start; 
        this.position.end = posObj.end;
        if ((posObj.easing !== undefined) && (typeof posObj.easing == 'string')) {
            this.position.easing = Ease(this.frames, posObj.easing,{endToEnd:posObj.endToEnd});
        } else {
            this.position.easing = Ease(this.frames, 'linear', {endToEnd:posObj.endToEnd});
        }
        this.parametric_x = function(t) {
            return this.position.start.x + (this.position.end.x - this.position.start.x)*t;
        };
        this.parametric_y = function(t) {
            return this.position.start.y + (this.position.end.y - this.position.start.y)*t;
        }
    }
    return this; 
};

exports.setCanvasImg = function(params) {
    var pix = params.ctx.getImageData(0,0,params.width,params.height);
    var imgobj = {width:params.width,height:params.height,img:pix.data};
    this.offx = -(Math.floor(imgobj.width/2));
    this.offy = -(Math.floor(imgobj.height / 2));
    return this;
};
var imgSet = function(src,w,h) {
    var img = new Image();
    img.src = src;
    var obj = {img:img,width:w,height:h}
    return obj
};
exports.setImg = function(src,w,h) {
    this.myimage = imgSet(src,w,h);
    this.offx = -(Math.floor(this.myimage.width/2));
    this.offy = -(Math.floor(this.myimage.height / 2));
    return this;
};
exports.setAnchor = function(anch) {
    switch (typeof anch) {
        case 'string' :
            switch (anch) {
                case 'center' :
                    this.anchor.x = this.canvasmidx;
                    this.anchor.y = this.canvasmidy;
                    break;
                default: break;
            }
            break;
        case 'object' :
                if ((anch.x !== undefined) && (anch.y !== undefined)) {
                    this.anchor = anch;
                }
            break;
        default:
            break;
    }
    return this;
};
exports.setDimensions = function(canv) {
    this.mycanvas.width = canv.width;
    this.mycanvas.height = canv.height;
    if (this.myct.hasOwnProperty('mozImageSmoothingEnabled')) {
        this.myct.mozImageSmoothingEnabled = true;
    }
    this.canvasmidx = Math.floor(this.mycanvas.width / 2);
    this.canvasmidy = Math.floor(this.mycanvas.height / 2);
    return this;
};
exports.setFrames = function(framenum) {
    this.frames = framenum;
    return this;
}
exports.draw = function(params) {
    if (this.index < this.frames) {
        this.myct.save();
        this.myct.clearRect(0,0,this.mycanvas.width,this.mycanvas.height);
        var movex = movey = 0;
        movex = this.anchor.x;
        movey = this.anchor.y;
        if (this.parametric_x !== undefined) {
            movex += this.parametric_x(this.position.easing[this.index]);
        }
        if (this.parametric_y !== undefined) {
            movey += this.parametric_y(this.position.easing[this.index]);
        }
        this.myct.translate(movex,movey);
        if (this.rotate.easing !== undefined) {
            var rotVal = ((this.rotate.end - this.rotate.start) * this.rotate.easing[this.index]);
            this.myct.rotate(rotVal);
        }
        if (this.scaling.easing !== undefined) {
            var scaleVal = this.scaling.start + ((this.scaling.end - this.scaling.start) * this.scaling.easing[this.index]);
            this.myct.scale(scaleVal,scaleVal);
        }
        if (this.opacity.easing !== undefined) {
            var opacVal = this.opacity.start + ((this.opacity.end - this.opacity.start) * this.opacity.easing[this.index]);
            this.myct.globalAlpha = opacVal;
        } 
        this.myct.drawImage(this.myimage.img,this.offx,this.offy,this.myimage.width,this.myimage.height);
        this.myct.restore();
        this.index++;
    } else {
        if ((params !== undefined) && (params.loop !== undefined) && (params.loop == true)) {
            this.index = 0;
        } else {
            this.done = true;
        }
    }
    return {canvas:this.mycanvas,index:this.index,frames:this.frames,done:this.done};
};

},{"easing":4}],4:[function(require,module,exports){
module.exports = exports = Easing;

function Easing(list,type,options) {
    var funclist = {};
    var endToEnd = false;
    var invert = false;
    if (options !== undefined) {
        if ((options.endToEnd !== undefined) && (options.endToEnd === true)) {
            endToEnd = true; 
        }
        if ((options.invert !== undefined) && (options.invert === true)) {
            invert = true; 
        }
    }
    // you can call it with either Easing(11, 'linear') or Easing(new Array(11), 'linear')
    if (typeof list == 'number') {
        list = new Array(list);
    }
    funclist['linear'] = function(x) {
        return x;
    };
    funclist['quadratic'] = function(x) {
        return Math.pow(x,2);
    };
    funclist['cubic'] = function(x) {
        return Math.pow(x,3);
    };
    funclist['quartic'] = function(x) {
        return Math.pow(x,4);
    };
    funclist['quintic'] = function(x) {
        return Math.pow(x,5);
    };
    var sinusoidal = function(x) {
        return Math.sin(x*(Math.PI/2));
    }
    funclist['sinusoidal'] = sinusoidal;
    funclist['sin'] = sinusoidal;
    var exponential = function(x) {
        return Math.pow(2, 10 * (x - 1));
    };
    funclist['exponential'] = exponential;
    funclist['expo'] = exponential;
    funclist['exp'] = exponential;
    funclist['circular'] = function(x) {
        var time = (Math.PI*1.5) + (x * (Math.PI/2));
        return 1 + Math.sin(time);
    }
    if (type === undefined) {
        type = 'quadratic';
    }
    var step = 1/(list.length-1);

    for (var i = 1; i < list.length-1; i++) {
        list[i] = funclist[type](i*step);
    }
    list[0] = 0;
    list[list.length-1] = 1; 

    if (endToEnd) {
        var mid = Math.floor(list.length / 2);
        for (var i=1; i< mid; i++) {
            list[i] = list[i*2];
        }
        list[mid] = 1;
        for (var i=mid+1; i<list.length-1; i++) {
            list[i] = list[mid-(i-mid)];
        }
        list[list.length-1] = 0;
    }
    if (invert) {
        for (var i = 0; i < list.length;i++) {
            list[i] = 1 - list[i];
        }
    }
    return list;
};

},{}],5:[function(require,module,exports){
;(function (exports) {
    var ImageSet = function(params) {
        if (params === undefined) 
            params = {}
        var list = params.obj || [];
        var success = params.fn || undefined;
        var error = params.fn2 || undefined;
        var count = 0;
        if (params.Image !== undefined)
            Image = params.Image;
        var myimages = [];
        this.add = function(src) {
            list.push(src);
            return this
        }
        this.success = function(fn) {
            success = fn;
            return this
        }
        this.error = function(fn) {
            error = fn;
            return this
        }
        this.loaded = function() {
            count++;
            if (count === list.length) {
                success(myimages);
            }
        };
        this.done = function() {
            if (success !== undefined)
                list.forEach(function(src) {
                    var that = this;
                    var img = new Image();
                    img.onerror = function() {
                        if (error !== undefined) error("image load error!");
                    };
                    img.onabort = function() {
                        if (error !== undefined) error("image load abort!");
                    };
                    img.onload = function() {
                        that.loaded();
                    };
                    img.src = src;
                    img.name = src.slice(src.lastIndexOf('/')+1);
                    myimages.push(img);
                },this);
        };
    };
    if (exports.Window !== undefined) {
        exports.Preloader = ImageSet;
    } else if ((module !== undefined) && (module.exports !== undefined)) {
        exports = module.exports = ImageSet;
    }
})(typeof exports === 'undefined' ?  this : exports)

},{}]},{},[1])
;