class ChangeJumpUI extends game.BaseWindow_wx4{

    private static _instance:ChangeJumpUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ChangeJumpUI();
        return this._instance;
    }

    private list: eui.List;
    private destText: eui.Label;

    public fun;
    public closeFun;
    public str;
    public constructor() {
        super();
        this.skinName = "ChangeJumpUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = ChangeUserItem2
        this.setTitle('体验更多小程序')
    }

    public show(str?,fun?,closeFun?){
        if(Config.isZJ || Config.isQQ)
        {
            MyWindow.ShowTips('今日没有广告了')
            return;
        }
        this.fun = fun;
        this.str = str;
        this.closeFun = closeFun;
        //ChangeUserUI.getAD(()=>{
            super.show()
        //})

    }

    public onShow(){
        this.renew();
    }

    //public renewList(){
    //    MyTool.renewList(this.list);
    //}


    public renew(){
        this.setHtml(this.destText, this.str);
        this.list.dataProvider = new eui.ArrayCollection(MyADManager.getInstance().getListByNum(9,this.fun))
    }

    public hide(){
        super.hide();
        this.closeFun && this.closeFun();
    }
}