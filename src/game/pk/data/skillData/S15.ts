class S15 extends SBase{
    constructor() {
        super();
    }

    public hurt = 100
    public hurtDis = 100


    public onCreate(){
        this.hurt = this.getValue(2)
        this.hurtDis = this.getValue(1)
    }

    public onUse(){
        PKCodeUI.getInstance().addBomb(PKC.playerData,this.hurt,this.hurtDis)
        return true;
    }
}