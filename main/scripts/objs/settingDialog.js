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
        },
        skin3: {
            default: null,
            type: cc.Node
        }
    },

    init: function (game) {
        this.game = game;
        this.node.opacity = 256;
        var launch = wx.getLaunchOptionsSync();
        //console.log(launch);
        this.showScene = launch.scene;
        var self = this;
        wx.onShow(function(res) {
            self.showScene = res.scene;
            //console.log("onshow", res);
        })
    },

    addTouchEvent: function () {
        var close = this.close.getComponent(cc.Sprite);
        close.node.on(cc.Node.EventType.TOUCH_END, this.touchCloseEvent, close);
        var skin1 = this.skin1.getComponent(cc.Sprite);
        skin1.node.on(cc.Node.EventType.TOUCH_END, this.touchSkin1Event, skin1);
        var skin2 = this.skin2.getComponent(cc.Sprite);
        skin2.node.on(cc.Node.EventType.TOUCH_END, this.touchSkin2Event, skin2);
        var skin3 = this.skin3.getComponent(cc.Sprite);
        if (this.showScene == 1089) {
            skin3.node.opacity = 255;
            skin3.node.on(cc.Node.EventType.TOUCH_END, this.touchSkin3Event, skin3);
        } else {
            skin3.node.opacity = 128;
        }
    },
    delTouchEvent: function () {
        var close = this.close.getComponent(cc.Sprite)
        close.node.targetOff(close);
        var skin1 = this.skin1.getComponent(cc.Sprite);
        skin1.node.targetOff(skin1);
        var skin2 = this.skin2.getComponent(cc.Sprite);
        skin2.node.targetOff(skin2);
        var skin3 = this.skin3.getComponent(cc.Sprite);
        skin3.node.targetOff(skin3);
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
        dialog.changeTheme(0);
        dialog.dismiss();
    },
    touchSkin2Event (event) {
        var dialog = this.node.parent.getComponent('settingDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.changeTheme(1);
        dialog.dismiss();
    },
    touchSkin3Event (event) {
        var dialog = this.node.parent.getComponent('settingDialog')
        if(dialog.game.getGameState() !== GameStatus.DIALOG){
            return;
        }
        dialog.changeTheme(2);
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

    changeTheme: function(themeIndex) {
        var themeArray = [
            {
                tileSkinName: "skin/skin-default",
                planeSkinName: "plane/plane-transparent",
                bgSkinName: "bg/bg_blue",
                scoreColor: "white"
            }, {
                tileSkinName: "skin/skin-rainbow",
                planeSkinName: "plane/plane-white",
                bgSkinName: "bg/bg_rainbow",
                scoreColor: "white"
            }, {
                tileSkinName: "skin/skin-piano",
                planeSkinName: "plane/plane-white",
                bgSkinName: "bg/bg_piano",
                scoreColor: "black"
            },
        ]
        this.game.tilesMng.changeSkin(themeArray[themeIndex].tileSkinName);
        this.game.planeMng.tile.changeSkin(themeArray[themeIndex].tileSkinName);
        this.game.planeMng.plane.changeSkin(themeArray[themeIndex].planeSkinName);
        this.game.planeMng.changeSkin(themeArray[themeIndex].bgSkinName);
        this.game.scoreMng.changeColor(themeArray[themeIndex].scoreColor);
    },
});