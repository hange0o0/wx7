class SkillUnlockUI extends game.BaseWindow_wx4 {

    private static _instance: SkillUnlockUI;
    public static getInstance(): SkillUnlockUI {
        if(!this._instance)
            this._instance = new SkillUnlockUI();
        return this._instance;
    }

    private refreshBtn: eui.Button;
    private inviteBtn: eui.Button;



    public index;
    public constructor() {
        super();
        this.skinName = "SkillUnlockUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();


        this.addBtnEvent(this.inviteBtn,this.onInvite)
        this.addBtnEvent(this.refreshBtn,this.onRefresh)

    }

    private onInvite(){
        var wx =  window["wx"];
        if(wx)
            wx.aldSendEvent("点击邀请好友")

        ShareTool.share('加入我们，让我们一起割草无双',Config.getShare(0),{type:1,from:UM_wx4.gameid,index:this.index},()=>{
            MyWindow.ShowTips('等待好友加入')
            MyWindow.ShowTips('好友加入后，数据有一定延迟，请耐心等候')
        },true)
    }

    private onRefresh(){
        UM_wx4.renewFriendNew(()=>{
            if(UM_wx4.shareUser[this.index])
            {
                SkillChooseUI.getInstance().chooseSkill[3+this.index] = 0;
                SkillChooseUI.getInstance().renew();
                this.hide();
            }
            else
            {
                MyWindow.ShowTips('还没有好友通过你的连接新加入游戏')
            }
        })
    }

    public show(index?){
        this.index = index;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.setTitle('解锁技能位' + (this.index + 4))
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
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