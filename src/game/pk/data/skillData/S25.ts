class S25 extends SBase{
    constructor() {
        super();
    }

    public hurt = 200

    public onCreate(){
        this.hurt = this.getValue(1)
    }


    public onUse(){
        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie || monster.relateItem.fireStep <= 0)
                continue;
            if(!monster.beSkillAble)
                continue;
            monster.relateItem.fireStep = 1;
            monster.addHp(-this.hurt)
        }
        return true;
    }
}