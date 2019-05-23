cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Label,
    },

    init: function (game) {
        this.game = game;
        this.initScore();
    },
    initScore: function() {
        this._score = 0;
        this._life = 1;
        this._level = 0;
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
    },

    _updateScore: function () {
        this.score.string = this._score;
        this._level = Math.floor(this._score / 100);
    },

    _updateParam: function () {
        if (this.game.moveDuration > 0.1) {
            this.game.moveDuration = 0.4 - 0.01 * this._level;
        }
        if (this.game.prob > 0.01) {
            this.game.prob = 0.6 - 0.005 * this._level;
            this.game.tilesMng.generateProb(this.game.prob);
        }
    }

});