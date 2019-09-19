class AlertUI extends game.BaseWindow_wx4 {
    public constructor() {
        super();
        this.skinName = "AlertSkin";
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private closeBtn: eui.Button;
    public text: eui.Label;

    private textIn;
    private fun;
    private btnLabel;

    public childrenCreated() {
        this.canBGClose = false;
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onClick);
        MyTool.removeMC(this.closeBtn)
        MyTool.removeMC(this.cancelBtn)
    }

    public show(v?,fun?,btnLabel?){
        this.textIn = v;
        this.fun = fun;
        this.btnLabel = btnLabel;
        super.show();
    }

    public onShow(){
        MyTool.setColorText(this.text, this.textIn);
        this.okBtn.label = this.btnLabel || '确认'
        if(this.text.numLines > 1)
            this.text.textAlign = 'left'


        var ww = GameManager_wx4.container.width;
        var hh = GameManager_wx4.container.height;
        this.x = (ww - this.width) / 2;
        this.y = (hh - this.height) / 2;
    }

    private onClick(){
        this.hide();
        if(this.fun)
            this.fun();
    }
}
