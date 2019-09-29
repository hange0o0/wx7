class PlayerUpUI extends game.BaseWindow_wx4 {

    private static _instance: PlayerUpUI;
    public static getInstance(): PlayerUpUI {
        if(!this._instance)
            this._instance = new PlayerUpUI();
        return this._instance;
    }

    private tab: eui.TabBar;
    private forceGroup: eui.Group;
    private closeBtn: eui.Button;
    private sendBtn: eui.Button;
    private atk1: eui.Label;
    private atk2: eui.Label;
    private coinText: eui.Label;
    private levelText: eui.Label;
    private skinGroup: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;
    private desText: eui.Label;








    public cost;
    public actionStep;
    public constructor() {
        super();
        this.skinName = "PlayerUpUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('提升实力')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = HeroSkinItem

        this.tab.addEventListener(egret.Event.CHANGE,this.onTab,this)
        this.tab.selectedIndex = 0;

        this.addBtnEvent(this.sendBtn,()=>{
            if(!UM_wx4.checkCoin(this.cost))
                return;
            PKManager.getInstance().upPlayerLevel();
            this.renew();
        })

        this.addBtnEvent(this.closeBtn,this.hide)
        //MyTool.removeMC(this.playerItem.hpBar)

        //MyTool.addLongTouch(this.playerItem,()=>{
        //    DebugUI.getInstance().debugTimer = egret.getTimer();
        //    MyWindow.ShowTips('我帅吧！')
        //},this)
    }

    private onTab(){
        this.renew();
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.actionStep = 5 + Math.random()*5;
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renew)
        this.addPanelOpenEvent(GameEvent.client.HERO_CHANGE,this.renewSkin)
        this.addPanelOpenEvent(GameEvent.client.INVITE_CHANGE,this.renewSkin)
    }

    private onTimer(){

    }

    public renew(){
       if(this.tab.selectedIndex == 0)
        this.renewPlayer()
        else
            this.renewSkin()
    }

    private renewPlayer(){
        this.forceGroup.visible = true
        this.skinGroup.visible = false


        var PKM = PKManager.getInstance();
        this.cost = PKM.getUpCost()
        this.coinText.text = NumberUtil_wx4.addNumSeparator(this.cost)
        var v1 = PKM.getPlayerValue(PKM.playerLevel)
        var v2 = PKM.getPlayerValue(PKM.playerLevel + 1)

        this.atk1.text ='当前攻击：+ ' +  v1 + '%'
        this.atk2.text = '下一级攻击：+ ' +  v2 + '%'


        this.levelText.text = '当前等级：'+PKM.playerLevel+'级'
        this.coinText.textColor = this.cost > UM_wx4.coin?0xFF0000:0xFCD766
    }

    private renewSkin(){
        this.forceGroup.visible = false
        this.skinGroup.visible = true
        this.list.dataProvider = new eui.ArrayCollection([101,102,103,104,105,113,114,115])
        this.setHtml(this.desText,'每多一个皮肤，获得金币+10%，当前：' +
            this.createHtml('+' + Math.floor((PKManager.getInstance().heroList.length-1)*10) + '%',0xFFFF00))
    }

}