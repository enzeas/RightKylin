cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Label,
    },

    init: function (game) {
        this.game = game;
        this._score = 0;
        this._life = 1;
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
    },

    _updateScore: function () {
        this.score.string = this._score;
    }

});