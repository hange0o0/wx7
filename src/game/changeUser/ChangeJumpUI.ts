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
    private isSuccess = false
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
        this.isSuccess = false;
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
        if(ADIconManager.getInstance().showIcon('changeJump'))
        {
            this.list.visible = false;
            GameManager_wx4.getInstance().addTestHide((res)=>{
                if(res.targetAction == 9)
                {
                    this.isSuccess = true;
                }
            })

            GameManager_wx4.getInstance().addTestShow((res)=>{
                if(this.isSuccess)
                {
                    this.fun();
                    this.hide()
                }
            })
            return;
        }
        this.list.dataProvider = new eui.ArrayCollection(MyADManager.getInstance().getListByNum(9,this.fun))
    }

    public hide(){
        super.hide();
        this.closeFun && this.closeFun();
        ADIconManager.getInstance().hideAll();
        GameManager_wx4.getInstance().cleanAllTest();
    }
}