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

        this.addBtnEvent(this.cancelBtn,this.hide)
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
        var UCM = UCMapManager.getInstance();
        UCM.getMapData(0,this.renewList)
    }

    private renewList(){
        this.listDown.dataProvider = new eui.ArrayCollection(UCMapManager.getInstance().mapList)
    }

}