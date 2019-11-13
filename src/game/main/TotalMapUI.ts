class TotalMapUI extends game.BaseUI_wx4 {

    private static _instance:TotalMapUI;
    public static getInstance() {
        if (!this._instance) this._instance = new TotalMapUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "TotalMapUISkin";
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private closeBtn: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list
        this.list.itemRenderer = TotalMapItem

        this.addBtnEvent(this.closeBtn,()=>{
            this.hide();
        })
    }

    public show(){
        super.show();
    }

    public onShow(){
        var arr = [];
        for(var i=1;i<=UM_wx4.level;i++)
            arr.push(LevelVO.getObject(i))
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}