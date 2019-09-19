class M41 extends MBase{
    //蓝石守卫  攻击范围大
    constructor() {
        super();
    }

    public atkDisAdd = 60//判断命中时，增加的判断距离
    public atkFun(){
        MTool.nearAtkFun(this,()=>{
            PKC.playerData.stopEnd = Math.max(PKC.playerData.stopEnd,PKC.actionStep + 10)
        })
    }
}