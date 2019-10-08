class GameManager_wx4 {
    private static _instance:GameManager_wx4;
    public static getInstance():GameManager_wx4 {
        if (!this._instance)
            this._instance = new GameManager_wx4();
        return this._instance;
    }

    private timeID: egret.Timer;
    private timeE = new MyTimer(1000/30);
    private lastTime: number;
    public lastTouchTime: number;
    public lastTouchMC;
    //public changeUserTime = 0
    //public changeUserID = 0
    //public changeUserFun;

    public isActive = true;
    public onShowFun
    //public bannerAD
    public shareFailTime = 0;
	public constructor() {
        this.timeID = new egret.Timer(1000);
        this.timeID.addEventListener(egret.TimerEvent.TIMER,this.timerun,this);
        this.timeID.start();

        this.timeE.addEventListener(egret.TimerEvent.TIMER,this.onTimeE,this);
        this.timeE.start();
	}
	
    public static stage:egret.Stage;
    public static stageX;
    public static stageY;
    public static container:egret.DisplayObjectContainer;
    public static loadStep


    public static isLiuHai(){
        return this.stage.stageHeight > 1250;
    }
    public static paddingTop(){
        return GameManager_wx4.isLiuHai()?50:0
    }
    public static paddingBottom(){
        if(App.isIphoneX)
            return 30;
        return 0;
    }

    public static get uiHeight(){
        var h = this.stage.stageHeight// - Config.adHeight;

        if(this.isLiuHai())
        {
            if(App.isIphoneX)
                return h-this.paddingTop()-30;
            return h-this.paddingTop();
        }
        return h//Math.min(1136,this.stage.stageHeight);
        //return this.stage.stageHeight;
    }
    public static get uiWidth(){
        return this.stage.stageWidth;
    }

    public isWebGL(){
        return egret.Capabilities.renderMode == 'webgl';
    }

    public init(){
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this);
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
        //this.createAD_8628();
    }

	//private wx4_functionX_54598(){console.log(6363)}
    //public addJoinAppid(appid){
     //   var arr = SharedObjectManager_wx4.getInstance().getMyValue('exchangeUserAppid')|| [];
     //   var index = arr.indexOf(appid)
     //   if(index != -1)
     //       arr.splice(index,1);
     //   arr.push(appid)
     //   while(arr.length > 30)
     //       arr.shift()
     //   SharedObjectManager_wx4.getInstance().setMyValue('exchangeUserAppid',arr)
    //}
	//private wx4_functionX_54599(){console.log(7745)}

