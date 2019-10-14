class UCMonsterChooseItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "UCMonsterChooseItemSkin";
    }

    private mc: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){
        UCMonsterChooseUI.getInstance().removeItem(this.data)
    }


    public dataChanged(){
        this.mc.source = MonsterVO.getObject(this.data.id).getThumb()
    }

}

class UCMonsterChooseItemDown extends UCMonsterChooseItem{
    public constructor() {
        super();
    }

    public onClick() {
        UCMonsterChooseUI.getInstance().addItem(this.data)
    }
}