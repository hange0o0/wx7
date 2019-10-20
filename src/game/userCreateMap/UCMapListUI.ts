class UCMapListUI extends game.BaseWindow_wx4 {

    private static _instance: UCMapListUI;
    public static getInstance(): UCMapListUI {
        if(!this._instance)
            this._instance = new UCMapListUI();
        return this._instance;
    }

    private scrollerDown: eui.Scroller;
    private listDown: eui.List;
    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;




    public constructor() {
        super();
        this.skinName = "UCMapListUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('原创地图')

        this.scrollerDown.viewport = this.listDown;
        this.listDown.itemRenderer = UCMapListItem

        this.addBtnEvent(this.okBtn,()=>{
            UCMapUI.getInstance().show();
        })

        this.addBtnEvent(this.cancelBtn,()=>{
            if(this.cancelBtn.label == '刷新')
            {
                UCMapManager.getInstance().mapList = null;
                this.renew();
            }
        })
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.UCMAP_CHANGE,this.renewList)
        this.addPanelOpenEvent(GameEvent.client.UCMAP_RENEW,this.justRenewList)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        var UCM = UCMapManager.getInstance();
        if(!UCM.getMapTime)
            return
        var cd = 600 - (TM_wx4.now() - UCM.getMapTime)
        if(cd <= 0)
            this.cancelBtn.label = '刷新'
        else
            this.cancelBtn.label = DateUtil_wx4.getStringBySecond(cd).substr(-5)
    }

    public renew(){
        var UCM = UCMapManager.getInstance();
        UCM.getMapData(0,()=>{
            this.renewList()
        })
    }

    private justRenewList(){
        MyTool.renewList(this.listDown);
    }

    private renewList(){
        this.listDown.dataProvider = new eui.ArrayCollection(UCMapManager.getInstance().mapList)
        this.currentState = UCMapManager.getInstance().mapList.length > 0?'s1':'s2'
        this.onTimer();
    }

}