//    private createAD_8628(){
//    //Config.adHeight = 200;
//    if(!window['wx'])
//        return;
//    if(GameManager_wx4.stage.stageHeight < 1080)
//        return;
//
//
//    var btnw = Math.min(Math.pow(GameManager_wx4.stage.stageHeight/1330,1.6)*640,640)
//
//	wx4_function(668);
//    let scalex = screen.availWidth/640;
//    let scaley = screen.availHeight/GameManager_wx4.stage.stageHeight;
//    if(btnw * scalex < 300){ //微信限制广告宽度不能小于300
//        btnw = 300 / scalex;
//    }
//    Config.adHeight =  btnw/640 * 224;
//	wx4_function(497);
//    var  btny = GameManager_wx4.uiHeight;//给广告留的高度
//    var  paddingTop = GameManager_wx4.paddingTop();
//    var btnx =  (640-btnw)/2;
//
//    let left = scalex * (btnx);
//    let top = scaley * (btny + paddingTop);
//	wx4_function(399);
//    let width = scalex * btnw;
//
//    let bannerAd = this.bannerAD = wx.createBannerAd({
//        adUnitId: 'adunit-d406f443acb5f7d2',
//        style: {
//            left: left,
//            top: top,
//            width: width
//        }
//    })
//    bannerAd.onError(()=>{
//        Config.adHeight = 0
//        GameManager_wx4.stage.dispatchEventWith(egret.Event.RESIZE);
//	wx4_function(3664);
//    })
//    bannerAd.onLoad(()=>{
//
//    })
//    bannerAd.onResize((res)=>{
//        var hh = res.height/scalex*(640/btnw);
//	wx4_function(2793);
//        if(Math.abs(hh - 224)/224 > 0.02)
//        {
//            Config.adHeight =  btnw/640 * hh;
//            GameManager_wx4.stage.dispatchEventWith(egret.Event.RESIZE);
//            bannerAd.style.top = scaley * (GameManager_wx4.uiHeight + paddingTop);
//        }
//        //console.log(res,scalex,scaley,GameManager.stage.stageHeight)
//    })
//    bannerAd.show()
//}
//	private wx4_functionX_54600(){console.log(7039)}
//
//    public showBanner(bottom){
//        if(this.bannerAD)
//        {
//            this.bannerAD.show()
//            var scaley = screen.availHeight/GameManager_wx4.stage.stageHeight;
//	wx4_function(6227);
//            var  paddingTop = GameManager_wx4.paddingTop();
//            this.bannerAD.style.top = scaley * (GameManager_wx4.uiHeight + paddingTop - bottom)// - GameManager.paddingBottom());
//        }
//    }
//
//    public hideBanner(){
//        if(this.bannerAD)
//            this.bannerAD.hide();
//	wx4_function(3457);
//    }

    public stopTimer(){
        this.timeID.stop();
        this.timeE.stop();
    }


    private onTimeE(){
        EM_wx4.dispatch(GameEvent.client.timerE);
    }


    private onTouchMove(e){
        GameManager_wx4.stageX = e.stageX;
        GameManager_wx4.stageY = e.stageY;
    }
    private onTouchBegin(e){
        this.lastTouchMC = e.target;
        GameManager_wx4.stageX = e.stageX;
        GameManager_wx4.stageY = e.stageY;
        this.lastTouchTime = egret.getTimer();
    }


    private timerun(): void {
        if(!UM_wx4.gameid)
            return;
        var now = TM_wx4.now();
        if(!this.lastTime) {
            this.lastTime = now;
            return;
        }
        if(!DateUtil_wx4.isSameDay(this.lastTime,now))//跨0点
        {
            //TeamPVEManager.getInstance().passDay();
            //DayGameManager.getInstance().passDay();
            //GuessManager.getInstance().passDay();

            UM_wx4.testPassDay();
            EM_wx4.dispatch(GameEvent.client.pass_day);
        }

        EM_wx4.dispatch(GameEvent.client.timer);

        //if(UM.friendtime == 0){  //拿过日志了
        //    if(now%30 == 0) //5分钟请求一次
        //    {
        //        FriendManager.getInstance().getLog(null,null,false);
        //    }
        //}
        this.lastTime = now
        //if(SyncDataManager.getInstance().lastConnectTime && now - SyncDataManager.getInstance().lastConnectTime > 3600) //超过1小时要重新登录
        //{
        //    MyWindow.AlertRelogin('已经离开很长时间了，请重新登陆吧')
        //}
    }

    //取现在到晚上12点还差的时间
    public getZeroCD(){
        return this.getZeroTime() - TM_wx4.now();
    }
    public getZeroTime(){
        var d= DateUtil_wx4.timeToChineseDate(TM_wx4.now());
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        d.setHours(24);

        return Math.floor(d.getTime()/1000);
    }

}


class App {
    public static touchEvent: string = egret.TouchEvent.TOUCH_TAP;
    
    public constructor() {
    }

    public static get isIphoneX():boolean{
        let hh = screen.height, ww = screen.width;
        if(window['wx']){
            hh = screen.availHeight, ww = screen.availWidth;
        }
        let _iphoneX = /iphone/gi.test(navigator.userAgent) && (hh == 812 && ww == 375);
        let _iphoneXR = /iphone/gi.test(navigator.userAgent) && (hh == 896 && ww == 414);
        return _iphoneX || _iphoneXR;
    }
    	
    public static get isMobile():boolean{
        return egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE;
    }
    public static get isAndroid():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return ua.indexOf('android') != -1;
    }
    public static get isIOS():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return /ip(ad|hone|od)/.test(ua);
    }
}
//#stop_wx_change#//
function wx4_function(v){}
function sendClientError(str){
    //var url =  'http://172.17.196.195:90/error_wx2/log_error.php'
    //if(window["wx"])
    var url =  'https://www.hangegame.com/error_wx7/log_error.php'
    Net.getInstance().send(url,{str:str});
}
//window.onerror=handleErr;
function sendFeedBack(str){
    try{
        str =  UM_wx4.gameid + "--" + str
    }catch(e){}
    var url =  'https://www.hangegame.com/error_wx7/log_feedback.php'
    Net.getInstance().send(url,{str:str});
}


