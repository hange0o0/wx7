class TotalMapItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "TotalMapItemSkin";
    }

    private mc: eui.Image;
    private titleText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,()=>{
            TotalMapUI.getInstance().hide();
            GameUI.getInstance().currentLevel = this.data.id
            GameUI.getInstance().renewLevel()
            GameUI.getInstance().renewBtn();
        })
    }

    public dataChanged():void {
        this.mc.source = this.data.getThumb();
        this.titleText.text = '第 ' + this.data.id + ' 关';
    }
}