var imgSet = function(src) {
    var img = new Image();
    img.src = src;
    return img;
};
var imgObj = function(params) {
    var obj = {};
    obj.img = imgSet(params.img);
    obj.width = params.width;
    obj.height = params.height;
    return obj;
}
var characters = {};
characters['mercury'] = imgObj({
    img:'img/mercury.png',
    width:207,
    height:403
});
var texts = {};
texts['inthezone'] = imgObj({
    img:'img/texts/inthezone.png',
    width:164,
    height:34
});
