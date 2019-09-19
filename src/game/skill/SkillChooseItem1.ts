class SkillChooseItem1 extends game.BaseItem{

    private mc: eui.Image;



    public constructor() {
        super();
        this.skinName = "SkillChooseItem1Skin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false
        this.addBtnEvent(this,this.onClick)
        MyTool.addLongTouch(this,this.onInfo,this)
    }

    private onClick(){
        if(this.data > 0)
        {
            SkillChooseUI.getInstance().addChoose(this.data)
        }
        else if(this.data < 0)
        {
            SkillUnlockUI.getInstance().show(-this.data);
        }
    }

    private onInfo(){
        if(this.data > 0)
            SkillInfoUI.getInstance().show(this.data)
    }

    public dataChanged():void {
        if(this.data < 0)
        {
            this.currentState = 'lock'
        }
        else
        {
            this.currentState = 'normal'
            if(this.data)
            {
                this.mc.source = SkillVO.getObject(this.data).getThumb()
            }
            else
            {
                this.mc.source = '';
            }
        }
    }
}