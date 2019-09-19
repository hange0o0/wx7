class SkillChooseItem2 extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "SkillChooseItem2Skin";
    }

    private mc: eui.Image;
    private chooseMC: eui.Image;
    private levelText: eui.Label;
    private nameText: eui.Label;



    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        MyTool.addLongTouch(this,this.onInfo,this)
    }

    private onClick(){
        if(this.data > 0)
        {
            SkillChooseUI.getInstance().addChoose(this.data)
        }
        else if(this.data == -1)
        {
            SkillUnlockUI.getInstance().show(-this.data);
        }
    }

    private onInfo(){
        if(this.data > 0)
            SkillInfoUI.getInstance().show(this.data)
    }


    public dataChanged(){
        var chooseSkill = SkillChooseUI.getInstance().chooseSkill;
        var vo = SkillVO.getObject(this.data)
        this.mc.source = vo.getThumb();
        this.levelText.text = 'lv.' + SkillManager.getInstance().getSkillLevel(this.data);
        this.nameText.text = vo.name

        this.chooseMC.visible = chooseSkill.indexOf(this.data) != -1
    }

}