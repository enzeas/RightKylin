var RestartDialog = require('restartDialog');
var RankDialog = require('rankDialog');

cc.Class({
    extends: cc.Component,

    properties: {
        restartDialog: cc.Prefab,
        rankDialog: cc.Prefab
    },

    init: function (game) {
        this.game = game;
    },
    initDialog: function() {
        console.log("fuck")
        this.initRestartDialog();
                console.log("fuck")

        this.initRankDialog();
                console.log("fuck")

    },

    initRestartDialog: function () {
        var restartDialog = cc.instantiate(this.restartDialog);
        this.node.addChild(restartDialog);
        this._restartDialog = restartDialog.getComponent('restartDialog');
        this._restartDialog.init(this.game);
    },
    initRankDialog: function () {
        var rankDialog = cc.instantiate(this.rankDialog);
        this.node.addChild(rankDialog);
        this._rankDialog = rankDialog.getComponent('rankDialog');
        this._rankDialog.init(this.game);
    },

    showRestart: function() {
        this.initRestartDialog();
        this._restartDialog.show();
    },

    showRank: function () {
        this.initRankDialog();
        this._rankDialog.show();
    },

});