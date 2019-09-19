class RebornUI extends game.BaseWindow_wx4{

    private static _instance:RebornUI;
    public static getInstance() {
        if (!this._instance) this._instance = new RebornUI();
        return this._instance;
    }

    private desText: eui.Label;
    private rebornGroup: eui.Group;
    private cdText: eui.Label;
    private stopBtn: eui.Image;




    private shape = new egret.Shape()
    private step = 0;


    private totalTime = 30*8

    public constructor() {
        super();
        this.skinName = "RebornUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.rebornGroup.addChildAt(this.shape,1);
        this.shape.x = 130
        this.shape.y = 130

        this.addBtnEvent(this.stopBtn,()=>{
            StopUI.getInstance().show();
        })
    }

    public onShow(){
        this.step = this.totalTime - PKC.playerData.rebornDec;
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.stopBtn.visible = false;
    }

    public showFinish(){
        this.stopBtn.visible = true;
        this.stopBtn.x = 20 - this.x
        this.stopBtn.y = 20 - this.y + GameManager_wx4.paddingTop()
    }

    private onE(){
        if(PKC.isStop)
            return;
        if(this.step <= 0)
        {
            this.hide();
            PKC.playerData.hp = PKC.playerData.maxHp;
            PKC.playerData.isDie = 0
            PKC.playerData.relateItem.renewHp();
            PKC.playerData.relateItem.mvKey = null
            PKC.playerData.relateItem.showStandMV()
            PKC.playerData.wudiStep = 30*5;
            SoundManager.getInstance().playEffect('reborn')
            return;
        }
        this.step --;
        this.renew();
    }


    public renew(){
        var cd = Math.ceil(this.step/30);
        this.cdText.text = cd + '';
        MyTool.getSector(128,-90,-this.step/this.totalTime*360,0xFFFFFF,0.3,this.shape)
    }

    public hide(){
        super.hide();
    }
}