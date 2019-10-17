class UCMapManager extends egret.EventDispatcher {
    private static _instance:UCMapManager;

    public static getInstance() {
        if (!this._instance) this._instance = new UCMapManager();
        return this._instance;
    }

    public getMapTime = 0
    public mapList
    public pkMapData

    public getMapByID(id,fromList?){
        if(!fromList && this.pkMapData && this.pkMapData._id == id)
            return this.pkMapData
        if(!this.mapList)
            return null;
        for(var i=0;i<this.mapList.length;i++)
        {
            if(this.mapList[i]._id == id)
                return this.mapList[i]
        }
        return null;
    }

    public deleteMapByID(id){
        if(!this.mapList)
            return null;
        for(var i=0;i<this.mapList.length;i++)
        {
            if(this.mapList[i]._id == id)
            {
                this.mapList.splice(i,1);
                return true;
            }
        }
    }

    //取地图列表
    public getMapData(id=0,fun?){
        if(!id && this.mapList)
        {
            fun && fun();
            return;
        }
        var wx = window['wx'];
        if(!wx)
            return;
        Net.getInstance().addLoading();
        wx.cloud.callFunction({      //取玩家openID,
            name: 'getMapData',
            data:{
                id:id,
                time:TM_wx4.now() - 48*3600
            },
            complete: (res) => {
                Net.getInstance().removeLoading();
                if(id)
                {
                    this.pkMapData = res.result.search.data[0];
                }
                else
                {
                    this.getMapTime = TM_wx4.now();
                    this.mapList = res.result.self.data.concat(res.result.other.data)
                }
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
        wx.cloud.callFunction({//取玩家openID,
            name: 'pkMap',
            data:{
                id:id,
                coin:coin,
            },
            complete: (res) => {
                var map = this.getMapByID(id);
                if(map)
                {
                    map.coin += coin;
                    EM_wx4.dispatchEventWith(GameEvent.client.UCMAP_RENEW);
                }
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
                obj._id = res.result._id
                this.mapList.unshift(obj);
                EM_wx4.dispatchEventWith(GameEvent.client.UCMAP_CHANGE);
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
                coin = Math.floor(coin*PKManager.getInstance().getCoinRate())
                UM_wx4.addCoin(coin);
                MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(coin,2),0xFFFF00),1000)
                this.deleteMapByID(id);
                EM_wx4.dispatchEventWith(GameEvent.client.UCMAP_CHANGE);
                fun && fun();
            },
            fail:()=>{
                MyWindow.Alert('领取失败')
                Net.getInstance().removeLoading();
            }
        })
    }
}