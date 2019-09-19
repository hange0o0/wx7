class StopUI extends game.BaseWindow_wx4 {

    private static _instance: StopUI;
    public static getInstance(): StopUI {
        if(!this._instance)
            this._instance = new StopUI();
        return this._instance;
    }

    private closeBtn: eui.Button;
    private okBtn: eui.Button;
    private r0: eui.RadioButton;
    private r1: eui.RadioButton;
    private r2: eui.RadioButton;
    private g1: eui.Group;
    private c0: eui.Image;
    private g2: eui.Group;
    private c1: eui.Image;
    private g3: eui.Group;
    private c2: eui.Image;






    public chooseType = 1;
    public data;
    public constructor() {
        super();
        this.skinName = "StopUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('游戏暂停')
        this.addBtnEvent(this.closeBtn,()=>{
            this.hide();
            PKUI.getInstance().hide();
            if(RebornUI.getInstance().stage)
                RebornUI.getInstance().hide();
        })

        this.addBtnEvent(this.okBtn,()=>{
            SharedObjectManager_wx4.getInstance().setMyValue('ctrlType',this.chooseType)
            this.hide();
            PKUI.getInstance().renewCtrl();
        })

        this.r0.group.addEventListener(eui.UIEvent.CHANGE,this.onRChange,this)
        this.addBtnEvent(this.g1,()=>{
            this.chooseType = 1
            this.renew();
        })
        this.addBtnEvent(this.g2,()=>{
            this.chooseType = 2
            this.renew();
        })
        this.addBtnEvent(this.g3,()=>{
            this.chooseType = 3
            this.renew();
        })

    }

    private onRChange(){
        if(this.r0.selected)
            this.chooseType = 1
        else if(this.r1.selected)
            this.chooseType = 2
        else if(this.r2.selected)
            this.chooseType = 3
        this.renew();
    }

    public show(){
        super.show()
    }

    public hide() {
        PKC.isStop = false;
        super.hide();
    }

    public onShow(){
        PKC.isStop = true;
        this.chooseType = SharedObjectManager_wx4.getInstance().getMyValue('ctrlType') || 1;
        this.renew();
    }

    private renew(){
        this.c0.visible = false
        this.c1.visible = false
        this.c2.visible = false

        if(this.chooseType == 1)
        {
            this.r0.selected = true
            this.c0.visible = true
        }
        else if(this.chooseType == 2)
        {
            this.r1.selected = true
            this.c1.visible = true
        }
        else if(this.chooseType == 3)
        {
            this.r2.selected = true
            this.c2.visible = true
        }
    }

}