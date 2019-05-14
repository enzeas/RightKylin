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
        cc.audioEngine.play(this.bgm, true, 0.5);
    },

    playEliminate: function () {
        cc.audioEngine.play(this.eliminate, false, 0.8);
        //this.eliminateBak.play();
    },
});