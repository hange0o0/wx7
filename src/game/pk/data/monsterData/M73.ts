class M73 extends MBase{
    //木乃伊   吸血
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this,()=>{
            if(this.hp < this.maxHp)
                this.addHp(this.atk);
        })
    }
}