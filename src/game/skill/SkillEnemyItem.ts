class SkillEnemyItem extends game.BaseItem{

    private mc: eui.Image;



    public constructor() {
        super();
        this.skinName = "SkillEnemyItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.currentState == 'normal')
        {
            SkillListUI.getInstance().renewShow(this.data)
        }
    }



    public dataChanged():void {
        var level = UM_wx4.level
        if(this.data.level > level)
        {
            this.currentState = 'lock'
        }
        else
        {
            this.currentState = 'normal'
            this.mc.source = this.data.getThumb()
        }
    }
}