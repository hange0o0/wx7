class M108 extends MBase{
    //恶魔波利  死后爆出N个自爆
    constructor() {
        super();
    }

    public onDie(){
        this.createMonster(61)
        this.createMonster(62)
        this.createMonster(63)
        this.createMonster(70)
        this.createMonster(76)

    }

    private createMonster(mid){
        var x = this.x + 200*Math.random()-100
        var y = this.y + 200*Math.random()-100
        var mDate = MTool.addNewMonster({mid:mid,x:x,y:y})
        mDate.atkEnd = PKC.actionStep + 30
    }
}