var GameStatus = require('gameStatus');
var PlaneManager = require('planeManager');
var TilesManager = require('tilesManager');
var ScoreManager = require('scoreManager');
var DialogManager = require('dialogManager');
var TimeManager = require('timeManager');
var MusicManager = require('musicManager');
var InfoManager = require('infoManager');
var AdManager = require('adManager');


cc.Class({
    extends: cc.Component,

    properties: {
        planeMng: PlaneManager,
        tilesMng: TilesManager,
        scoreMng: ScoreManager,
        dialogMng: DialogManager,
        timeMng: TimeManager,
        musicMng: MusicManager,
        infoMng: InfoManager,
        adMng: AdManager
    },

    onLoad: function () {
        // config
        this.materialScale = 0.3125;
        this.recoveryTime = 0.5;
        this.initMoveDuration = 0.5;
        this.minMoveDuration = 0.1;
        this.moveDuration = this.initMoveDuration;
        this.moveDurationDecayRate = 0.01;
        this.initProb = 0.6;
        this.minProb = 0.01;
        this.prob = this.initProb;
        this.probDecayRate = 0.005;
        this.doAction = false;
        // init
        this.planeMng.init(this);
        this.tilesMng.init(this);
        this.scoreMng.init(this);
        this.dialogMng.init(this);
        this.timeMng.init(this);
        this.musicMng.init(this);
        this.infoMng.init(this);
        this.adMng.init(this);
        this.switchGameStatus(GameStatus.SHOWSTARTBTN);
    },

    getGameState: function () {
        return this._gameStatus;
    },

    switchGameStatus: function (status) {
        this._gameStatus = status;
        switch (status) {
            case GameStatus.SHOWSTARTBTN:
                console.log('SHOWSTARTBTN');
                this.startGame();
                break;            
            case GameStatus.PLAYING: // 游戏开始，开始计时
                console.log('PLAYING');
                // this.timeMng.oneSchedule();
                break;
            case GameStatus.GAMEOVER:
                console.log('GAMEOVER');
                this.switchGameStatus(GameStatus.DIALOG);
                break;
            case GameStatus.DIALOG:
                console.log('DIALOG');
                break;
            default:
                break;
        }
    },

    startGame: function () {
        this.planeMng.flushPlane();
        this.scoreMng.setScore(0);
        this.timeMng.startCounting();
        this.switchGameStatus(GameStatus.PLAYING);
    },

    gameOver: function () {
        this.switchGameStatus(GameStatus.GAMEOVER);
        this.tilesMng.hideAllTiles();
        this.timeMng.stopCounting();
        this.infoMng.uploadScoreNew();
        this.dialogMng.showRestart();
    },

    showRank: function() {
        this.switchGameStatus(GameStatus.DIALOG);
        this.timeMng.stopCounting();
        this.dialogMng.showRank();
    },

    showSetting: function() {
        this.switchGameStatus(GameStatus.DIALOG);
        this.timeMng.stopCounting();
        this.dialogMng.showSetting();
    },
});
