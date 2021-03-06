var GameStatus = require('gameStatus');

cc.Class({
    extends: cc.Component,

    properties: {
        close: {
            default: null,
            type: cc.Node
        },
        more: {
            default: null,
            type: cc.Node
        },
        restart: {
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
        var restart = this.restart.getComponent(cc.Sprite);
        restart.node.on(cc.Node.EventType.TOUCH_END, this.touchCloseEvent, restart);
        var more = this.more.getComponent(cc.Sprite);
        if (this.game.scoreMng._life > 0) {
            more.node.on(cc.Node.EventType.TOUCH_END, this.touchMoreEvent, more);
        } else {
            more.node.opacity = 128;
        }
    },
    delTouchEvent: function () {
        var close = this.close.getComponent(cc.Sprite)
        close.node.targetOff(close);
        var restart = this.restart.getComponent(cc.Sprite);
        restart.node.targetOff(restart);
        var more = this.more.getComponent(cc.Sprite);
        more.node.targetOff(more);
    },
    touchCloseEvent (event) {
        var dialog = this.node.parent.getComponent('restartDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.game.switchGameStatus(GameStatus.SHOWSTARTBTN);
        dialog.dismiss();
    },
    touchMoreEvent (event) {
        var dialog = this.node.parent.getComponent('restartDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.game.adMng.showVideoAd();
        dialog.dismiss();
    },

    show: function () {
        this.addTouchEvent();
        this.node.zIndex = 120;        
        this.node.x = 375;
        this.node.y = cc.view.getFrameSize().height / cc.view.getFrameSize().width * 375;
        this.node.opacity = 255;
        this.game.adMng.hideBottomBannerAd();
        this.game.adMng.showRestartDialogBannerAd();
    },

    dismiss: function () {
        this.delTouchEvent();
        this.node.zIndex = 0;
        this.node.opacity = 0;
        this.game.adMng.hideRestartDialogBannerAd();
    },
});