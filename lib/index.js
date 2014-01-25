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
exports.setText = function(obj) {
    this.text = obj.text;
    if (obj.font !== undefined) {
        this.font = obj.font;
    }
    if (obj.pos !== undefined) {
        this.textpos = obj.pos;
    }
    if (obj.align !== undefined) {
        this.align = obj.align;
    }
}
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

// we readjust just for translation to  output text
        if (this.text !== undefined) { 
            this.myct.save();
            this.myct.translate(movex,movey);
            this.myct.textAlign = 'center';
            this.myct.font = this.font;
            this.myct.fillText(this.text,this.textpos.x,this.textpos.y);
            this.myct.restore();
        }

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
