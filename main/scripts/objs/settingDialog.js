var GameStatus = require('gameStatus');

cc.Class({
    extends: cc.Component,

    properties: {
        close: {
            default: null,
            type: cc.Node
        },
        skin1: {
            default: null,
            type: cc.Node
        },
        skin2: {
            default: null,
            type: cc.Node
        }
    },

    init: function (game) {
        this.game = game;
        this.node.opacity = 256;
    },

    addTouchEvent: function () {
        var close = this.close.getComponent(cc.Sprite);
        close.node.on(cc.Node.EventType.TOUCH_END, this.touchCloseEvent, close);
        var skin1 = this.skin1.getComponent(cc.Sprite);
        skin1.node.on(cc.Node.EventType.TOUCH_END, this.touchSkin1Event, skin1);
        var skin2 = this.skin2.getComponent(cc.Sprite);
        skin2.node.on(cc.Node.EventType.TOUCH_END, this.touchSkin2Event, skin2);
    },
    delTouchEvent: function () {
        var close = this.close.getComponent(cc.Sprite)
        close.node.targetOff(close);
        var skin1 = this.skin1.getComponent(cc.Sprite);
        skin1.node.targetOff(skin1);
        var skin2 = this.skin2.getComponent(cc.Sprite);
        skin2.node.targetOff(skin2);
    },
    touchCloseEvent (event) {
        var dialog = this.node.parent.getComponent('settingDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.dismiss();
    },
    touchSkin1Event (event) {
        var dialog = this.node.parent.getComponent('settingDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        var skinName = "skin/skin-default"
        dialog.game.tilesMng.changeSkin(skinName);
        dialog.game.planeMng.tile.changeSkin(skinName);
        dialog.dismiss();
    },
    touchSkin2Event (event) {
        console.log("touchSkin2Event")
        var dialog = this.node.parent.getComponent('settingDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        var skinName = "skin/skin-rainbow"
        dialog.game.tilesMng.changeSkin(skinName);
        dialog.game.planeMng.tile.changeSkin(skinName);
        dialog.dismiss();
    },

    show: function () {
        //console.log("dialog.show")
        this.addTouchEvent();
        this.node.zIndex = 120;        
        this.node.x = 375;
        this.node.y = cc.view.getFrameSize().height / cc.view.getFrameSize().width * 375;
        this.node.opacity = 255;
        this.game.adMng.hideBottomBannerAd();
    },

    dismiss: function () {
        this.game.switchGameStatus(GameStatus.PLAYING);
        this.delTouchEvent();
        this.node.zIndex = 0;
        this.node.opacity = 0;
    },
});