cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function (game) {
        this.game = game;
        //var sprite = this.getComponent(cc.Sprite);
        //var frame = "grid";
        //cc.loader.loadRes(frame, cc.SpriteFrame, function (err, spriteFrame) {
        //    sprite.spriteFrame = spriteFrame;
        //});
    },

    setPlaneSize: function (width, height) {
        this.node.width = width;
        this.node.height = height;
    }
});