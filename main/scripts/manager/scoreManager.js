var GameStatus = require('gameStatus');

cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Label,
    },

    init: function (game) {
        this.game = game;
        this._adScore = 500;
        this.initScore();
    },
    initScore: function() {
        this._score = 0;
        this._life = 1;
        this._level = 0;
    },

    changeColor: function(colorName) {
        if (colorName == "white") {
            this.score.node.color = new cc.Color(255, 255, 255);
        } else if (colorName == "black") {
            this.score.node.color = new cc.Color(0, 0, 0);
        }
        console.log(this.score);
    },

    setLife: function(life) {
        this._life = life;
    },
    loseLife: function() {
        this._life -= 1;
    },

    setScore: function (score) {
      this._score = score;
      this._updateScore();
    },

    addScore: function (score) {
        this._score += score;
        this._updateScore();
        this._updateParam();
        this._showAd();
    },

    revive: function (score) {
        var score = this._score;
        this.game.switchGameStatus(GameStatus.SHOWSTARTBTN);
        this.game.scoreMng.setScore(score);
        this.game.scoreMng.setLife(0);
    },
    restart: function (score) {
        this.game.switchGameStatus(GameStatus.SHOWSTARTBTN);
    },

    _showAd: function() {
        if (this._score > this._adScore && !this.game.adMng.adShowing) {
            this.game.adMng.showBottomBannerAd();
        }
    },

    _updateScore: function () {
        this.score.string = this._score;
        this._level = Math.floor(this._score / 100);
    },

    _updateParam: function () {
        if (this.game.moveDuration > this.game.minMoveDuration) {
            this.game.moveDuration = this.game.initMoveDuration - this.game.moveDurationDecayRate * this._level;
        }
        if (this.game.prob > this.game.minProb) {
            this.game.prob = this.game.initProb - this.game.probDecayRate * this._level;
            this.game.tilesMng.generateProb(this.game.prob);
        }
    }

});