cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            type: cc.AudioClip,
            default: null
        }, 
        eliminate: {
            type: cc.AudioClip,
            default: null
        }
    },

    init: function(game) {
        this.game = game;
        this.play = false;
        this.playMusic();
    },

    switchMusic: function() {
        if (this.play) {
            this.stopMusic();
        } else {
            this.playMusic();
        }
    },

    stopMusic: function () {
        this.play = false;
        cc.audioEngine.stopAll();
    },

    playMusic: function () {
        this.play = true;
        cc.audioEngine.play(this.bgm, true, 0.5);
    },

    playEliminate: function () {
        if (this.play) {
            cc.audioEngine.play(this.eliminate, false, 0.8);
        }
    },
});