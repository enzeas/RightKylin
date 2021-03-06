var GameStatus = require('gameStatus');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function (game) {
        this.game = game;
        this.item = {
            id: -1,
            row: -1,  // 位置（行）y
            col: -1,  // 位置（列）x
            length: 1,  // 长度
            g: 0,  // 颜色
            moveL: 0,  // 能够向左移动的距离
            moveR: 0,  // 能够向右移动的距离
            movable: false
        };
        this.node.opacity = 0;
        this.setMovable(false, 0, 0);
        this.loadSkin();
    },
    addTouchEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);  // IMPORTANT
    },
    delTouchEvent: function () {
        this.node.targetOff(this);
    },
    touchStartEvent (event) {
        if(this.game.getGameState() !== GameStatus.PLAYING || this.game.doAction){
            return;
        }
        this.checkMovable();
        if (this.item._movable == false) {
            return;
        }
        this.node.opacity = 128;
        this.game.planeMng.addTmpTile(this);
    },
    touchMoveEvent (event) {
        if(this.game.getGameState() !== GameStatus.PLAYING || this.game.doAction){
            return;
        }
        if (this.item._movable == false) {
            return;
        }
        this.game.planeMng.moveTmpTile(event);
    },
    touchEndEvent (event) {
        if(this.game.getGameState() !== GameStatus.PLAYING || this.game.doAction){
            return;
        }
        if (this.item._movable == false) {
            return;
        }
        this.node.opacity = 255;
        this.game.planeMng.delTmpTile(this);
        //this.game.tilesMng.enableTouch();
    },

    // attr set & get
    setTilePlace: function (col, row) {
        this.item._col = col;
        this.item._row = row;
        this.placeTile();
    },
    setTileLength: function (len) {
        this.item._length = len;
        this.drawTile();
        this.placeTile();
    },
    setTileColor: function (color) {
        this.item._color = color;
        this.drawTile();
    },
    setId: function (id) {
        this.item._id = id;
    },
    getId: function () {
        return this.item._id;
    },
    setMovable: function (movable, moveL, moveR) {
        this.item._movable = movable;
        this.item._moveL = moveL;
        this.item._moveR = moveR;
    },
    setAttr: function(x, y, len, color) {  // IMPORTANT: init order
        this.setTileColor(color);
        this.setTileLength(len);
        this.setTilePlace(x, y);
        this.setId(10 * x + y);
    },
    setVisible: function() {
        this.node.opacity = 255;
        this.drawTile();
        this.placeTile();
    },
    setInvisible: function() {
        this.node.opacity = 0;
    },
    visible: function() {
        return this.node.opacity === 255;
    },

    checkMovable: function() {
        this.game.tilesMng.checkTileMovable(this);
        this.print();
        console.log("move info:", this.item._movable, this.item._moveL, this.item._moveR);
    },
    // animation
    moveHorizontal: function (moveStep) {
        if (moveStep == 0) {
            return;
        }
        this.game.tilesMng.moveTileHorizontal(this, moveStep);
        this.game.tilesMng.refresh();
        this.game.tilesMng.spawnLines();
    },

    loadSkin: function () {
        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = sprite.spriteFrame.clone();  // IMPORTANT
    },

    changeSkin: function(skinName) {
        var sprite = this.getComponent(cc.Sprite);
        var startArr = [0, 128, 400, 816];
        var self = this;
        cc.loader.loadRes(skinName, cc.SpriteFrame, function (err, spriteFrame) {  // IMPORTANT
            sprite.spriteFrame = spriteFrame.clone();
            sprite.spriteFrame.setRect(new cc.Rect(startArr[self.item._length - 1], self.item._color * 128, 16 * (9 * self.item._length - 1), 128));
        });
    },

    drawTile: function () {
        var sprite = this.getComponent(cc.Sprite);
        var midWidth = 32 * (9 * this.item._length - 1);
        var startArr = [0, 128, 400, 816];
        var rect = new cc.Rect(startArr[this.item._length-1], this.item._color * 128, midWidth/2, 128);
        sprite.spriteFrame.setRect(rect);
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;  // IMPORTANT
        this.node.width = midWidth;
        this.node.scale = this.game.materialScale;
    },

    placeTile: function() {
        var posY = this.game.planeMng.planePosition.y - 375 + this.game.materialScale * 32 * (1 + 8 * (this.item._row + 0.5) + (this.item._row + 1));
        var posX = this.game.materialScale * 32 * (1 + 8 * (this.item._col + this.item._length / 2 ) + (this.item._col + (this.item._length + 1) / 2));
        // console.log("tile pos:", this.item._col, this.item._row, this.item._length, posX, posY);
        this.node.setPosition(cc.v2(posX, posY));
    },

    print: function () {
        console.log('uuid ' + this.node.uuid + ' id ' + this.item._id + ' pos[' + this.item._row + '][' + this.item._col + '] position [' + this.node.getPosition() + '] color [' + this.item._color + '] length [' + this.item._length + '] opacity [' + this.node.opacity + ']');
    }
});
