class ConfirmUI extends game.BaseWindow_wx4 {
    public constructor() {
        super();
        this.skinName = "AlertSkin";
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    public closeBtn: eui.Button;
    private text: eui.Label;

    private textIn;
    private fun;
    private btnWord;
    private sp;

    public childrenCreated() {
        super.childrenCreated();
        this.canBGClose = false;
        this.addBtnEvent(this.okBtn, this.onClick);
        this.addBtnEvent(this.cancelBtn, this.onCancelClick);
        this.addBtnEvent(this.closeBtn, this.onCloseClick);
    }

    public show(v?,fun?,btnWord?,sp?){
        this.textIn = v;
        this.fun = fun;
        this.btnWord = btnWord;
        this.sp = sp || {};
        super.show();
    }

    public onShow(){
        MyTool.setColorText(this.text,this.textIn);
        this.text.validateNow()
        if(this.text.numLines > 1 && !this.sp.middle)
            this.text.textAlign = 'left'
        if(this.btnWord)
        {
            this.cancelBtn.label = this.btnWord[0];
            this.okBtn.label = this.btnWord[1];
        }


        var ww = GameManager_wx4.container.width;
        var hh = GameManager_wx4.container.height;
        this.x = (ww - this.width) / 2;
        this.y = (hh - this.height) / 2;
        this.closeBtn.visible = false;
    }

    private onClick(){
        if(!this.sp.stopClose1)
            this.hide();
        if(this.fun)
            this.fun(1);
    }
    private onCancelClick(){
        this.hide();
        if(this.fun)
            this.fun(2);
    }
    private onCloseClick(){
        this.hide();
        if(this.fun)
            this.fun(3);
    }
}
