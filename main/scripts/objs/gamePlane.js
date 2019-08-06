cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function (game) {
        this.game = game;
    },

    changeSkin: function (skinName) {
        var sprite = this.getComponent(cc.Sprite);
        cc.loader.loadRes(skinName, cc.SpriteFrame, function (err, spriteFrame) {  // IMPORTANT
            sprite.spriteFrame = spriteFrame.clone();
        });
    },

    setPlanePos: function (x, y) {
        this.node.x = x;
        this.node.y = y;
    }
});