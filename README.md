CanvasImage
===========

Create animations with indepedent movements out of images.


Example
=======

    <canvas id='canvas' width=240 height=120></canvas>

    var CanvasImage = require('canvas-image');
    $(window).ready(function() {
        var anim = new CanvasImage.Animation;
        var canvas = document.getElementById('canvas');
        var bar = new CanvasImage;
        bar
        .setDimensions(canvas)
        .setFrames(100)
        .setImg('foo.png',401,436)
        .setAnchor('center')
        .setScaling({easing:'sinusoidal',start:0.5,end:1});
        anim.animate([bar],canvas);
    });

.setFrames(num)
===============

Set the number of frames to specify the duration of the effects
    
    .setFrames(40) // 40 frames worth of effects

.setDimensions(canvas)
======================

Pass this function with a canvas element that has the width and height
you intend to draw on.

.setImg('imgsrc.png',width,height) 
==================================

Pass the img path, the width, and the height of the image.

.setAnchor
==========

Achor will affect the rotate, scaling, and movement animations such that they occur around the anchor point instead of the midpoint.
You can either call .setAnchor('center') or .setAnchor({x:24,y:155}) for example to anchor at (24,155).

.setRotate
==========

Specify start rotation and end rotation in degrees.

    .setRotate({start:0, end:180}); // start at 0 degrees and end at 180degrees.

    // or

    .setRotate({start:0, end:45, easing:'linear'})


    // Check out [node-easing](https://github.com/rook2pawn/node-easing)

You can also pass an "endToEnd" flag to tell the easer to go back and forth,
i.e. {start:0, end: 45, easing:'linear', endToEnd:true}


.setOpacity
===========

Governs opacity. start values can range from 0 to 1 and end values can range from 0 to 1. 

.setScaling
===========

Governs scaling. start values can range from 0 to any number, and end values can range from 0 to any number. 1 = 100% scaling (no scaling).

.setMovement
============

    .setMovement({start:{x:0,y:0},end:{x:100,y:100}});

    // goes from 0,0, to 100,100


ANIMATION PACKAGE
=================

    var anim = new CanvasImage.Animation

ANIMATION Methods
=================

anim.animate(list,canvasElement,cb) 
-----------------------------------

.animate will take a list of CanvasImage elements, draw them on the supplied canvasElement, then when the animation is finished, will execute the supplied
callback if there is one. Here's an example


    var CanvasImage = require('canvas-image');
    var bar = new CanvasImage;
    var cat = new CanvasImage;
    var anim = new CanvasImage.Animation;
    bar
    .setDimensions(canv)
    .setFrames(15)
    .setImg('foo.png',199,32)
    .setAnchor('center')
    .setRotate({easing:'linear',start:0,end:360})
    .setMovement({start:{x:-100,y:-100},end:{x:0,y:0}})
    .setScaling({easing:'linear',start:0.2,end:1});
    cat
    .setDimensions(canv)
    .setFrames(15)
    .setImg('bar.png',135,32)
    .setAnchor('center')
    .setMovement({start:{x:100,y:100},end:{x:-200,y:0}})
    .setScaling({easing:'linear',start:0.2,end:1});

    var mycanvas = document.getElementById('mycanvas');
    anim.animate([bar,cat],mycanvas,function() {
        anim.dimmer(mycanvas);
    });

In this example, bar and cat are two indepedent CanvasImage elements that have positional, rotationl, and movement, and scaling elements over time.
anim.animate takes these two and renders them onto a canvas with id mycanvas.
Then, when the animation is finished, the callback is called and there is a convenience method called .dimmer that takes a canvas element and quickly
reduces the opacity to 0 in a brief animation.

anim.dimmer(canvasElement)
--------------------------
Takes a canvas element and reduces the opacity from 100% to 0% in a brief animation.
