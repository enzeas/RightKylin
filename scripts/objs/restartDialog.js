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
        this.node.opacity = 0;
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
        dialog.dismiss();
    },
    touchMoreEvent (event) {
        var dialog = this.node.parent.getComponent('restartDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.moreLife();
    },

    show: function () {
        //console.log("dialog.show")
        this.addTouchEvent();
        this.node.zIndex = 120;
        this.node.x = cc.view.getFrameSize().width;// - 512 / 2;
        this.node.y = cc.view.getFrameSize().height;// - 512 / 2;
        this.node.opacity = 255;
    },

    dismiss: function () {
        this.game.switchGameStatus(GameStatus.SHOWSTARTBTN);
        this.delTouchEvent();
        this.node.zIndex = 0;
        this.node.opacity = 0;
        // this._doEndAnim();
    },
    moreLife: function () {
        var score = this.game.scoreMng._score;
        this.scheduleOnce(function () {
            this.dismiss();
            this.game.scoreMng.setScore(score);
            this.game.scoreMng.setLife(0);
        }, this.game.recoveryTime);
    },

    _doStartAnim: function () {/*
        if(Utils.shouldRender()){
            // 进行锚点坐标转换
            this.plane.scale = 0.8;
            var scaleBig = cc.scaleTo(0.5, 1, 1);
            this.plane.runAction(scaleBig.easing(cc.easeElasticOut(0)));
        }
    */},

    _doEndAnim: function () {/*
        if(Utils.shouldRender()){
            var fadeOut = cc.fadeOut(0.1);
            var func = cc.callFunc(()=>this.node.active = false);
            this.node.runAction(cc.sequence(fadeOut, func));
        } else{
            this.node.active = false;
        }
    */},

});