class NotEnoughCoinUI extends game.BaseWindow_wx4 {

    private static _instance:NotEnoughCoinUI;

    public static getInstance():NotEnoughCoinUI {
        if (!this._instance)
            this._instance = new NotEnoughCoinUI();
        return this._instance;
    }

    private desText: eui.Label;
    private btnGroup: eui.Group;
    private shareBtn: eui.Button;
    private coinText: eui.Label;






    private coin
    public constructor() {
        super();
        this.canBGClose = false;
        this.skinName = "NotEnoughCoinUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('领取补助')
        this.addBtnEvent(this.shareBtn,this.onShare)
    }

    public hide(){
        super.hide();
    }


    public onShare(){
        ShareTool.openGDTV(()=>{
            UM_wx4.coinTimes ++;
            UM_wx4.addCoin(this.coin);
            MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.coin,2),0xFFFF00),1000)
            this.hide();
            SoundManager.getInstance().playEffect('coin')
        })
    }

    public show(){
        if(UM_wx4.coinTimes >= 10)
        {
            MyWindow.ShowTips('金币不足！')
            return
        }
        super.show();
    }

    public onShow(){
        this.coin = PKManager.getInstance().getWinCoin(Math.max(10,UM_wx4.level-1)) * 6
        this.coinText.text = NumberUtil_wx4.addNumSeparator(this.coin,2);
        this.desText.text = '今日还可领取 '+(10 - UM_wx4.coinTimes)+' 次'
    }
}