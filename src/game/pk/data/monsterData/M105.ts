class M105 extends MBase{
    //钢刺兽  吸血
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