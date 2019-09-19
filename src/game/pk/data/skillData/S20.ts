class S20 extends SBase{
    constructor() {
        super();
    }

    public addHp = 1000
    public totalTime = 100

    private defMC1 = new eui.Image('20_png')
    private defMC2 = new eui.Image('20_png')
    public step = 0;
    public onCreate(){
        this.defMC1.anchorOffsetX = 27/2
        this.defMC1.anchorOffsetY = 34/2
        this.defMC1.x = this.defMC1.y = 15;

        this.defMC2.anchorOffsetX = 27/2
        this.defMC2.anchorOffsetY = 34/2
        this.defMC2.x = this.defMC2.y = 15;

        this.addHp = this.getValue(1)
        this.totalTime = PKTool.getStepByTime(this.getValue(2)*1000)
    }

    public onUse(){
        PKC.playerData.hpDef = this.addHp;
        PKC.playerData.relateItem.leftCon.addChild(this.defMC1)
        PKC.playerData.relateItem.rightCon.addChild(this.defMC2)
        this.step = this.totalTime
        return true;
    }

    public onStep(){
        if(this.step > 0)
        {
            this.step --;
            if(PKC.playerData.hpDef <= 0)
                this.step = 0;
            if(this.step <= 0)
            {
                PKC.playerData.hpDef = 0;
                MyTool.removeMC(this.defMC1)
                MyTool.removeMC(this.defMC2)
            }
        }

    }
}