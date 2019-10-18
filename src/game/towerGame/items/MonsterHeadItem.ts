class MonsterHeadItem extends game.BaseItem{

    private mc: eui.Image;



    public constructor() {
        super();
        this.skinName = "SkillEnemyItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false
        this.currentState = 'normal1'
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        var level = 0;
        SkillListUI.getInstance().show(MonsterVO.getObject(this.data))
    }



    public dataChanged():void {
        this.mc.source = MonsterVO.getObject(this.data).getThumb();
    }
}