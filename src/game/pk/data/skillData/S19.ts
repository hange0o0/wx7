class S19 extends SBase{
    constructor() {
        super();
    }

    public data = {
        id:19,
        hp:300,
        hurtDis:100,
        hurt:10,
    }


    public onCreate(){
        this.data.hurtDis = this.getValue(1)
        this.data.hurt = this.getValue(3)
        this.data.hp = PKTool.getStepByTime(this.getValue(2)*1000)
    }

    public onUse(){
        PKCodeUI.getInstance().addTrap(this.data)
        return true;
    }
}