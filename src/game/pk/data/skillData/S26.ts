class S26 extends SBase{
    constructor() {
        super();
    }
    public totalStep = 300
    public addHp = 30;

    public step = 0
    public lastAddHp = 0


    private mc = new eui.Image('26_png')
    public onCreate(){
        this.mc.anchorOffsetX = 202/2
        this.mc.anchorOffsetY = 202/2
        this.mc.scaleX = this.mc.scaleY = 1.8;

        this.totalStep = PKTool.getStepByTime(this.getValue(2)*1000)
        this.addHp = this.getValue(1)
    }

    public onUse(){
        var playerData = PKC.playerData;
        PKCodeUI.getInstance().bottomCon.addChild(this.mc)
        this.step = this.totalStep
        this.mc.x = playerData.x
        this.mc.y = playerData.y
        return true;
    }

    public onStep(){
        if(this.step > 0)
        {
            this.step --;
            this.mc.rotation += 3;

            var playerData = PKC.playerData;
            if(this.step%30 == 0 && MyTool.getDis(playerData,this.mc) < 200)
            {
                if(playerData.hp < playerData.maxHp)
                    playerData.addHp(this.addHp)
            }


            if(this.step == 0)
            {
                MyTool.removeMC(this.mc)
            }
        }
    }

    public onRemoveSkill(){
        MyTool.removeMC(this.mc)
    }
}