class S16 extends SBase{
    constructor() {
        super();
    }

    public data = {
        id:16,
        hp:300,
        hurtDis:100,
        hurt:50,
    }

    public hurtRate

    public onCreate(){
        this.hurtRate = this.getValue(1)/100
        this.data.hp = PKTool.getStepByTime(this.getValue(2)*1000)
        this.data.hurtDis = PKC.playerData.atkDis/2
    }

    public onUse(){
        this.data.hurt = Math.ceil(PKC.playerData.atk * this.hurtRate);
        PKCodeUI.getInstance().addTrap(this.data)
        return true;
    }
}