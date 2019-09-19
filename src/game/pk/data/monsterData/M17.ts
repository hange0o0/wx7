class M17 extends MBase{
    //铁甲卫士  不会被打退
    constructor() {
        super();
    }
    public hitBackAble = false;
    public atkFun(){
        MTool.nearAtkFun(this)
    }
}