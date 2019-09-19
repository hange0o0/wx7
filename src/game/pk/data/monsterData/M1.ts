class M1 extends MBase{
    constructor() {
        super();
    }
//雷电法师 召唤闪电
    public atkFun(){
        MTool.markAtkFun(200,5,{
            owner:this,
            hurt:this.atk,
            sound:'thurder',
            mv:{
                url:'monster1_mv',
                num:3,
                anX:91/2,
                anY:208*0.8,
            }
        })

    }
}