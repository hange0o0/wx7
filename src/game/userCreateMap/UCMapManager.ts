class UCMapManager extends egret.EventDispatcher {
    private static _instance:UCMapManager;

    public static getInstance() {
        if (!this._instance) this._instance = new UCMapManager();
        return this._instance;
    }

    public getMapTime
    public mapList

    //取地图列表
    public getMapData(id=0,fun?){
        var wx = window['wx'];
        if(!wx)
            return;
        Net.getInstance().addLoading();
        wx.cloud.callFunction({      //取玩家openID,
            name: 'getMapData',
            data:{
                id:id,
            },
            complete: (res) => {
                Net.getInstance().removeLoading();
                console.log(res)
                fun && fun();
            },
            fail:()=>{
                MyWindow.Alert('自定义地图拉取失败')
                Net.getInstance().removeLoading();
            }
        })
    }

    //PK指定地图
    public pkMap(id,coin){
        var wx = window['wx'];
        if(!wx)
            return;
        wx.cloud.callFunction({      //取玩家openID,
            name: 'pkMap',
            data:{
                id:id,
                coin:coin,
            },
            complete: (res) => {

            }
        })
    }

    //保存数据
    public saveData(obj,fun?){
        var wx = window['wx'];
        if(!wx)
            return;
        Net.getInstance().addLoading();
        wx.cloud.callFunction({      //取玩家openID,
            name: 'saveData',
            data:{
                data:obj,
            },
            complete: (res) => {
                Net.getInstance().removeLoading();
                fun && fun();
            },
            fail:()=>{
                MyWindow.Alert('上传地图失败')
                Net.getInstance().removeLoading();
            }
        })
    }

    //领取奖励
    public getAward(id,fun?){
        var wx = window['wx'];
        if(!wx)
            return;
        Net.getInstance().addLoading();
        wx.cloud.callFunction({      //取玩家openID,
            name: 'getAward',
            data:{
                id:id,
            },
            complete: (res) => {
                Net.getInstance().removeLoading();
                if(res.result.fail){
                    MyWindow.Alert('领取失败')
                    return;
                }
                var coin = res.result.data[0].coin;
                UM_wx4.addCoin(coin);
                MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(coin,2),0xFFFF00),1000)
                fun && fun();
            },
            fail:()=>{
                MyWindow.Alert('领取失败')
                Net.getInstance().removeLoading();
            }
        })
    }
}