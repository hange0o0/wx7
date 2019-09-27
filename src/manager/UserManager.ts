class UserManager_wx4 {
    public constructor() {

    }

    private static _instance: UserManager_wx4;

    public static getInstance():UserManager_wx4{
        if(!UserManager_wx4._instance)
            UserManager_wx4._instance = new UserManager_wx4();
        return UserManager_wx4._instance;
    }

    private _needUpUser = false;
    private callSave = false
    public get needUpUser(){return this._needUpUser}
    public set needUpUser(v){
        this._needUpUser = v;
        if(v)
        {
            this.callSave = true;
            egret.callLater(this.localSave,this)
        }
    }


    public nick
    public head
    public gender


    public isTest = true;
    public testVersion = 1//与服务器相同则为测试版本
    public shareFail;

    public gameid: string;
    public dbid: string;

    public coin: number = 999;
    public level: number = 1;//要打的，1开始
    //public gunLevel: any = {};
    //public gunPos: any = {};
    public pastDayCoin
    //public gunPosNum = 3;
    //public endLess = 0;
    public coinTimes = 0;
    public helpUser;
    //
    //public cdCoin = 0;
    //public cdCoinTime = 0;
    //public cdCoinGetTime = 0;

    public addForceEnd = 0
    public adLevel
    public isDelete = false


    public shareUser = {};//buff玩家的数据   openid:{head,nick,time}
    public loginTime = 0


    public isFirst = false
    //public hourEarn = 0;
    public offlineTime
    public initDataTime


    //public nextMakeTime = 0//上次免费时间
    //public videoMakeTimes = 0;
    //public makeList = []  //图纸



    public haveGetUser = false
    public fill(data:any):void{
        var localData = SharedObjectManager_wx4.getInstance().getMyValue('localSave')
        if(localData && localData.saveTime && localData.saveTime - data.saveTime > 10) //本地的数据更新
        {
            //console.log('overwrite')
            for(var s in localData)
            {
                data[s] = localData[s];
            }
        }
        var saveTime = data.saveTime;

        this.dbid = data._id;
        this.loginTime = data.loginTime || TM_wx4.now();
        this.coin = data.coin || 0;
        this.shareUser = data.shareUser;
        //this.helpUser = data.helpUser;
        //this.endLess = data.endLess || 0;
        this.level = data.level || 1;
        this.coinTimes = data.coinTimes || 0;

        //this.cdCoin = data.cdCoin || 0;
        //this.cdCoinTime = data.cdCoinTime || 0;
        //this.cdCoinGetTime = data.cdCoinGetTime || 0

        //this.gunLevel = data.gunLevel || {};
        //this.nextMakeTime = data.nextMakeTime || 0;
        //this.videoMakeTimes = data.videoMakeTimes || 0;
        //this.makeList = data.makeList || [];
        //this.gunPos = data.gunPos || {};
        //this.gunPosNum = _get['pos'] || data.gunPosNum || 3;
        this.pastDayCoin = data.pastDayCoin
        this.adLevel = data.adLevel || 0
        this.addForceEnd = data.addForceEnd || 0

        this.testPassDay()

        DM.addTime = SharedObjectManager_wx4.getInstance().getMyValue('addTime') || 0;
        this.offlineTime = TM_wx4.now() - saveTime;

        //this.initDataTime = TM_wx4.now()

        if(this.isFirst)
        {
            console.log('isFirst',this.isFirst)
            var wx = window['wx'];
            if(wx)
            {
                var query = wx.getLaunchOptionsSync().query;
                console.log(query)
                if(query.type == '1')
                {
                    this.helpUser = {openid:query.from,index:query.index}
                }
            }
        }
        PKManager.getInstance().initData(data.pkData);
        PKManager.getInstance().resetSkin()
        this.testAddInvite();
        this.localSave();

    }

    public getPassDayCoin(){
        return Math.floor(this.level * 5*Math.pow(1.23,this.level/10))*100
    }

    public testPassDay(){
        if(!DateUtil_wx4.isSameDay(this.pastDayCoin.t))
        {
            this.pastDayCoin.t = TM_wx4.now();
            //this.videoMakeTimes = 0;
            this.coinTimes = 0;
            this.pastDayCoin.coin = this.getPassDayCoin();
            this.needUpUser = true
        }
    }

    public renewInfo(userInfo){
        if(!userInfo)
            return;
        this.haveGetUser = true;
        this.nick = userInfo.nickName
        this.head = userInfo.avatarUrl
        this.gender = userInfo.gender || 1 //性别 0：未知、1：男、2：女
        this.testAddInvite();
    }
    public addCoin(v,stopSave?){
        if(!v)
            return;
        this.coin += v;
        if(this.coin < 0)
            this.coin = 0;
        if(!stopSave)
            UM_wx4.needUpUser = true;
        EM_wx4.dispatch(GameEvent.client.COIN_CHANGE)
    }

    public getUserInfo(fun){
        var wx = window['wx'];
        if(!wx)
        {
            setTimeout(()=>{
                this.gameid = _get['openid'];
                this.isFirst = !SharedObjectManager_wx4.getInstance().getMyValue('localSave')
                this.fill(this.orginUserData());
                fun && fun();
            },1000)
            return;
        }
        //wx.login({
        //    success:()=>{
                wx.cloud.callFunction({      //取玩家openID,
                    name: 'getInfo',
                    complete: (res) => {
                        if(!res.result)
                        {
                            MyWindow.Alert('请求用户数据失败，请重新启动',()=>{
                                wx.exitMiniProgram({});
                            })
                            return;
                        }
                        //console.log(res)
                        this.gameid = res.result.openid
                        this.isTest = res.result.testVersion == this.testVersion;
                        this.shareFail = res.result.shareFail;
                        //console.log(11)
                        TimeManager_wx4.getInstance().initlogin(res.result.time)
                        //console.log(res.result.time)
                        this.loginUser(fun)
                    },
                    fail:()=>{
                       MyWindow.Alert('请求用户数据超时，请重新启动',()=>{
                           wx.exitMiniProgram({});
                       })
                    }
                })
        //    }
        //})
    }

    public loginUser(fun?){
        var wx = window['wx'];
        const db = wx.cloud.database();
        db.collection('user').where({     //取玩家数据
            _openid: this.gameid,
        }).get({
            success: (res)=>{
                //console.log(res,res.data.length == 0);
                if(res.data.length == 0)//新用户
                {
                    this.onNewUser(fun)
                    return;
                }
                this.fill(res.data[0]);
                fun && fun();
            }
        })
    }

    public renewFriendNew(fun)
    {
        if(TM_wx4.now() - this.initDataTime < 5*60)
        {
            fun && fun();
            return;
        }
        this.initDataTime = TM_wx4.now();
        var wx = window['wx'];
        if(!wx)
        {
            fun && fun();
            return;
        }
        const db = wx.cloud.database();
        db.collection('user').where({     //取玩家数据
            _openid: this.gameid,
        }).get({
            success: (res)=>{
                var data = res.data[0];
                this.shareUser = data.shareUser;
                PKManager.getInstance().resetSkin()
                fun && fun();
            }
        })
    }

    private testAddInvite(){
        console.log('testAddInvite',this.helpUser && this.haveGetUser)
        if(this.helpUser && this.haveGetUser)
        {
            var wx = window['wx'];
            if(!wx)
                return;
            wx.cloud.callFunction({      //取玩家openID,
                name: 'onShareIn',
                data:{
                    other:this.helpUser.openid,
                    nick:UM_wx4.nick,
                    head:UM_wx4.head,
                    index:this.helpUser.index
                },
                complete: (res) => {
                    console.log(res)
                    this.helpUser = null;
                    this.needUpUser = true;
                }
            })
        }
    }

    //新用户注册
    private onNewUser(fun?){
        //console.log('newUser')
        this.isFirst = true;
        var wx = window['wx'];
        const db = wx.cloud.database();
        var initData:any = this.orginUserData();
        db.collection('user').add({
            data:initData,
            success: (res)=>{
                initData._id = res._id;
                this.fill(initData);
                fun && fun();
            }
        })
        //
        //this.needUpUser = true;
    }

    private orginUserData(){
         return {
             loginTime:TM_wx4.now(),   //$
             coin:500,   //$
             level:1,   //$
             gunPos:{1:2,2:1,3:3},   //$
             gunLevel:{},   //$
             guideFinish:true,
             pastDayCoin:{coin:0,t:TM_wx4.now()},
             saveTime:0,
             shareUser:[],
             cdCoin:0,
             cdCoinTime:TM_wx4.now(),
             cdCoinGetTime:TM_wx4.now(),
         };
    }

    private getUpdataData(){
        return {
            loginTime:UM_wx4.loginTime,
            coin:UM_wx4.coin,
            level:UM_wx4.level,
            //endLess:UM_wx4.endLess,
            helpUser:UM_wx4.helpUser,
            //gunLevel:UM_wx4.gunLevel,
            //gunPos:UM_wx4.gunPos,
            coinTimes:UM_wx4.coinTimes,
            //nextMakeTime:UM_wx4.nextMakeTime,
            //videoMakeTimes:UM_wx4.videoMakeTimes,
            //makeList:UM_wx4.makeList,
            //gunPosNum:UM_wx4.gunPosNum,
            pastDayCoin:UM_wx4.pastDayCoin,
            adLevel:UM_wx4.adLevel,
            addForceEnd:UM_wx4.addForceEnd,

            pkData:PKManager.getInstance().getSave(),

            //cdCoin:UM_wx4.cdCoin,
            //cdCoinTime:UM_wx4.cdCoinTime,
            //cdCoinGetTime:UM_wx4.cdCoinGetTime,
            //guideFinish:UM.guideFinish,
            saveTime:TM_wx4.now(),
        };

    }


    public upDateUserData(){
        if(!this.needUpUser)
            return;
        var wx = window['wx'];
        if(wx)
        {
            var updateData:any = this.getUpdataData();;
            WXDB.updata('user',updateData)
        }
        this.needUpUser = false;
        this.localSave();
        //this.upWXData();
    }

    private localSave(){
        if(!this.callSave)
            return;
        this.callSave = false;
        SharedObjectManager_wx4.getInstance().setMyValue('localSave',this.getUpdataData())
    }


    //public upWXEndLess(){
    //    var wx = window['wx'];
    //    if(!wx)
    //        return;
    //    var score = JSON.stringify({"wxgame":{"score":UM_wx4.endLess,"update_time": TM_wx4.now()}})
    //    var upList = [{ key: 'endless', value: score}]; //{ key: 'level', value: UM.chapterLevel + ',' + TM.now()},
    //    wx.setUserCloudStorage({
    //        KVDataList: upList,
    //        success: res => {
    //            console.log(res);
    //        },
    //        fail: res => {
    //            console.log(res);
    //        }
    //    });
    //}

    public upWXLevel(){
        var wx = window['wx'];
        if(!wx)
            return;
        var score = JSON.stringify({"wxgame":{"score":UM_wx4.level,"update_time": TM_wx4.now()}})
        var upList = [{ key: 'level', value: score}]; //{ key: 'level', value: UM.chapterLevel + ',' + TM.now()},
        wx.setUserCloudStorage({
            KVDataList: upList,
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.log(res);
            }
        });
    }

    public getBG(lv?){
        lv = lv || UM_wx4.level;
        var index = lv%15 || 1;
        return 'bg_'+index+'_jpg'
    }

    public checkCoin(v){
        if(this.coin < v)
        {
            NotEnoughCoinUI.getInstance().show();
            return false
        }
        return true
    }


    //public resetCDCoin(){
    //    if(this.cdCoinTime < this.cdCoinGetTime + 8*3600)
    //    {
    //         var num = Math.floor((Math.min(TM_wx4.now(),this.cdCoinGetTime + 8*3600) - this.cdCoinTime)/this.collectCD)
    //        if(num > 0)
    //        {
    //            this.cdCoinTime += num*this.collectCD;
    //            this.cdCoin += num * Math.ceil(this.level/2)
    //        }
    //    }
    //}
    //
    //public collectCDCoin(){
    //    if(!this.cdCoin)
    //    {
    //        MyWindow.ShowTips('暂无可领取金币')
    //        return;
    //    }
    //    var coin = this.cdCoin;
    //    var add = BuffManager.getInstance().getCoinAdd();
    //    if(add)
    //    {
    //        coin = Math.ceil(coin * (1+add/100));
    //    }
    //    UM_wx4.addCoin(coin);
    //    this.cdCoinGetTime = TM_wx4.now();
    //    this.cdCoinTime = TM_wx4.now();
    //    this.cdCoin = 0;
    //
    //    MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(coin,2),0xFFFF00),2000)
    //    MyWindow.ShowTips('好友加成：'+MyTool.createHtml('+' + add + '%',0x00FF00),2000)
    //    SoundManager.getInstance().playEffect('coin')
    //}

}
