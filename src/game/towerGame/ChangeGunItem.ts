class ChangeGunItem extends game.BaseItem{

    private mc: eui.Image;
    private levelText: eui.Label;






    public constructor() {
        super();
        this.skinName = "ChangeGunItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)

    }

    private onClick(){

    }

    public dataChanged():void {
        var GM = GunManager.getInstance();
        var vo:GunVO = this.data
        this.mc.source = vo.getThumb()
        this.levelText.text = vo.name

        this.currentState = GM.gunid == vo.id?'choose':'normal'
    }



}