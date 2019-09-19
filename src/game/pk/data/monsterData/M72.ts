class M72 extends MBase{
    //红袍怨灵 召唤骷髅弓箭
    constructor() {
        super();
    }

    public atkFun(){
        if(PKC.monsterList.length >= PKC.maxMonsterNum)
            return;
        MTool.addNewMonster({mid:64,x:this.x - 30 + Math.random()*60,y:this.y - 30 + Math.random()*60})
    }
}