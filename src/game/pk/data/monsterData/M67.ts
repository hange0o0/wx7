class M67 extends MBase{
    //骷髅矿工  死后变骷髅士兵*2
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this)
    }

    public onDie(){
        MTool.addNewMonster({mid:65,x:this.x - 20,y:this.y})
        MTool.addNewMonster({mid:65,x:this.x + 20,y:this.y})
    }
}