class S14 extends SBase{
    constructor() {
        super();
    }

    public hurt = 100
    public maxNum = 5
    public minDis = 300


    public onCreate(){
        this.hurt = this.getValue(2)
        this.maxNum = this.getValue(1)
    }

    public onUse(){

        var playerData = PKC.playerData;


        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var nearMonster = [];
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(!monster.beSkillAble)
                continue;

            var dis = MyTool.getDis(monster,playerData)
            if(dis > this.minDis)
                continue;
            nearMonster.push(monster)
        }

        if(nearMonster.length > this.maxNum)
        {
            ArrayUtil_wx4.random(nearMonster)
            nearMonster.length = this.maxNum
        }

        len = nearMonster.length;
        for(var i=0;i<len;i++)
        {
            var monster = nearMonster[i];
            monster.addHp(-this.hurt)
            PKTool.showLight(playerData,monster.getHitPos())
        }

        return true;
    }
}