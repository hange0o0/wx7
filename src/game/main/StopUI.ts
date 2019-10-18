class StopUI extends game.BaseWindow_wx4 {

    private static _instance: StopUI;
    public static getInstance(): StopUI {
        if(!this._instance)
            this._instance = new StopUI();
        return this._instance;
    }

    private okBtn: eui.Button;
    private closeBtn: eui.Button;

    public constructor() {
        super();
        this.skinName = "StopUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,()=>{
            this.hide();
            PKTowerUI.getInstance().hide();
            if(RebornUI.getInstance().stage)
                RebornUI.getInstance().hide();

        })

        this.addBtnEvent(this.okBtn,()=>{
            this.hide();
        })


    }


    public show(){
        super.show()
    }

    public hide() {
        TC.isStop = false;
        super.hide();
    }

    public onShow(){
        TC.isStop = true;
        this.renew();
    }

    private renew(){

    }

}