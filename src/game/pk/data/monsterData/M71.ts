class M71 extends MBase{
    //巫妖  召唤兵+箭
    constructor() {
        super();
    }

    public atkFun(){
        if(PKC.monsterList.length >= PKC.maxMonsterNum)
            return;
        MTool.addNewMonster({mid:64,x:this.x - 30 + Math.random()*60,y:this.y - 30 + Math.random()*60})
        MTool.addNewMonster({mid:65,x:this.x - 30 + Math.random()*60,y:this.y - 30 + Math.random()*60})
        MTool.addNewMonster({mid:65,x:this.x - 30 + Math.random()*60,y:this.y - 30 + Math.random()*60})
    }

}