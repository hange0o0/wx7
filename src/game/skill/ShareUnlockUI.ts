class ShareUnlockUI extends game.BaseWindow_wx4 {

    private static _instance: ShareUnlockUI;
    public static getInstance(): ShareUnlockUI {
        if(!this._instance)
            this._instance = new ShareUnlockUI();
        return this._instance;
    }

    private refreshBtn: eui.Button;
    private inviteBtn: eui.Button;
    private desText2: eui.Label;
    private mc: eui.Image;
    private desText: eui.Label;






    public index;
    public title;
    public des;
    public constructor() {
        super();
        this.skinName = "ShareUnlockUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.inviteBtn,this.onInvite)
        this.addBtnEvent(this.refreshBtn,this.onRefresh)

        if(!Config.isWX)
        {
            this.desText2.visible = false;
            MyTool.removeMC(this.refreshBtn)
            this.inviteBtn.label = '解锁'
            this.inviteBtn.icon = 'video_icon_png'
        }
    }

    private onInvite(){
        if(!Config.isWX)
        {
            ShareTool.openGDTV(()=>{
                UM_wx4.shareUserVideo[this.index] = 1;
                UM_wx4.needUpUser = true;
                this.hide();
                EM_wx4.dispatch(GameEvent.client.INVITE_CHANGE)
            })
            return;
        }


        var wx = window["wx"];
        if(wx)
            wx.aldSendEvent("点击邀请好友")

        ShareTool.share('搬砖修路，拯救天下!',Config.getShare(0),{type:1,from:UM_wx4.gameid,index:this.index},()=>{
            MyWindow.ShowTips('等待好友加入')
            MyWindow.ShowTips('好友加入后，数据有一定延迟，请耐心等候')
        },true)
    }

    private onRefresh(){
        UM_wx4.renewFriendNew(()=>{
            EM_wx4.dispatch(GameEvent.client.INVITE_CHANGE)
            if(UM_wx4.shareUser[this.index])
            {
                this.hide();
            }
            else
            {
                MyWindow.ShowTips('还没有好友通过本窗口链接新加入游戏')
            }
        })
    }

    public show(index?,title?,des?,type='skin'){
        this.index = index;
        this.title = title;
        this.des = des;
        this.currentState = type;
        super.show()
    }

    public hide() {
        super.hide();
        TC.isStop = false;
    }

    public onShow(){
        TC.isStop = true;
        this.setTitle(this.title)

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        if(this.currentState == 'addSpeed')
        {
            this.mc.source = 'add_speed_btn2_png'
            if(!Config.isWX)
                this.des = '永久解锁 '+this.createHtml('加速',0xFFFF00)+' 功能'
        }
        else if(this.currentState == 'skin')
        {
            this.mc.source = this.index + '_2_png'
            if(!Config.isWX)
                this.des = '永久解锁 '+this.createHtml('新皮肤',0xFFFF00)+'，金币获得增加 '+this.createHtml('20%',0xFFFF00)
        }

        this.setHtml(this.desText,this.des);
    }

    private onTimer(){
        var cd = 5*60 - (TM_wx4.now() - UM_wx4.initDataTime)
        if(cd > 0)
        {
            this.refreshBtn.label = DateUtil_wx4.getStringBySecond(cd).substr(-5)
        }
        else
        {
            this.refreshBtn.label = '刷新'
        }
    }

}