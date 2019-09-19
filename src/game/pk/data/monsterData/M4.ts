class M4 extends MBase{
    constructor() {
        super();
    }
//矿工    基础
    public atkFun(){
        MTool.nearAtkFun(this,()=>{
            PKC.playerData.stopEnd = Math.max(PKC.playerData.stopEnd,PKC.actionStep + 10)
        })
    }
}