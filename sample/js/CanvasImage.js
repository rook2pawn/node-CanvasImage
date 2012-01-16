var Ease = require('easing');

var CanvasImage = function(params) {
    if (params === undefined) params = {};
    var mycanvas = document.createElement('canvas');
    var myct = mycanvas.getContext('2d');
    var canvasmidx,canvasmidy;
    
    if (params.canvas !== undefined) {
        this.setCanvasDimensions(params.canvas);
    }
    var myimage = params.imgObj || undefined;
    var offx,offy;
    if (myimage !== undefined) {
        this.setImg(myimage);
    }
    var frames = params.frames || 60;
    var anchor = params.anchor || {};
    var opacity = params.opacity || {};
    var scaling = params.scaling || {};
    if ((anchor.x === undefined) && (anchor.y === undefined)) {
        anchor.x = 0;
        anchor.y = 0;
    }
    var rotate = params.rotate || {};
    var position = params.position || {};
    if ((position.start === undefined) && (position.end === undefined)) { 
        position.start = {};
        position.end = {};
    }
    this.index = 0;
    this.draw = function(params) {
        var done = false;
        if (this.index < frames) {
            myct.save();
            myct.clearRect(0,0,mycanvas.width,mycanvas.height);
            var movex = movey = 0;
            movex = anchor.x;
            movey = anchor.y;
            if (parametric_x !== undefined) {
                movex += parametric_x(position.easing[this.index]);
            }
            if (parametric_y !== undefined) {
                movey += parametric_y(position.easing[this.index]);
            }
            myct.translate(movex,movey);
            if (rotate.easing !== undefined) {
                var rotVal = ((rotate.end - rotate.start) * rotate.easing[this.index]);
                myct.rotate(rotVal);
            }
            if (scaling.easing !== undefined) {
                var scaleVal = ((scaling.end - scaling.start) * scaling.easing[this.index]);
                myct.scale(scaleVal,scaleVal);
            }
            if (opacity.easing !== undefined) {
                var opacVal = ((opacity.end - opacity.start) * opacity.easing[this.index]);
                myct.globalAlpha = opacVal;
            }
            myct.drawImage(myimage.img,offx,offy,myimage.width,myimage.height);
            //myct.fillStyle = '#000000';
            //myct.fillRect(0,0,20,20);
            myct.restore();
            this.index++;
            //setTimeout(function(that){that.draw();},20,this);
        } else {
            if ((params !== undefined) && (params.loop !== undefined) && (params.loop == true)) {
                this.index = 0;
            } else {
                done = true;
            }
        }
        return {canvas:mycanvas,index:this.index,frames:frames,done:done};
    };
    this.setFrames = function(framenum) {
        frames = framenum;
        return this;
    }
    this.setCanvasDimensions = function(canv) {
        mycanvas.width = canv.width;
        mycanvas.height = canv.height;
        if (myct.hasOwnProperty('mozImageSmoothingEnabled')) {
            myct.mozImageSmoothingEnabled = true;
        }
        canvasmidx = Math.floor(mycanvas.width / 2);
        canvasmidy = Math.floor(mycanvas.height / 2);
        return this;
    };
    this.setImg = function(obj) {
        myimage = obj;
        offx = -(Math.floor(myimage.width/2));
        offy = -(Math.floor(myimage.height / 2));
        return this;
    };
    this.setAnchor = function(anch) {
        switch (typeof anch) {
            case 'string' :
                switch (anch) {
                    case 'center' :
                        anchor.x = canvasmidx;
                        anchor.y = canvasmidy;
                        break;
                    default: break;
                }
                break;
            case 'object' :
                    if ((anch.x !== undefined) && (anch.y !== undefined)) {
                        anchor = anch;
                    }
                break;
            default:
                break;
        }
        return this;
    };
    this.setRotate = function (rotObj) {
        if ((rotObj.start !== undefined) && (rotObj.end !== undefined)) {
            rotate.start = rotObj.start * (Math.PI / 180);
            rotate.end = rotObj.end * (Math.PI / 180);
        }
        if ((rotObj.easing !== undefined) && (typeof rotObj.easing == 'string')) {
            rotate.easing = Ease(frames,rotObj.easing,{endToEnd:rotObj.endToEnd});
        } else {
            rotate.easing = Ease(frames, 'linear', {endToEnd:rotObj.endToEnd});
        }
        return this;
    };
    this.setOpacity = function (opacObj) {
        if ((opacObj.start !== undefined) && (opacObj.end !== undefined)) {
            opacity.start = opacObj.start;
            opacity.end = opacObj.end;
        }
        if ((opacObj.easing !== undefined) && (typeof opacObj.easing == 'string')) {
            opacity.easing = Ease(frames,opacObj.easing,{endToEnd:opacObj.endToEnd});
        } else {
            opacity.easing = Ease(frames, 'linear', {endToEnd:opacObj.endToEnd});
        }
        return this;
    };

    this.setScaling = function (scaleObj) {
        if ((scaleObj.start !== undefined) && (scaleObj.end !== undefined)) {
            scaling.start = scaleObj.start;
            scaling.end = scaleObj.end;
            console.log("scaling:");console.log(scaling);
        }
        if ((scaleObj.easing !== undefined) && (typeof scaleObj.easing == 'string')) {
            scaling.easing = Ease(frames,scaleObj.easing,{endToEnd:scaleObj.endToEnd});
        } else {
            scaling.easing = Ease(frames, 'linear', {endToEnd:scaleObj.endToEnd});
        }
        return this;
    };
    var parametric_x = undefined;
    var parametric_y = undefined;
    this.setMovement = function(posObj) {
        if ((posObj.start !== undefined) && (posObj.end !== undefined)) {
            position.start = posObj.start; 
            position.end = posObj.end;
            if ((posObj.easing !== undefined) && (typeof posObj.easing == 'string')) {
                position.easing = Ease(frames, posObj.easing,{endToEnd:posObj.endToEnd});
            } else {
                position.easing = Ease(frames, 'linear', {endToEnd:posObj.endToEnd});
            }
            parametric_x = function(t) {
                return position.start.x + (position.end.x - position.start.x)*t;
            };
            parametric_y = function(t) {
                return position.start.y + (position.end.y - position.start.y)*t;
            }
        }
        return this; 
    };
    // draws all canvas in list onto canvasA
    this.blend = function(canvasA, list) {
        var ct = canvasA.getContext('2d');
        ct.clearRect(0,0,mycanvas.width,mycanvas.height);
        for (var i = 0; i < list.length; i++) {
            ct.drawImage(list[i].canvas,0,0);
        }
    };
    this.animate = function(list,canv) {
        var masterIndex = 0;
        var foo = function(){ 
            masterIndex++;
            var results = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].hasOwnProperty('draw')) { 
                    results.push(list[i].draw());
                } else { 
                    if (list[i].hasOwnProperty('start')) {
                        if (masterIndex >= list[i].start) {
                            results.push(list[i].img.draw({loop:list[i].loop}));
                        }
                    } else {
                        results.push(list[i].img.draw({loop:list[i].loop}));
                    }
                }
            }
            if (list[0].hasOwnProperty('blend')) {
                list[0].blend(canv, results);
            } else {
                list[0].img.blend(canv,results);
            }
            var alldone = true;
            for (var i = 0; i < results.length; i++) {
                if (results[i].done === false) {
                    alldone = false;
                }
            }
            if (alldone) { 
                clearInterval(myint);
            }
        };
        var myint = setInterval(foo,30);
    }
}
