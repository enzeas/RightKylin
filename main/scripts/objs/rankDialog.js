var GameStatus = require('gameStatus');

cc.Class({
    extends: cc.Component,

    properties: {
        close: {
            default: null,
            type: cc.Node
        },
        share: {
            default: null,
            type: cc.Node
        },
        rank: cc.Label,
        icon: cc.Node,
        nickname: cc.Label,
        score: cc.Label,
        display: cc.Sprite
    },

    init: function (game) {
        this.game = game;
        this.maxLen = 5;
        this.node.opacity = 0;
    },

    addTouchEvent: function () {
        var close = this.close.getComponent(cc.Sprite);
        close.node.on(cc.Node.EventType.TOUCH_END, this.touchCloseEvent, close);
        var share = this.share.getComponent(cc.Sprite);
        share.node.on(cc.Node.EventType.TOUCH_END, this.touchShareEvent, share);
    },
    delTouchEvent: function () {
        var close = this.close.getComponent(cc.Sprite)
        close.node.targetOff(close);
        var share = this.share.getComponent(cc.Sprite)
        share.node.targetOff(share);
    },
    touchCloseEvent (event) {
        console.log("touch close");
        var dialog = this.node.parent.getComponent('rankDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.dismiss();
    },
    touchShareEvent (event) {
        console.log("touch share");
        var dialog = this.node.parent.getComponent('rankDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.dismiss();
    },
    // TODO: move these to shared canvas
    setRank: function(rank) {
        this.rank.string = rank;
    },
    setName: function(name) {
        this.nickname.string = name;
    },
    setScore: function(score) {
        this.score.string = score;
    },
    updateScore: function() {
        this.setScore(this.game.scoreMng._score);
    },
    setIcon: function(icon) {
        // TODO: delete this function
        var sprite = this.icon.getComponent(cc.Sprite);
        cc.loader.loadRes(icon, cc.SpriteFrame, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
    },
    setIconUrl: function(iconUrl) {
        console.log("iconUrl", iconUrl);
        var sprite = this.icon.getComponent(cc.Sprite);
        cc.loader.load({url: iconUrl, type: 'jpeg'}, function (err, tex) {
            sprite.spriteFrame.setTexture(tex);
        });
    },

    showRank: function () {
        // TODO: redraw canvas
        console.log("show Rank")
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        console.log(sharedCanvas);
        var tex = new cc.Texture2D();
        tex.initWithElement(sharedCanvas);
        tex.handleLoadedTexture();
        var w = sharedCanvas.width;
        var h = Math.floor(w * 330 / 490);
        var x = 0;
        var y = sharedCanvas.height - h;
        var rect = new cc.Rect(x, y, w, h);
        console.log(rect);
        this.display.spriteFrame = new cc.SpriteFrame(tex, rect);
    },

    show: function () {
        // TODO: update user rank when open dialog
        //this.game.infoMng.getFriendScore();
        this.addTouchEvent();
        this.node.zIndex = 120;
        this.node.x = 375 - 256;  // TODO: why 375
        this.node.y = cc.view.getFrameSize().height - 256;  // TODO: not center
        this.node.opacity = 255;
        this.updateScore();
        this.showRank();
    },

    dismiss: function () {
        this.game.switchGameStatus(GameStatus.PLAYING);
        this.delTouchEvent();
        this.node.zIndex = 0;
        this.node.opacity = 0;
    },

});