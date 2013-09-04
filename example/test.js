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
