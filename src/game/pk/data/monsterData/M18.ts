class M18 extends MBase{
    //饥饿兽人  自动回血
    constructor() {
        super();
    }
    public atkFun(){
        MTool.nearAtkFun(this)
    }

    private lastHurtTime = 0;
    public onStep(){
        if(PKC.actionStep - this.lastHurtTime < 30 || this.hp >= this.maxHp)
            return;
        this.addHp(this.atk);
        this.lastHurtTime = PKC.actionStep
    }
}