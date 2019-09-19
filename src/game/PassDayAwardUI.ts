class PassDayAwardUI extends game.BaseWindow_wx4 {

    private static _instance:PassDayAwardUI;

    public static getInstance():PassDayAwardUI {
        if (!this._instance)
            this._instance = new PassDayAwardUI();
        return this._instance;
    }

    private btnGroup: eui.Group;
    private okBtn: eui.Button;
    private shareBtn: eui.Button;
    private coinText: eui.Label;






    private coin
    public constructor() {
        super();
        this.canBGClose = false;
        this.skinName = "PassDayAwardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('每日奖励')
        this.addBtnEvent(this.okBtn,this.onGet)
        this.addBtnEvent(this.shareBtn,this.onShare)
    }

    public hide(){
        super.hide();
    }

    public onGet(){
        UM_wx4.pastDayCoin.coin = 0
        UM_wx4.addCoin(this.coin);
        MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.coin,2),0xFFFF00),1000)
        this.hide();
        SoundManager.getInstance().playEffect('coin')
    }

    public onShare(){
        ShareTool.openGDTV(()=>{
            this.onAddCoin()
        })
    }


    private onAddCoin(){
        SoundManager.getInstance().playEffect('coin')
        MyTool.removeMC(this.shareBtn);
        UM_wx4.pastDayCoin.coin = 0
        UM_wx4.addCoin(this.coin*3);
        MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.coin*3,2),0xFFFF00),1000)
        this.okBtn.label = '关闭'

        var old = this.coin
        var pre = this.coin*2/50
        var coin = old;
        for(var i = 0 ; i < 50 ; i++)
        {
            egret.setTimeout(()=>{
                coin += pre
                this.coinText.text = NumberUtil_wx4.addNumSeparator(Math.round(coin),2);
            },this,20*i)
        }
    }

    public show(){
        super.show();
    }

    public onShow(){
        this.coin = UM_wx4.pastDayCoin.coin
        this.coinText.text = NumberUtil_wx4.addNumSeparator(this.coin,2);
        this.btnGroup.addChild(this.shareBtn)
        //MyTool.removeMC(this.shareBtn);
    }
}