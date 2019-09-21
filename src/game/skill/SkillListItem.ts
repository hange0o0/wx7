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
            this.renewSkill();
        this.setSelect();
    }

    public setSelect(){
        this.selectMC.visible = this.data == SkillListUI.getInstance().list.selectedItem;
    }

    private renewMonster(){
        this.currentState = 's2'
        var vo = this.data
        var level = UM_wx4.level

        if(vo.level > level)
        {
            this.mc.source = 'pk_skill_unknow_png'
            this.touchChildren = this.touchEnabled = false
            this.nameText.text = '第 '+vo.level+' 关'
        }
        else
        {
            this.touchChildren = this.touchEnabled = true
            this.mc.source = vo.getThumb();
            this.nameText.text = vo.name
        }
    }

    private renewSkill(){

        var level = UM_wx4.level
        var vo = this.data
        if(vo.level > level)
        {
            this.currentState = 's2'
            this.mc.source = 'pk_skill_unknow_png'
            this.touchChildren = this.touchEnabled = false
            this.nameText.text = '第 '+vo.level+' 关'
        }
        else
        {
            this.currentState = 's1'
            this.touchChildren = this.touchEnabled = true
            this.mc.source = vo.getThumb();
            this.nameText.text = vo.name
        }

    }
}