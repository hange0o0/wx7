class PlayerUpUI extends game.BaseWindow_wx4 {

    private static _instance: PlayerUpUI;
    public static getInstance(): PlayerUpUI {
        if(!this._instance)
            this._instance = new PlayerUpUI();
        return this._instance;
    }

    private closeBtn: eui.Button;
    private sendBtn: eui.Button;
    private atk1: eui.Label;
    private atk2: eui.Label;
    private hp1: eui.Label;
    private hp2: eui.Label;
    private coinText: eui.Label;
    private levelText: eui.Label;






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
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){

    }

    public renew(){
        var PKM = PKManager.getInstance();
        this.cost = PKM.getUpCost()
        this.coinText.text = NumberUtil_wx4.addNumSeparator(this.cost)
        var v1 = PKM.getPlayerValue(PKM.playerLevel)
        var v2 = PKM.getPlayerValue(PKM.playerLevel + 1)

        this.atk1.text = v1.atk + ''
        this.atk2.text = v2.atk + ''

        this.hp1.text = v1.hp + ''
        this.hp2.text = v2.hp + ''

        this.levelText.text = '当前等级：'+PKM.playerLevel+'级'
        this.coinText.textColor = this.cost > UM_wx4.coin?0xFF0000:0xFCD766
    }

}