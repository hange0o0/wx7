class AddForceUI extends game.BaseWindow_wx4 {

    private static _instance: AddForceUI;
    public static getInstance(): AddForceUI {
        if(!this._instance)
            this._instance = new AddForceUI();
        return this._instance;
    }

    private closeBtn: eui.Button;
    private sendBtn: eui.Button;
    private atk1: eui.Label;
    private atk2: eui.Label;



    public constructor() {
        super();
        this.skinName = "AddForceUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('增加额外战力')
        this.addBtnEvent(this.sendBtn,()=>{
            ShareTool.openGDTV(()=>{
                PKManager.getInstance().addForce();
                DrawMapUI.getInstance().renewForceAdd();
                this.renew();
            })
        })
        this.addBtnEvent(this.closeBtn,this.hide)
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }


    public renew(){
        var PKM = PKManager.getInstance();
        var v1 = Math.round(PKM.forceAdd*100)
        var v2 = v1 + 20;

        this.atk1.text ='当前攻击：+ ' +  v1 + '%'
        this.atk2.text = '观看广告后攻击：+ ' +  v2 + '%'

    }

}