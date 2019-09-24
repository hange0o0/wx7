class CreateListUI extends game.BaseUI_wx4 {

    private static _instance:CreateListUI;
    public static getInstance() {
        if (!this._instance) this._instance = new CreateListUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "CreateListUISkin";
    }

    private renewBtn: eui.Button;
    private newBtn: eui.Button;
    private closeBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;






    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list
        this.list.itemRenderer = CreateListItem

        this.addBtnEvent(this.closeBtn,()=>{
            this.hide();
        })
        //this.addBtnEvent(this.getSaveBtn,()=>{
        //    CreateMapManager.getInstance().save();
        //})
        this.addBtnEvent(this.renewBtn,()=>{
             this.onShow();
        })
        this.addBtnEvent(this.newBtn,()=>{
             CreateMapUI.getInstance().show();
        })
    }

    public show(){
        super.show();
    }

    public onShow(){
        this.list.dataProvider = new eui.ArrayCollection(LevelVO.list)
    }
}