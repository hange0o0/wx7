class UCMapResultUI extends game.BaseWindow_wx4 {

    private static _instance: UCMapResultUI;
    public static getInstance(): UCMapResultUI {
        if(!this._instance)
            this._instance = new UCMapResultUI();
        return this._instance;
    }

    private nameText: eui.EditableText;
    private wDecBtn: eui.Button;
    private widthText: eui.EditableText;
    private wAddBtn: eui.Button;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;




    public data

    public constructor() {
        super();
        this.skinName = "UCMapResultUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('开始发布')
        this.addBtnEvent(this.okBtn,()=>{
            UCMapManager.getInstance().saveData(this.data,()=>{
                UCMapSetUI.getInstance().hide();
                PKTowerUI.getInstance().hide();
                this.hide();
            })
        })
        this.addBtnEvent(this.cancelBtn,this.hide)

        this.addBtnEvent(this.wAddBtn,()=>{
            var coin = parseInt(this.widthText.text);
            coin += 100;
            if(coin > UM_wx4.coin)
                coin = UM_wx4.coin;
            if(coin < 1000)
                coin = 1000;
            this.widthText.text = '' + coin
        })

        this.addBtnEvent(this.wDecBtn,()=>{
            var coin = parseInt(this.widthText.text);
            coin -= 100;
            if(coin < 1000)
                coin = 1000;
            this.widthText.text = '' + coin
        })
        this.widthText.addEventListener(egret.Event.CHANGE,()=>{
            var coin = parseInt(this.widthText.text);
            if(coin > UM_wx4.coin)
                coin = UM_wx4.coin;
            else if(coin < 1000)
            {
                this.widthText.text = '1000'
                MyWindow.ShowTips('奖池金币不能低于1000')
            }
            this.widthText.text = '' + coin
        },this)
    }

    public show(data?){
        this.data = data;
        this.data.testOK = true;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }


    public renew(){
        this.nameText.text = this.data.title
        this.widthText.text = '1000'
    }

}