cc.Class({
    extends: cc.Component,

    properties: {
        rank: cc.Label,
        icon: cc.Node,
        nickname: cc.Label,
        score: cc.Label
    },

    start() {
        this.maxLen = 5;
        console.log("open-data-start")
        window.wx.onMessage(data => {
            cc.log("message from main area：", data)
            if (data.messageType == 0) {
                console.log("0");
                this.submitScore(data.score);
            } else if (data.messageType == 1) {
                console.log("1");
                this.fetchFriendData();
            }
        });
    },
    submitScore(score) {
        window.wx.getUserCloudStorage({
            keyList: ["score"],
            success: function (getres) {
                console.log('getUserCloudStorage', 'success', getres)
                if (getres.KVDataList.length != 0) {
                    if (getres.KVDataList[0].value > score) {
                        console.log("not new record");
                        return;
                    }
                }
                window.wx.setUserCloudStorage({
                    "KVDataList": [{"key": "score", "value": "" + score}],
                    success: function (res) {
                        console.log('setUserCloudStorage', 'success', res)
                    },
                    fail: function (res) {
                        console.log('setUserCloudStorage', 'fail')
                    },
                    complete: function (res) {
                        console.log('setUserCloudStorage', 'ok')
                    }
                });
            },
            fail: function (res) {
                console.log('getUserCloudStorage', 'fail')
            },
            complete: function (res) {
                console.log('getUserCloudStorage', 'ok')
            }
        });
    },
    fetchFriendData() {
        var that = this;
        console.log("fetch friend data");
        wx.getFriendCloudStorage({
            keyList: ["score", "username", "icon"],
            success: res => {
                console.log("wx.getFriendCloudStorage success", res);
                that.setRankInfo(res.data);
            },
            fail: res => {
                console.log("wx.getFriendCloudStorage fail", res);
            },
        });
    },
    
    fetchGroupFriendData(shareTicket) {
        console.log("fetch group friend data");
    },
    setRankInfo: function (friendData) {
        //var defaultUrl = "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep6Qck9h29Me243wTHonhzHDKQ9wd1FN6AnqBDhUYwBJnOrpaoQlWvia0IoRJH37DAF2tWQbWcQFNg/132";
        var defaultUrl = "";
        var rankInfo = [{"name": "尊贵的小可爱", "icon": defaultUrl, "score": 2000},
                        {"name": "英勇的小可爱", "icon": defaultUrl, "score": 1000},
                        {"name": "谦虚的小可爱", "icon": defaultUrl, "score": 500},
                        {"name": "平静的小可爱", "icon": defaultUrl, "score": 200},
                        {"name": "迷茫的小可爱", "icon": defaultUrl, "score": 100}]
        for (var i = 0; i < friendData.length; i++) {
            rankInfo.push({"name": friendData[i].nickname, "icon": friendData[i].avatarUrl, "score": parseInt(friendData[i].KVDataList[0].value)});
        }
        rankInfo = rankInfo.sort(function(a, b){return b.score - a.score});
        console.log(rankInfo);
        var _names = this.nickname.node.children;
        var _scores = this.score.node.children;
        for (var i = 0; i < this.maxLen; i++) {
            _names[i].getComponent(cc.Label).string = rankInfo[i].name;
            _scores[i].getComponent(cc.Label).string = rankInfo[i].score;
        }
        try {
            var icon0 = this.icon.children[0].getComponent(cc.Sprite);
            cc.loader.load({url: rankInfo[0].icon, type: 'jpeg'}, function (err, tex) {
                icon0.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            });
            var icon1 = this.icon.children[1].getComponent(cc.Sprite);
            cc.loader.load({url: rankInfo[1].icon, type: 'jpeg'}, function (err, tex) {
                icon1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            });
            var icon2 = this.icon.children[2].getComponent(cc.Sprite);
            cc.loader.load({url: rankInfo[2].icon, type: 'jpeg'}, function (err, tex) {
                icon2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            });
            var icon3 = this.icon.children[3].getComponent(cc.Sprite);
            cc.loader.load({url: rankInfo[3].icon, type: 'jpeg'}, function (err, tex) {
                icon3.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            });
            var icon4 = this.icon.children[4].getComponent(cc.Sprite);
            cc.loader.load({url: rankInfo[4].icon, type: 'jpeg'}, function (err, tex) {
                icon4.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            });
        } catch (err) {
            console.log(err);
        }
        
    }
});