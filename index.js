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
