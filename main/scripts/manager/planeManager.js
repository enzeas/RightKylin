var GameStatus = require('gameStatus');
var GamePlane = require('gamePlane');

cc.Class({
    extends: cc.Component,

    properties: {
        rankButton: cc.Node,
        colorTile: cc.Prefab,
        planeSize: new cc.Vec2(8, 8),
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

    addTouchEvent: function () {
        var rank = this.rankButton.getComponent(cc.Sprite);
        rank.node.on(cc.Node.EventType.TOUCH_END, this.touchRankEvent, rank);
    },
    touchRankEvent (event) {
        var plane = this.node.parent.getComponent('gamePlane');
        plane.game.showRank();
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

    flushPlane: function () {
        // 初始化游戏面板大小
        console.log(this.game)
        var size = cc.view.getFrameSize().width * 730 / 750;
        this.planePosition.x = cc.view.getFrameSize().width - size;
        this.planePosition.y = cc.view.getFrameSize().height - size;
        this.plane.setPlanePos(this.planePosition.x, this.planePosition.y);
        // TODO: move this out
        this.game.tilesMng.node.removeAllChildren();
        this.initTmpTile();
        this.game.tilesMng.initMap(this.planeSize.x, this.planeSize.y);
        this.game.dialogMng.initDialog();
        this.game.scoreMng.initScore();
        this.game.infoMng.initInfo();
    }

});