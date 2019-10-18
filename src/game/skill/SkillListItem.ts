class SkillListItem extends game.BaseItem{

    private mc: eui.Image;
    private selectMC: eui.Image;
    private nameText: eui.Label;




    public constructor() {
        super();
        this.skinName = "SkillListItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false



    }

    public dataChanged():void {
        if(this.data.isMonster)
            this.renewMonster();
        else
            this.renewGun();
        this.setSelect();
    }

    public setSelect(){
        this.selectMC.visible = this.data == SkillListUI.getInstance().list.selectedItem;
    }

    private renewMonster(){
        this.currentState = 's1'
        var vo = this.data
        var level = TC.tempShowLevel

        if(vo.level > level)
        {
            this.mc.source = 'pk_skill_unknow_png'
            this.touchChildren = this.touchEnabled = false
            this.nameText.text = '?????'
        }
        else
        {
            this.touchChildren = this.touchEnabled = true
            this.mc.source = vo.getThumb();
            this.nameText.text = vo.name
        }
    }

    private renewGun(){
        this.currentState = 's2'
        var level = TC.tempShowLevel
        var vo = this.data

        if(vo.level > level)
        {
            this.mc.source = 'pk_skill_unknow_png'
            this.touchChildren = this.touchEnabled = false
            this.nameText.text = '?????'
        }
        else
        {
            this.touchChildren = this.touchEnabled = true
            this.mc.source = vo.getThumb();
            this.nameText.text = vo.name
        }

    }
}