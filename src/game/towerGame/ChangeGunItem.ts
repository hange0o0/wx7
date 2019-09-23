class ChangeGunItem extends game.BaseItem{

    private mc: eui.Image;
    private selectMC: eui.Image;
    private nameText: eui.Label;
    private rateBGMC: eui.Image;

    public constructor() {
        super();
        this.skinName = "ChangeGunItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false

    }

    public dataChanged():void {
        var vo = GunVO.getObject(this.data.id)
        this.mc.source = vo.getThumb();
        this.renewNum();
        this.setSelect();
    }

    public setSelect(){
        this.selectMC.visible = this.data == ChangeGunUI.getInstance().list.selectedItem;
    }


    public renewNum(){
        var vo = GunVO.getObject(this.data.id)
        this.touchChildren = this.touchEnabled = this.data.num > 0
        this.rateBGMC.visible = this.data.num <= 0
        this.nameText.text = vo.name + ' x' + this.data.num

    }
}