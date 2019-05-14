var GameStatus = require('gameStatus');

cc.Class({
    extends: cc.Component,

    properties: {
        color_l: {
            default: null,
            type: cc.Node
        },
        color_r: {
            default: null,
            type: cc.Node
        },
    },

    init: function (game) {
        this.game = game;
        this.game = game;
        this.colorList = "bcoprv";
        this.item = {
            id: -1,
            row: -1,  // 位置（行）y
            col: -1,  // 位置（列）x
            length: 1,  // 长度
            color: 0,  // 颜色
            moveL: 0,  // 能够向左移动的距离
            moveR: 0,  // 能够向右移动的距离
            movable: false
        };
        this.node.opacity = 0;
        this.setMovable(false, 0, 0);
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
        this.colorTile();
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
        this.colorTile();
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
        this.game.tilesMng.addLine();
    },

    colorTile: function() {
        var spriteM = this.getComponent(cc.Sprite);
        var spriteL = this.color_l.getComponent(cc.Sprite);
        var spriteR = this.color_r.getComponent(cc.Sprite);
        var color = this.colorList[this.item._color];
        var frameM = "colors/color_" + color + "_m";
        var frameL = "colors/color_" + color + "_l";
        var frameR = "colors/color_" + color + "_r";
        cc.loader.loadRes(frameM, cc.SpriteFrame, function (err, spriteFrame) {  // IMPORTANT
            spriteM.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(frameL, cc.SpriteFrame, function (err, spriteFrame) {
            spriteL.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(frameR, cc.SpriteFrame, function (err, spriteFrame) {
            spriteR.spriteFrame = spriteFrame;
        });
    },

    drawTile: function () {
        var midWidth = 32 * (9 * this.item._length - 7);
        this.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.CUSTOM;  // IMPORTANT
        this.node.width = midWidth;
        this.node.scale = this.game.materialScale;
        this.color_l.x = - 48 - midWidth / 2;
        this.color_r.x =   48 + midWidth / 2;
        //console.log("after cal:", this.node.width, this.color_l.x, this.color_l.width, this.color_r.x, this.color_r.width)
    },

    placeTile: function() {
        var posY = this.game.planeMng.planePosition.y + this.game.materialScale * 32 * (8 * (this.item._row + 0.5) + (this.item._row + 1));
        var posX = this.game.planeMng.planePosition.x + this.game.materialScale * 32 * (8 * (this.item._col + this.item._length / 2 ) + (this.item._col + (this.item._length+ 1) / 2));
        // console.log("tile pos:", this.item._col, this.item._row, this.item._length, posX, posY);
        this.node.setPosition(cc.v2(posX, posY));
    },

    print: function () {
        cc.log('uuid ' + this.node.uuid + ' id ' + this.item._id + ' pos[' + this.item._row + '][' + this.item._col + '] color [' + this.item._color + '] length [' + this.item._length + '] opacity [' + this.node.opacity + ']');
    }
});
