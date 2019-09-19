class SkillListItem extends game.BaseItem{

    private mc: eui.Image;
    private barMC: eui.Image;
    private rateText: eui.Label;
    private levelText: eui.Label;
    private selectMC: eui.Image;



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
        var level = (UM_wx4.level-1) || 1

        if(vo.level > level)
        {
            this.mc.source = 'pk_skill_unknow_png'
            this.touchChildren = this.touchEnabled = false
        }
        else
        {
            this.touchChildren = this.touchEnabled = true
            this.mc.source = vo.getThumb();
        }
    }

    private renewSkill(){

        var vo = this.data
        var SM = SkillManager.getInstance();



        var currentNum = SM.getSkillNum(vo.id)
        if(currentNum == 0)
        {
            this.currentState = 's2'
            this.mc.source = 'pk_skill_unknow_png'
            this.touchChildren = this.touchEnabled = false
        }
        else
        {
            this.currentState = 's1'

            var lv = SM.getSkillLevel(vo.id);
            this.levelText.text = 'lv.' + lv

            var num1 = SM.getLevelNum(lv)
            var num2 = SM.getLevelNum(lv+1)

            var v1 = currentNum - num1
            var v2 = num2 - num1
            this.rateText.text = v1 + '/' + v2;
            this.barMC.width = 100 * v1 / v2;


            this.touchChildren = this.touchEnabled = true
            this.mc.source = vo.getThumb();
        }

    }
}