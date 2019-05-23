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

    updateScoreNew: function() {
        window.wx.postMessage({
            messageType: 0,
            score: this.game.scoreMng._score
        });
    },
    updateScore: function () {
        var score = this.game.scoreMng._score.toString();  // IMPORTANT
        var name = this._userInfo.nickName;
        var icon = this._userInfo.avatarUrl;
        var data = [{"key": "score", "value": score}, {"key": "username", "value": name}, {"key": "icon", "value": icon}];
        window.wx.setUserCloudStorage({
            "KVDataList": data,
            "success": function() {
                console.log("update score", score);
            },
            "fail": function() {
                console.log("update score failed");
            },
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
        rankDialog.setName(userInfo.nickName);
        console.log("icon:", userInfo.avatarUrl);
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