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
    private maxCoin = 10000

    public constructor() {
        super();
        this.skinName = "UCMapResultUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('开始发布')
        this.addBtnEvent(this.okBtn,()=>{
            if(!this.nameText.text)
            {
                MyWindow.Alert('请输入地图名字！');
                return;
            }
            var needCoin = parseInt(this.widthText.text)
            if(!UM_wx4.checkCoin(needCoin))
                return;
            //this.data.coin = needCoin

            UM_wx4.addCoin(-needCoin);
            var oo = {
                coin:needCoin,
                id:this.data.id,
                data:this.data.data,
                height:this.data.height,
                width:this.data.width,
                monsterArr:this.data.monsterArr,
                hard:this.data.hard,
                title:this.nameText.text,
                nick:UM_wx4.nick,
                head:UM_wx4.head,
                gameid:UM_wx4.gameid,
                gameid2:UM_wx4.gameid2,
                pkNum:0,
                winNum:0,
                getAward:false,
                time:TM_wx4.now()
            };

            UCMapManager.getInstance().saveData(oo,()=>{
                PKTowerUI.getInstance().hide();
                DrawMapUI.getInstance().hide();
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

            if(coin > this.maxCoin)
                coin = this.maxCoin
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
            if(coin > this.maxCoin)
                coin = this.maxCoin
            this.widthText.text = '' + coin
        },this)

        this.nameText.addEventListener(egret.Event.CHANGE,()=>{
            this.nameText.text = StringUtil.getStringByLength(this.nameText.text,7)
        },this)
    }

    public show(){
        this.data = TC.currentVO;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.maxCoin = 500*UM_wx4.level
        this.renew();
    }

    public renew(){
        this.nameText.text = this.data.title
        this.widthText.text = '1000'
    }

}