if(window["wx"])
{
    //window["TeamUI"] = TeamUI;
    //window["BottomUI"] = BottomUI;
    //window["TopUI"] = TopUI
    window["ChangeUserUI"] = ChangeUserUI
    //window["GunItem"] = GunItem
    window["sendClientError"] = sendClientError
    window["GameManager_wx4"] = GameManager_wx4
    window["BasePanel"] = BasePanel
    window["HPBar"] = HPBar
    window["TowerItem"] = TowerItem
    window["PKSkillItem"] = PKSkillItem
    window["SkillListItem"] = SkillListItem


    var wx =  window["wx"];

    wx.onError(function(res){
        UM_wx4 && UM_wx4.upDateUserData();
        try{
            var str = "onError:" + ("openid:" + UM_wx4.gameid + "--") + res.message + "--" + res.stack;
            sendClientError(str);
        }catch(e){}
    });

    wx.onHide(function(res){
        console.log(res)
        if(!GameManager_wx4.stage)
            return;
        UM_wx4 && UM_wx4.upDateUserData();
        SoundManager.getInstance().stopBgSound();
        GameManager_wx4.getInstance().isActive = false;
        //GameManager.stage.dispatchEventWith(egret.Event.DEACTIVATE);
        EM_wx4.dispatch(egret.Event.DEACTIVATE)
        console.log('hide')

        if(!TC.isStop && PKTowerUI._instance && PKTowerUI._instance.stage)
            StopUI.getInstance().show();
        //GameUI.getInstance().cleanTouch();
    });

    wx.onShow(function(res){
        console.log(res)
        if(!GameManager_wx4.stage)
            return;

        //GameManager.stage.dispatchEventWith(egret.Event.ACTIVATE);
        EM_wx4.dispatch(egret.Event.ACTIVATE)
        GameManager_wx4.getInstance().onShowFun && GameManager_wx4.getInstance().onShowFun();
        GameManager_wx4.getInstance().onShowFun = null;
        GameManager_wx4.getInstance().isActive = true;
        //GameUI.getInstance().cleanTouch();
        console.log('show')
        MyADManager.getInstance().onShow(res);
        //UM_wx4.resetCDCoin();


        SoundManager.getInstance().resumeSound();

        //if(GameManager_wx4.getInstance().changeUserTime)
        //{
        //    console.log(TM_wx4.now() - GameManager_wx4.getInstance().changeUserTime)
        //    if(TM_wx4.now() - GameManager_wx4.getInstance().changeUserTime > 30) //停留超过30秒
        //    {
        //        GameManager_wx4.getInstance().addJoinAppid(GameManager_wx4.getInstance().changeUserID);
        //        if(GameManager_wx4.getInstance().changeUserFun)
        //        {
        //            wx.aldSendEvent("点击跳转其它小程序_通过",{'time' : TM_wx4.now() - GameManager_wx4.getInstance().changeUserTime})
        //            GameManager_wx4.getInstance().changeUserFun('changeUser')
        //            ChangeJumpUI.getInstance().hide();
        //        }
        //    }
        //    else
        //    {
        //        wx.aldSendEvent("点击跳转其它小程序_不通过",{'time' : TM_wx4.now() - GameManager_wx4.getInstance().changeUserTime})
        //    }
        //}
        //GameManager_wx4.getInstance().changeUserTime = 0;
        //GameManager_wx4.getInstance().changeUserFun = null;
    });
    //wx.exitMiniProgram(function(res){
    //    if(!GameManager.stage)
    //        return;
    //    PKManager.getInstance().upDateUserData();
    //});

    wx.onShareAppMessage(() => ({
        title: '这个游戏很好玩，推荐一下',
        imageUrl: Config.localResRoot + "share_img_2.jpg"
    }))

    if(wx.getUpdateManager){ //1.9.90以上版本支持
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            //console.log(res.hasUpdate)
            if(res.hasUpdate){
                wx.showToast({icon:"none", title:"有新版本，正在下载中..", duration: 600000});//10分钟
                window["clearTempCache"] && window["clearTempCache"]();
            }
        })
        updateManager.onUpdateReady(function () {
            wx.hideToast();
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，请点击确定重启应用',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })

        })
        updateManager.onUpdateFailed(function () {
            wx.hideToast();
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败，点击确定重试哦',
                showCancel: false,
                success: function (res) {
                    updateManager.applyUpdate()
                }
            })
        })
    }


    window["wx"].setKeepScreenOn && window["wx"].setKeepScreenOn({keepScreenOn:true});//屏幕常亮

    Config.isDebug = false;
}
