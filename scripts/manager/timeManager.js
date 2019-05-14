cc.Class({
  extends: cc.Component,

  properties: {
  },

  init: function (game) {
    this.game = game;
    this.time = 0;
    this.minite = 0;
  },

  stopCounting: function () {
    this.counting = false;
    this.time = 0;
  },

  // 开始游戏计时器
  startCounting: function () {
    this.counting = true;
    this.time = 0;
  },

  update: function (dt) {
    if (this.counting) {
      this.time += dt;
      this.minite = Math.floor(this.time / 60);
    }
    this.game.doAction = false;
    for (var i = 0; i < this.node.children.length; i++) {
      if (this.node.children[i].getNumberOfRunningActions()) {
        this.game.doAction = true;
        break;
      }
    }
  }
});