cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
    	cc.director.preloadScene("game");
    	this.scheduleOnce(function () {
    		cc.director.loadScene("game");
        }, 1);
        
    },
});
