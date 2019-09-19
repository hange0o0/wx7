class MonsterUI extends game.BaseWindow_wx4 {

    private static _instance: MonsterUI;
    public static getInstance(): MonsterUI {
        if(!this._instance)
            this._instance = new MonsterUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private atkText: eui.Label;
    private nameText: eui.Label;
    private rateText: eui.Label;




    public data;
    public constructor() {
        super();
        this.skinName = "MonsterUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('问题与建议')
        //this.addBtnEvent(this.sendBtn,()=>{
        //    if(this.inputText.text)
        //    {
        //        sendFeedBack(this.inputText.text);
        //        MyWindow.ShowTips('感谢你的反馈，我们会努力做得更好的！')
        //        this.hide();
        //    }
        //
        //})
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        //this.inputText.text = ''
    }

}