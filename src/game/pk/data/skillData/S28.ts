class S28 extends SBase{
    constructor() {
        super();
    }

    public totalStep = 200
    public step = 0

    public lasPos

    private mc = new eui.Image('28_png')
    public onCreate(){
        this.mc.anchorOffsetX = 216/2
        this.mc.anchorOffsetY = 176/2
        this.mc.scaleX = this.mc.scaleY = 0.8;

        this.totalStep = PKTool.getStepByTime(this.getValue(1)*1000)
    }
    public onUse(){
        var playerData = PKC.playerData
        this.lasPos = {x:playerData.x,y:playerData.y}

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

            if(this.step == 0)
            {
                MyTool.removeMC(this.mc)
                var player = PKC.playerData.relateItem
                player.resetXY(this.lasPos.x,this.lasPos.y);
                var mv = PKTool.playMV({
                    mvType:1,
                    num:5,
                    key:'zhaohuan',
                    type:'on',
                    anX:98/2,
                    anY:89/2,
                    item:player,
                    once:true,
                })
                mv.scaleX = mv.scaleY = 1.5
            }
        }
    }

    public onRemoveSkill(){
        MyTool.removeMC(this.mc)
    }
}