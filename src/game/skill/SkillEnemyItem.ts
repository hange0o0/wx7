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
        if(this.currentState != 'lock')
        {
            SkillListUI.getInstance().renewShow(this.data)
        }
    }



    public dataChanged():void {
        var level = TC.tempShowLevel || UM_wx4.level
        if(this.data.level > level)
        {
            this.currentState = 'lock'
        }
        else
        {
            if(this.data.isMonster)
                this.currentState = 'normal1';
            else
                this.currentState = 'normal2';
            this.mc.source = this.data.getThumb()
        }
    }
}