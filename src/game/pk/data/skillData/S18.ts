class S18 extends SBase{
    constructor() {
        super();
    }

    public data = {
        id:18,
        hp:300,
        hurtDis:100,
        hurt:10,
        step:30*5
    }


    public onCreate(){
        this.data.hurt = this.getValue(1)
        this.data.hp = PKTool.getStepByTime(this.getValue(2)*1000)
        this.data.step = PKTool.getStepByTime(this.getValue(3)*1000)
    }
    public onUse(){
        PKCodeUI.getInstance().addTrap(this.data)
        return true;
    }
}