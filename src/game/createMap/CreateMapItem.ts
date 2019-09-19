class CreateMapItem extends game.BaseItem{

    private mc: eui.Image;

    public constructor() {
        super();
        this.skinName = "CreateMapItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged():void {
        this.mc.source = 'map_'+(this.data)+'_1_png'
    }



}