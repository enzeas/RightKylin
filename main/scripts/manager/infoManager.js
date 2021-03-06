cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function (game) {
        this.game = game;
        this.initInfo();
    },
    initInfo: function() {
        this.getUserInfo();
        this.getFriendScore();
    },

    uploadScore: function() {
        window.wx.postMessage({
            messageType: 0,
            score: this.game.scoreMng._score
        });
    },
    
    getFriendScore: function() {
        window.wx.postMessage({
            messageType: 1,
            messageDetail: "fuck"
        });
    },

    setInfo: function(userInfo) {
        this._userInfo = userInfo;
        var rankDialog = this.game.dialogMng._rankDialog;
        console.log("userInfo", userInfo);
        rankDialog.setName(userInfo.nickName);
        rankDialog.setIconUrl(userInfo.avatarUrl);
    },

    getUserInfo: function() {
        var that = this;
        var sysInfo = window.wx.getSystemInfoSync();
        var width = sysInfo.screenWidth;
        var height = sysInfo.screenHeight;
        window.wx.getSetting({
            success (res) {
                if (res.authSetting["scope.userInfo"]) {
                    window.wx.getUserInfo({
                        success(res){
                            that.setInfo(res.userInfo);
                        }
                    });
                } else {
                    var button = window.wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: width,
                            height: height,
                            backgroundColor: '#00000000',//最后两位为透明度
                            color: '#ffffff',
                            fontSize: 20,
                            textAlign: "center",
                            lineHeight: height,
                        }
                    });
                    button.onTap((res) => {
                        if (res.userInfo) {
                            that.setInfo(res.userInfo);
                            button.destroy();
                        }else {
                            console.log("refuse", res);
                        }
                    });
                }
            }
        });
    }
});