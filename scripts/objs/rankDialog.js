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
        score: cc.Label
    },

    init: function (game) {
        this.game = game;
        this.maxLen = 5;
        this.node.opacity = 0;
        this.setName('我是小可爱');
        this.setIcon();
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
        this.score.string = this.game.scoreMng._score;
    },
    setRanks: function (ranks) {
        var _ranks = this.rank.node.children;
        for (var i = 0; i < this.maxLen; i++) {
            if (i < ranks.length) {
                _ranks[i].getComponent(cc.Label).string = ranks[i];
            } else {
                _ranks[i].getComponent(cc.Label).string = '';
            }
        }
    },
    setNames: function (names) {
        var _names = this.nickname.node.children;
        for (var i = 0; i < this.maxLen; i++) {
            if (i < names.length) {
                _names[i].getComponent(cc.Label).string = names[i];
            } else {
                _names[i].getComponent(cc.Label).string = '';
            }
        }
    },
    setScores: function (scores) {
        var _scores = this.score.node.children;
        for (var i = 0; i < this.maxLen; i++) {
            if (i < scores.length) {
                _scores[i].getComponent(cc.Label).string = scores[i];
            } else {
                _scores[i].getComponent(cc.Label).string = '';
            }
        }
    },
    setIcon: function(icon) {
        var sprite = this.icon.getComponent(cc.Sprite);
        var frame = "bomb";
        cc.loader.loadRes(frame, cc.SpriteFrame, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
    },
    setIcons: function(icons) {
        var _icons = this.icon.children;
        // call back will fail in a loop
        for (var i = 0; i < this.maxLen; i++) {
            var icon = this.icon.children[i].getComponent(cc.Sprite);
            if (i < icons.length) {                
                //cc.loader.loadRes(icons[i], cc.SpriteFrame, function (err, spriteFrame) {
                //    icon.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                //});
                icon.node.opacity = 255;
            } else {
                icon.node.opacity = 0;
            }
        }
        if (icons.length > 0) {
            var icon0 = this.icon.children[0].getComponent(cc.Sprite);
            cc.loader.loadRes(icons[0], cc.SpriteFrame, function (err, spriteFrame) {
                icon0.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        if (icons.length > 1) {
            var icon1 = this.icon.children[1].getComponent(cc.Sprite);
            cc.loader.loadRes(icons[1], cc.SpriteFrame, function (err, spriteFrame) {
                icon1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        if (icons.length > 2) {
            var icon2 = this.icon.children[2].getComponent(cc.Sprite);
            cc.loader.loadRes(icons[2], cc.SpriteFrame, function (err, spriteFrame) {
                icon2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        if (icons.length > 3) {
            var icon3 = this.icon.children[3].getComponent(cc.Sprite);
            cc.loader.loadRes(icons[3], cc.SpriteFrame, function (err, spriteFrame) {
                icon3.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        if (icons.length > 4) {
            var icon4 = this.icon.children[4].getComponent(cc.Sprite);
            cc.loader.loadRes(icons[4], cc.SpriteFrame, function (err, spriteFrame) {
                icon4.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    },  

    setAttr: function(rank, icon, name, score) {
        this.setName(name);
    },

    show: function () {
        this.addTouchEvent();
        this.node.zIndex = 120;
        this.node.x = cc.view.getFrameSize().width;// - 512 / 2;
        this.node.y = cc.view.getFrameSize().height;// - 512 / 2;
        this.node.opacity = 255;
        this.updateScore();
        this.setRanks([1,2,3]);
        this.setNames(['尊贵的小可爱','勇敢的小可爱','谦虚的小可爱']);
        this.setScores([213,190,23]);
        this.setIcons(['bomb', 'bomb', 'bomb']);
    },

    dismiss: function () {
        this.game.switchGameStatus(GameStatus.PLAYING);
        this.delTouchEvent();
        this.node.zIndex = 0;
        this.node.opacity = 0;
        // this._doEndAnim();
    },

    _doStartAnim: function () {},

    _doEndAnim: function () {

    },

});