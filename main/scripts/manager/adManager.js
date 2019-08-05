cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function (game) {
        this.game = game;
        this.initAd();
    },
    initAd: function() {
        console.log("ad init");
        this.adShowing = false;
        this.bottomOOB = false;
        this.restartOOB = false;
        this.initBottomBannerAd();
        this.initRestartDialogBannerAd();
    },
    initBottomBannerAd: function() {
        var adWidth = 450;
        var adDist = 25;
        var screenWidth = cc.view.getFrameSize().width;
        var adLeft = (screenWidth - adWidth) / 2;
        var screenHeight = cc.view.getFrameSize().height;
        var adTop = screenHeight / 2 + screenWidth / 2 + adDist;
        var bannerAd = wx.createBannerAd({
            adUnitId: 'adunit-7b9106374ae13bd8',
            adIntervals: 30,
            style: {
                left: adLeft,
                top: adTop,
                width: adWidth
            }
        })
        bannerAd.onError(err => {
            console.log(err)
        })
        bannerAd.onLoad(() => {
            console.log('底部banner加载成功')
            console.log(bannerAd.style)
        })
        bannerAd.onResize(res => {
            bannerAd.style.left = (screenWidth - bannerAd.style.realWidth) / 2;
            this.bottomOOB = false;
            if (bannerAd.style.realHeight + adDist > (screenHeight - screenWidth) / 2) {
                this.bottomOOB = true;
                console.log("bottom banner ad out of boundary")
                this.hideBottomBannerAd();
            }
        })
        bannerAd.hide();
        this.bottomBannerAd = bannerAd;
    },
    showBottomBannerAd: function() {
        if (!this.bottomOOB) {
            this.adShowing = true;
            this.bottomBannerAd.show();
        }
    },
    hideBottomBannerAd: function() {
        this.adShowing = false;
        this.bottomBannerAd.hide();
    },

    initRestartDialogBannerAd: function() {
        var adWidth = 300;
        var adDist = 20;
        var screenWidth = cc.view.getFrameSize().width;
        var adLeft = (screenWidth - adWidth) / 2;
        var screenHeight = cc.view.getFrameSize().height;
        var adTop = screenHeight / 2 + screenWidth / 2 - adDist;
        var bannerAd = wx.createBannerAd({
            adUnitId: 'adunit-3af075386d8ddb96',
            adIntervals: 30,
            style: {
                left: adLeft,
                top: adTop,
                width: adWidth
            }
        })
        bannerAd.onError(err => {
            console.log(err)
        })
        bannerAd.onLoad(() => {
            console.log('复活页banner加载成功')
            console.log(bannerAd.style)
        })
        bannerAd.onResize(res => {
            bannerAd.style.left = (screenWidth - bannerAd.style.realWidth) / 2;
            bannerAd.style.top = screenHeight / 2 + screenWidth / 2 - bannerAd.style.realHeight;
            this.restartOOB = false;
            if (bannerAd.style.realHeight > screenWidth / 4) {
                this.restartOOB = true;
                console.log("restart banner ad out of boundary")
                this.hideBottomBannerAd();
            }
        })
        bannerAd.hide();
        this.restartDialogBannerAd = bannerAd;
    },

    showRestartDialogBannerAd: function(life) {
        if (!this.restartOOB) {
            this.adShowing = true;
            this.restartDialogBannerAd.show();
        }
    },
    hideRestartDialogBannerAd: function() {
        this.adShowing = false;
        this.restartDialogBannerAd.hide();
    }
});