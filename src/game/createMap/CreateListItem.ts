class CreateListItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "CreateListItemSkin";
    }

    private txt: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,()=>{
            CreateMapUI.getInstance().show(this.data)
        })
    }

    public dataChanged():void {
        this.txt.text = this.data.id;
    }
}