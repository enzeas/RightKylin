var GameStatus = require('gameStatus');
var PlaneManager = require('planeManager');
var TilesManager = require('tilesManager');
var ScoreManager = require('scoreManager');
var DialogManager = require('dialogManager');
var TimeManager = require('timeManager');
var MusicManager = require('musicManager');


cc.Class({
    extends: cc.Component,

    properties: {
        planeMng: PlaneManager,
        tilesMng: TilesManager,
        scoreMng: ScoreManager,
        dialogMng: DialogManager,
        timeMng: TimeManager,
        musicMng: MusicManager
    },

    onLoad: function () {
        this.materialScale = 0.3125;
        this.moveDuration = 0.6;
        this.recoveryTime = 2;
        this.doAction = false;
        this.planeMng.init(this);
        this.tilesMng.init(this);
        this.scoreMng.init(this);
        this.dialogMng.init(this);
        this.timeMng.init(this);
        this.musicMng.init(this);
        //this.gameOver();
        this.switchGameStatus(GameStatus.SHOWSTARTBTN);
    },

    getGameState: function () {
        return this._gameStatus;
    },

    switchGameStatus: function (status) {
        this._gameStatus = status;
        switch (status) {
            case GameStatus.SHOWSTARTBTN:
                cc.log('SHOWSTARTBTN');
                this.startGame();
                break;            
            case GameStatus.PLAYING: // 游戏开始，开始计时
                cc.log('PLAYING');
                // this.timeMng.oneSchedule();
                break;
            case GameStatus.GAMEOVER:
                cc.log('GAMEOVER');
                this.switchGameStatus(GameStatus.DIALOG);
                break;
            case GameStatus.DIALOG:
                cc.log('DIALOG');
                break;
            default:
                break;
        }
    },

    startGame: function () {
        // 显示开始按钮，关闭图层，激活当前节点事件监听
        this.planeMng.flushPlane();
        this.scoreMng.setScore(0);
        this.timeMng.startCounting();
        this.switchGameStatus(GameStatus.PLAYING);
    },

    gameOver: function () {
        this.switchGameStatus(GameStatus.GAMEOVER);
        this.timeMng.stopCounting();
        this.dialogMng.showRestart();
    }, 

    showRank: function() {
        this.switchGameStatus(GameStatus.DIALOG);
        this.timeMng.stopCounting();
        this.dialogMng.showRank();
    }
});
