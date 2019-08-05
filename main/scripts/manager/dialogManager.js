var RestartDialog = require('restartDialog');
var RankDialog = require('rankDialog');
var SettingDialog = require('settingDialog');

cc.Class({
    extends: cc.Component,

    properties: {
        restartDialog: cc.Prefab,
        rankDialog: cc.Prefab,
        settingDialog: cc.Prefab
    },

    init: function (game) {
        this.game = game;
        this.initDialog();
    },
    initDialog: function() {
        this.initRestartDialog();
        this.initRankDialog();
        this.initSettingDialog();
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
    initSettingDialog: function () {
        var settingDialog = cc.instantiate(this.settingDialog);
        this.node.addChild(settingDialog);
        this._settingDialog = settingDialog.getComponent('settingDialog');
        this._settingDialog.init(this.game);
    },

    showRestart: function() {
        this._restartDialog.show();
    },
    showRank: function () {
        this._rankDialog.show();
    },
    showSetting: function () {
        this._settingDialog.show();
    },

});