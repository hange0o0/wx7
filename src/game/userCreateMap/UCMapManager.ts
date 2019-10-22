class UCMapManager extends egret.EventDispatcher {
    private static _instance:UCMapManager;

    public static getInstance() {
        if (!this._instance) this._instance = new UCMapManager();
        return this._instance;
    }

    public getMapTime = 0
    public mapList
    public pkMapData
    public lastWinList//记最近10次

    public constructor(){
        super();

    }

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
        if(!this.lastWinList)
            this.lastWinList = SharedObjectManager_wx4.getInstance().getMyValue('lastWinList') || []
        if(!id && this.mapList)
        {
            fun && fun();
            return;
        }

        if(!Config.isWX)
        {
            this.getMapDataPHP(id,fun);
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
                    this.resetMapList();
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

    private resetMapList(){
        for(var i=0;i<this.mapList.length;i++)
        {
            var mapData = this.mapList[i]
            if(mapData.gameid != UM_wx4.gameid && this.lastWinList.indexOf(mapData._id) != -1)//已挑战完成
            {
                this.mapList.splice(i,1);
                i--;
                continue;
            }
            mapData.coin = Math.ceil(mapData.coin);
            if(mapData.coin < 10)
            {
                mapData.coin = 10
            }
        }
    }

    //PK指定地图
    public pkMap(id,coin){
        if(!Config.isWX)
        {
            this.pkMapPHP(id,coin);
            return;
        }

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
                this.onPKMap(id,coin)
            }
        })
    }

    private onPKMap(id,coin){
        var map = this.getMapByID(id);
        if(map)
        {
            console.log(map);
            map.pkNum ++;
            if(coin < 0)
            {
                this.lastWinList.unshift(map._id);
                if(this.lastWinList.length > 10)
                    this.lastWinList.length = 10;
                map.winNum ++
                SharedObjectManager_wx4.getInstance().setMyValue('lastWinList',this.lastWinList);
            }
            map.coin += coin;
            EM_wx4.dispatchEventWith(GameEvent.client.UCMAP_RENEW);
        }
    }

    //保存数据
    public saveData(obj,fun?){
        if(!Config.isWX)
        {
            this.saveDataPHP(obj,fun);
            return;
        }


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
        if(!Config.isWX)
        {
            this.getAwardPHP(id,fun);
            return;
        }
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


    //*******************************************************
    //取地图列表
    public getMapDataPHP(id=0,fun?){
        Net.getInstance().getMapData({
            id:id,
            time:TM_wx4.now() - 48*3600,
            gameid:UM_wx4.gameid,
            gameid2:UM_wx4.gameid2,
        },(data)=>{
            if(id)
            {
                this.pkMapData = this.resetPHPMap(data.search);
            }
            else
            {
                this.getMapTime = TM_wx4.now();
                var temp = data.self.concat(data.other)
                for(var i=0;i<temp.length;i++)
                {
                    temp[i] = this.resetPHPMap(temp[i]);
                }
                this.mapList = temp
                this.resetMapList();
                fun && fun();
            }
        });
    }

    private resetPHPMap(data){
        var oo = JSON.parse(Base64.decode(data.mapData));
        oo.coin = parseInt(data.coin)
        oo.pkNum = parseInt(data.pkNum)
        oo.winNum = parseInt(data.winNum)
        oo.getAward = parseInt(data.getAward)
        oo.time = parseInt(data.time)
        oo.gameid = data.gameid
        oo._id = data._id
        return oo;
    }

    //PK指定地图
    public pkMapPHP(id,coin){
        Net.getInstance().pkMap({
            id:id,
            coin:coin,
        },(data)=>{
            this.onPKMap(id,coin);
        });
    }

    //保存数据
    public saveDataPHP(obj,fun?){
        var saveData = ObjectUtil_wx4.clone(obj);
        var coin = obj.coin;
        var pkNum = obj.pkNum;
        var winNum = obj.winNum;
        var getAward = 0;
        var time = obj.time;


        delete obj.coin
        delete obj.pkNum
        delete obj.winNum
        delete obj.getAward
        delete obj.time
        delete obj.gameid

        var mapData = Base64.encode(JSON.stringify(obj));
        Net.getInstance().saveData({
            gameid:UM_wx4.gameid,
            gameid2:UM_wx4.gameid2,
            coin:coin,
            mapData:mapData,
            pkNum:pkNum,
            winNum:winNum,
            getAward:getAward,
            time:time,
        },(data)=>{
            saveData._id = data.data['LAST_INSERT_ID()'];
            this.mapList.unshift(saveData);
            EM_wx4.dispatchEventWith(GameEvent.client.UCMAP_CHANGE);
            fun && fun();
        });
    }

    //领取奖励
    public getAwardPHP(id,fun?){
        Net.getInstance().getAward({
            gameid:UM_wx4.gameid,
            gameid2:UM_wx4.gameid2,
            id:id,
        },(data)=>{
            if(data.fail){
                MyWindow.Alert('领取失败')
                return;
            }

            var coin = data.data.coin;
            coin = Math.floor(coin*PKManager.getInstance().getCoinRate())
            UM_wx4.addCoin(coin);
            MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(coin,2),0xFFFF00),1000)
            this.deleteMapByID(id);
            EM_wx4.dispatchEventWith(GameEvent.client.UCMAP_CHANGE);
            fun && fun();
        });

    }
}