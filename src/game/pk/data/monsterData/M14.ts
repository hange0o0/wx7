class M14 extends MBase{
    //盾卫    高防
    constructor() {
        super();
    }

    public beHitRate = 0.5
    public atkFun(){
        MTool.nearAtkFun(this)
    }
}