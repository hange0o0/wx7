class S13 extends SBase{
    constructor() {
        super();
    }

    public hurt = 100
    public maxNum = 10
    public hurtID = {}
    public minDis = 200


    public lastMonster
    public leftNum
    public onCreate(){
        this.hurt = this.getValue(1)
        this.maxNum = this.getValue(2)
    }

    public onUse(){
        this.hurtID = {};
        var playerData = PKC.playerData;
        playerData.isSkilling = this.sid;
        playerData.isSkillingStopMove = true;

        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        if(len == 0)
            return false;
        var minMonster;
        var minDis;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(!monster.beSkillAble)
                continue;

            var dis = MyTool.getDis(monster,playerData)
            if(!minMonster || dis < minDis)
            {
                minMonster = monster
                minDis = dis
            }
        }
        if(!minMonster)
            return false;

        this.hurtID[minMonster.onlyID] = 1
        minMonster.addHp(-this.hurt)
        PKTool.showLight(playerData,minMonster.getHitPos())
        this.leftNum = this.maxNum - 1
        this.lastMonster = minMonster

        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;

        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var minMonster;
        var minDis = this.minDis + 1;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(this.hurtID[monster.onlyID])
                continue
            if(!monster.beSkillAble)
                continue;

            var dis = MyTool.getDis(monster,this.lastMonster)
            if(dis <= minDis)
            {
                minMonster = monster
                minDis = dis
            }
        }
        if(minMonster)
        {
            this.hurtID[minMonster.onlyID] = 1
            minMonster.addHp(-Math.ceil(this.hurt*this.leftNum/this.maxNum))
            PKTool.showLight(this.lastMonster.getHitPos(),minMonster.getHitPos())
            this.lastMonster = minMonster;

            this.leftNum --;
            if(this.leftNum > 0)
                return;
        }

        playerData.isSkilling = 0
        playerData.isSkillingStopMove = false;
    }
}