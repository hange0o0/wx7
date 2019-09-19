class M65 extends MBase{
    //骷髅士兵  平
    constructor() {
        super();
    }

    public callAble = false
    public skillDis = 1000//技能距离
    public skillCD = 1//技能间隔
    public canSkill(){
        return this.callAble
    }

    public skillFun(){
        MTool.addNewMonster({mid:65,x:this.x - 50 + Math.random()*100,y:this.y - 50 + Math.random()*100})
        MTool.addNewMonster({mid:65,x:this.x - 50 + Math.random()*100,y:this.y - 50 + Math.random()*100})
        this.callAble = false;
    }


    public atkFun(){
        MTool.nearAtkFun(this)
    }
}