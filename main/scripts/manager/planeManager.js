var GameStatus = require('gameStatus');
var GamePlane = require('gamePlane');

cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        musicButton: cc.Node,
        rankButton: cc.Node,
        settingButton: cc.Node,
        discussButton: cc.Node,
        serviceButton: cc.Node,
        colorTile: cc.Prefab,
        planePosition: new cc.Vec2(0, 0),
        plane: GamePlane
    },

    init: function (game) {
        this.game = game;
        this.plane.init(game);
        this._moveStep = 0;
        this._moveL = 0;
        this._moveR = 0;
        this.addTouchEvent();
    },

    addWechatButton: function () {
        var size = 64 / 750 * cc.view.getFrameSize().width;
        var clubTop = (cc.view.getFrameSize().height - cc.view.getFrameSize().width) / 2 - size;
        var clubLeft = cc.view.getFrameSize().width / 2 + 208 / 750 * cc.view.getFrameSize().width;
        let clubButton = wx.createGameClubButton({
            type: 'text',
            text: ' ',
            style: {
                left: clubLeft,
                top: clubTop,
                width: size,
                height: size
            }
        })
    },

    addTouchEvent: function () {
        var music = this.musicButton.getComponent(cc.Sprite);
        music.node.on(cc.Node.EventType.TOUCH_END, this.touchMusicEvent, music);
        var rank = this.rankButton.getComponent(cc.Sprite);
        rank.node.on(cc.Node.EventType.TOUCH_END, this.touchRankEvent, rank);
        var setting = this.settingButton.getComponent(cc.Sprite);
        setting.node.on(cc.Node.EventType.TOUCH_END, this.touchSettingEvent, setting);
        var service = this.serviceButton.getComponent(cc.Sprite);
        service.node.on(cc.Node.EventType.TOUCH_END, this.touchServiceEvent, service);
        this.addWechatButton();
    },
    touchMusicEvent (event) {
        var plane = this.node.parent.getComponent('gamePlane');
        plane.game.musicMng.switchMusic();
        if (plane.game.musicMng.play) {
            this.node.opacity = 255;
        } else {
            this.node.opacity = 128;
        }
    },
    touchRankEvent (event) {
        var plane = this.node.parent.getComponent('gamePlane');
        plane.game.showRank();
    },
    touchSettingEvent (event) {
        var plane = this.node.parent.getComponent('gamePlane');
        //plane.game.planeMng.changeSkin("bg/bg_white");
        plane.game.showSetting();
    },
    touchServiceEvent (event) {
        var test;
        wx.openCustomerServiceConversation(test);
    },

    initTmpTile: function() {
        var newTile = cc.instantiate(this.colorTile);
        this.node.addChild(newTile, 100, 'tmpTile');
        this.tile = newTile.getComponent('colorTile');
        this.tile.init(this.game);
        this.tile.setInvisible();
    },

    addTmpTile: function(colorTile) {
        this._moveStep = 0;
        this._moveL = colorTile.item._moveL;
        this._moveR = colorTile.item._moveR;
        this.tile.setAttr(colorTile.item._col, colorTile.item._row, colorTile.item._length, colorTile.item._color);
        this.tile.setVisible();
        this._baseX = this.tile.node.x;
    },

    moveTmpTile: function(event) {
        var touches = event.getTouches();
        var xMove = touches[0].getLocation().x - this._baseX;
        var moveBatch = this.game.materialScale * 288;
        if (xMove > 0) {
            var step = Math.ceil(xMove / moveBatch - 0.25);
            if (step > this._moveR) {
                step = this._moveR;
            }
            this._moveStep = step;
            this.tile.node.x = this._baseX + step * moveBatch;
        } else {
            var step = Math.floor(-xMove / moveBatch + 0.25);
            if (step > this._moveL) {
                step = this._moveL;
            }
            this._moveStep = -step;
            this.tile.node.x = this._baseX - step * moveBatch;
        }
    },

    delTmpTile: function(colorTile) {
        colorTile.moveHorizontal(this._moveStep);
        this.tile.setInvisible();
    },

    changeSkin: function(skinName) {
        var sprite = this.background.getComponent(cc.Sprite);
        cc.loader.loadRes(skinName, cc.SpriteFrame, function (err, spriteFrame) {  // IMPORTANT
            sprite.spriteFrame = spriteFrame.clone();
        });
    },

    flushPlane: function () {
        // 初始化游戏面板大小
        console.log(this.game)
        this.planePosition.x = 375;
        this.planePosition.y = 375 * cc.view.getFrameSize().height / cc.view.getFrameSize().width;
        this.plane.setPlanePos(this.planePosition.x, this.planePosition.y);
        // TODO: move this out
        //this.game.tilesMng.node.removeAllChildren();
        this.initTmpTile();
        this.game.tilesMng.initMap();
        this.game.dialogMng.initDialog();
        this.game.scoreMng.initScore();
        this.game.infoMng.initInfo();
    }

});