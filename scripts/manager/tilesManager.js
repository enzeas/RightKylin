cc.Class({
    extends: cc.Component,

    properties: {
        colorTile: cc.Prefab,
        squaresSize: new cc.Vec2(256, 256)
    },

    init: function (game) {
        this.game = game;
        this.magicNum = 99;
        this.moveDuration = this.game.moveDuration;
    },

    initMap: function(col, raw) {
        console.log("initMap:", col, raw);
        this.tileItems = [];
        this.tileUuids = [];
        this.rawLines = [];
        this._raw = raw;
        this._col = col;
        this.generateProb();
        for(var y = 0; y < raw; y++) {
            var arr = [];
            var uarr = [];
            var line = []
            for(var x = 0; x < col; x++) {
                var newTile = cc.instantiate(this.colorTile);
                this.node.addChild(newTile, this.magicNum - x);
                var tile = newTile.getComponent('colorTile');
                tile.init(this.game);
                tile.setInvisible();
                tile.setAttr(x, y, 1, Math.floor(Math.random()*6));
                arr.push(tile);
                uarr.push(tile.node.uuid);
                line.push(-this.magicNum);
            }
            this.tileItems.push(arr);
            this.tileUuids.push(uarr);
            this.rawLines.push(line);
        }
        this.addLine();
        //this.test();
    },

    lineCount: function() {
        for (var y = 0; y < this.rawLines.length; y++) {
            var nullLine = true;
            for (var x = 0; x < this.rawLines.length; x++) {
                if (this.rawLines[y][x] >= 0) {
                    nullLine = false;
                    break;
                }
            }
            if (nullLine) {
                return y;
            }
        }
        return this.rawLines.length;
    },

    test: function() {
        var toFall = [
            -99,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99,12,12,32,42,-99,-99,72,-99,13,13,13,43,53,53,53,4,4,24,24,-99,-99,64,64,5,-99,-99,-99,-99,55,55,55,-99,-99,-99,-99,-99,56,56,76,-99,-99,-99,-99,-99,-99,-99,-99
        ]
        for (var i = 0; i < toFall.length; i++) {
            var x = i % this._raw;
            var y = Math.floor(i / this._raw);
            this.rawLines[y][x] = toFall[i];
            if (toFall[i] >= 0) {
                var pX = Math.floor(toFall[i] / 10);
                var pY = toFall[i] % 10;
                //console.log(x, y, pX, pY);
                if (this.tileItems[pY][pX].visible()) {
                    this.tileItems[pY][pX].setTileLength(this.tileItems[pY][pX].item._length + 1);
                } else {
                    this.tileItems[pY][pX].setVisible();
                    this.tileItems[pY][pX].addTouchEvent();
                }
            }
            
        }
        // console.log("rawLines:", this.rawLines);
        this.refresh();
    },

    generateProb: function() {
        // TODO: increase by time
        var p = 0.6
        var q = 1 - p;
        this.prob = p;
        this.probArray = [p * p * p, 3 * p * p * q, 3 * p * q * q, q * q * q]
        this.cumulativeProb = [0, this.probArray[0], this.probArray[0]+ this.probArray[1], 1 - this.probArray[3], 1]
        // console.log(this.cumulativeProb)
    },

    enableTouch: function() {
        console.log("enableTouch")
        for (var y = 0; y < this.tileItems.length; y++) {
            for (var x = 0; x < this.tileItems[y].length; x++) {
                if (this.tileItems[y][x].visible()) {
                    this.tileItems[y][x].addTouchEvent();
                }
            }
        }
    },
    disableTouch: function() {
        console.log("disableTouch")
        for (var y = 0; y < this.tileItems.length; y++) {
            for (var x = 0; x < this.tileItems[y].length; x++) {
                if (this.tileItems[y][x].visible()) {
                    this.tileItems[y][x].delTouchEvent();
                }
            }
        }
    },

    refresh: function() {
        this.scheduleOnce(function () {
            var fall = this.fall();
            if (fall > 0) {
                this.scheduleOnce(function () {
                    var eli = this.eliminate();
                    if (eli > 0) {
                        this.refresh();
                    }
                }, this.moveDuration * 1.1);  // IMPORTANT
            }
        }, this.moveDuration * 1.1);
    },

    fall: function() {
        var fall = -1;
        //console.log("Bfall:", this.rawLines);
        var f = false;
        do {
            f = this.fallOnce();
            fall += 1;
        } while(f);
        //console.log("Afall:", this.rawLines);
        return fall;
    },
    fallOnce: function () {
        for (var y = 0; y < this.rawLines.length; y++) {
            for (var x = 0; x < this.rawLines[y].length; x++) {
                if (this.rawLines[y][x] < 0) {
                    continue; 
                } 
                var pX = Math.floor(this.rawLines[y][x] / 10);
                var pY = this.rawLines[y][x] % 10;
                var step = this.calTileFallStep(pX, pY);
                if (step) {
                    //console.log("calTileFallStep:", pX, pY, this.rawLines[y][x], this.tileItems[y][x].item._length, step)
                    this.moveTileDownByPosStep(pX, pY, step);
                    return true;
                }
            }        
        }
        return false;
    },
    calTileFallStep: function(x, y) {
        var step = 0;
        for (; step < y; step++) {
            var len = this.tileItems[y][x].item._length;
            for (var i = 0; i < len; i++) {
                if (this.rawLines[y - step - 1][x + i] >=0) {
                   return step;
                }
            }
        }
        return step;
    },
    eliminate: function () {
        var eli = -1; 
        //console.log("Beliminate", this.rawLines);
        var e = false;
        do {
            e = this.eliminateOnce();
            eli += 1;
            if (eli) {
                this.game.scoreMng.addScore(10 * eli * eli);
                this.game.musicMng.playEliminate();
            }
        } while(e);
        //console.log("Aeliminate", this.rawLines);
        return eli;
    },
    eliminateOnce: function () {
        for (var y = 0; y < this.rawLines.length; y++) {
            var flag = true;
            for (var x = 0; x < this.rawLines[y].length; x++) {
                if (this.rawLines[y][x] < 0) {
                    flag = false;
                }
            }
            if (flag) {
                for (var x = 0; x < this.rawLines[y].length; x++) {
                    this.delTile(x, y);
                    var len = this.tileItems[y][x].item._length;
                    this.game.scoreMng.addScore(len*len);
                }
                return true;
            }
        }
        return false;
    },

    checkTileMovable: function(colorTile) {
        var id = colorTile.item._id;
        var moveL = 0;
        var moveR = 0;
        var flag = false;
        console.log("checkTileMovable:", this.rawLines);
        for (var y = 0 ; y < this.rawLines.length; ++y) {
            for (var x = 0; x < this.rawLines[y].length; ++x) {
                if (this.rawLines[y][x] == id) {
                    if (x > 0 && this.rawLines[y][x - 1] < 0) {
                        flag = true;
                    }
                    if (x + 1 < this.rawLines[y].length && this.rawLines[y][x+1] < 0) {
                        flag = true;
                    }
                    if (flag) {
                        for (var i = x; i > 0; i--) {
                            if (this.rawLines[y][i - 1] < 0) {
                                moveL += 1;
                            } else {
                                break;
                            }
                        }
                        for (var i = x; i + 1 < this.rawLines[y].length; i++) {
                            if (this.rawLines[y][i + 1] < 0) {
                                moveR += 1;
                            } else {
                                break;
                            }
                        }
                        colorTile.item._movable = true;
                        colorTile.item._moveL = moveL;
                        colorTile.item._moveR = moveR;
                    }
                }
            }
        }
    },

    moveTileHorizontal: function(colorTile, moveStep) {
        //console.log("moveTileHorizontal:", this.rawLines);
        //colorTile.print();
        var x = colorTile.item._col;
        var y = colorTile.item._row;
        var len = colorTile.item._length;
        var color = colorTile.item._color;
        var targetTile = this.tileItems[y][x + moveStep];
        targetTile.setAttr(x + moveStep, y, len, color);
        targetTile.setVisible();
        targetTile.addTouchEvent();
        colorTile.setInvisible();
        colorTile.delTouchEvent();
        //targetTile.print();
        var id = colorTile.item._id;
        var new_id = colorTile.item._id + moveStep * 10;
        for (var y = 0; y < this.rawLines.length; ++y) {
            if (moveStep < 0) {
                for (var x = 0; x < this.rawLines[y].length; ++x) {
                    if (this.rawLines[y][x] == id) {
                        this.rawLines[y][x + moveStep] = new_id;
                        this.rawLines[y][x] = - this.magicNum;
                    }
                }
            } else {
                for (var x = this.rawLines[y].length; x > 0; --x) {
                    if (this.rawLines[y][x - 1] == id) {
                        this.rawLines[y][x - 1 + moveStep] = new_id;
                        this.rawLines[y][x - 1] = - this.magicNum;
                    }
                }
            }
        }
        //console.log("After move Tile:", this.rawLines);
    },
    // TODO: check data boundary
    moveTileUpByPos: function (x, y, step) {
        var id = this.rawLines[y][x] + step;
        var len = this.tileItems[y][x].item._length;
        var color = this.tileItems[y][x].item._color;
        for (var i = 0; i < len; ++i) {
            this.rawLines[y + step][x + i] = id;
            this.rawLines[y][x + i] = -this.magicNum;
            this.tileItems[y + step][x + i].setInvisible();
            this.tileItems[y][x + i].setInvisible();
            this.tileItems[y + step][x + i].delTouchEvent();
            this.tileItems[y][x + i].delTouchEvent();
        }
        this.tileItems[y + step][x].setAttr(x, y + step, len, color);
        this.tileItems[y + step][x].setVisible();
        this.tileItems[y + step][x].addTouchEvent();
        var dist = this.game.materialScale * 288 * step;
        this.tileItems[y + step][x].node.y -= dist;
        var move = cc.moveBy(this.moveDuration, cc.v2(0, dist))
        this.tileItems[y + step][x].node.runAction(move);
    },
    moveTileDownByPosStep: function (x, y, step) {
        var id = this.rawLines[y][x] - step;
        var len = this.tileItems[y][x].item._length;
        var color = this.tileItems[y][x].item._color;
        for (var i = 0; i < len; ++i) {
            this.rawLines[y - step][x + i] = id;
            this.rawLines[y][x + i] = -this.magicNum;
            this.tileItems[y - step][x + i].setInvisible();
            this.tileItems[y][x + i].setInvisible();
            this.tileItems[y - step][x + i].delTouchEvent();
            this.tileItems[y][x + i].delTouchEvent();
        }
        this.tileItems[y - step][x].setAttr(x, y - step, len, color);
        this.tileItems[y - step][x].setVisible();
        this.tileItems[y - step][x].addTouchEvent();
        var dist = this.game.materialScale * 288 * step;
        this.tileItems[y - step][x].node.y += dist;
        var move = cc.moveBy(this.moveDuration, cc.v2(0, -dist))
        this.tileItems[y - step][x].node.runAction(move);
    },
    delTile: function(x, y) {
        if (!this.tileItems[y][x].visible()) {
            return;
        }
        //this.tileItems[y][x].print();
        var len = this.tileItems[y][x].item._length;
        for (var i = 0; i < len; ++i) {
            this.rawLines[y][x + i] = -this.magicNum;
            this.tileItems[y][x + i].setInvisible();
            this.tileItems[y][x + i].delTouchEvent();
        }
        this.tileItems[y][x].setVisible();
        var scale = cc.scaleTo(this.moveDuration, 0.5);
        var action = cc.fadeOut(this.moveDuration);
        this.tileItems[y][x].node.runAction(cc.spawn(scale, action));
    },

    spawnNewTile: function(x, y, len, color) {
        var tile = this.tileItems[y][x];
        tile.setTileColor(color);
        tile.setTileLength(len);
        tile.setVisible(); 
        tile.addTouchEvent();
        //var action = cc.fadeIn(this.moveDuration);
        //tile.node.runAction(action);
    },

    addLine: function () {
        //console.log(this.lineCount());
        if (this.lineCount() == this._raw) {
            this.game.gameOver();
            return;
        }
        if (this.lineCount() < 2) {
            //this.spawnNewLine(); // TODO: fix animiation bug
        }
        this.spawnNewLine();
        this.refresh();
        console.log("After AddLine:", this.rawLines);
        // console.log("lineCount:", this.lineCount());
    },

    spawnNewLine: function() {
        // console.log("BSpawnNewLine:",this.rawLines);
        // move all upper
        for (var y = this.rawLines.length - 2; y >= 0; y--) { // top to bottom
            for (var x = 0; x < this.rawLines[y].length; x++) {
                if (this.rawLines[y][x] >= 0 && this.tileItems[y][x].visible()) {
                    this.moveTileUpByPos(x, y, 1);
                }
            }
        }
        // clear bottom
        for (var x = 0; x < this.rawLines[0].length; x++) {
            this.rawLines[0][x] = -this.magicNum;
            this.tileItems[0][x].setInvisible();
            this.tileItems[0][x].delTouchEvent();
        }
        // console.log("After move SpawnNewLine:",this.rawLines);
        var arr = [];
        var infoArr = []
        var sumLen = 0;
        var maxLen = 8
        while (sumLen < maxLen) {
            var p = Math.random();
            for (var x = this.cumulativeProb.length; x > 0; x--) {
                if (p > this.cumulativeProb[x-1]) {
                    sumLen += x;
                    arr.push(x);
                    break;
                }
            } 
        }
        arr[arr.length-1] += maxLen - sumLen;
        var hidePos = Math.floor(Math.random() * arr.length);
        //console.log(arr, sumLen, hidePos);
        var pos = 0;
        for (var x = 0; x < arr.length; x++) {
            if (x != hidePos) {
                this.spawnNewTile(pos, 0, arr[x], Math.floor(Math.random()*6));
                for (var i = pos; i < pos + arr[x]; i++) {
                    infoArr[i] = 10 * pos;
                }
            } else {
                for (var i = pos; i < pos + arr[x]; i++) {
                    infoArr[i] = -this.magicNum;
                }
            }
            pos += arr[x];
        }
        for (var x = 0; x < this.rawLines[0].length; x++) {
            this.rawLines[0][x] = infoArr[x];
        }
    }
});