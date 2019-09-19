class M15 extends MBase{
    //近战巫师 死后变成毒巫师
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this)
    }

    public onDie(){
        MTool.addNewMonster({mid:16,x:this.x,y:this.y})
    }
}