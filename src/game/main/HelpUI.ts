class HelpUI extends game.BaseWindow_wx4 {

    private static _instance: HelpUI;
    public static getInstance(): HelpUI {
        if(!this._instance)
            this._instance = new HelpUI();
        return this._instance;
    }

    private ctrlGroup: eui.Group;
    private rateBar: eui.Image;
    private skillBtn: eui.Button;




    public data;
    public constructor() {
        super();
        this.skinName = "HelpUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('游戏说明')
        this.addBtnEvent(this.skillBtn,this.hide)
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        //this.skillItem.data = SBase.getItem(1)
    }

    public onE(){
        this.rateBar.width -=2;
        if(this.rateBar.width <=0)
            this.rateBar.width = 500
    }

}