class S3 extends SBase{
    constructor() {
        super();
    }

    public atkRate = 1.5
    public disRate = 0.5
    public totalStep = 5
    public speed = 60

    public endStep
    public rotation;
    public lastHitMonsterTime = {}
    public onCreate(){
        this.atkRate = this.getValue(2)/100
        this.totalStep = Math.ceil(this.getValue(1)/this.speed)
    }

    public onUse(){
        var playerData = PKC.playerData;
        playerData.isSkilling = this.sid
        this.endStep = PKC.actionStep + this.totalStep


        var monster = MTool.getNearMonster();
        if(!monster)
            return false;

        var pos = monster.getHitPos();
        var rota = Math.atan2(pos.y-playerData.y,pos.x-playerData.x)


        var item = playerData.relateItem;
        this.rotation = rota;
        item.roleCon.rotation = rota/Math.PI*180+90
        item.cleanTween();

        item.leftCon.scaleX = -1;
        item.leftCon.rotation =  80
        item.leftCon.x = 60;
        item.leftCon.y = -20;

        item.rightCon.rotation =  -80
        item.rightCon.x = 20;
        item.rightCon.y = -20;

        item.body.x = 40
        item.body.y = 50

        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        var actionStep = PKC.actionStep;
        var item = playerData.relateItem;
        var speed = this.speed;
        var angle = this.rotation;
        var targetX = playerData.x + Math.cos(angle)*speed
        var targetY = playerData.y + Math.sin(angle)*speed
        if(this.endStep <= PKC.actionStep)
        {
            playerData.isSkilling = 0;
            playerData.relateItem.showDoubleMV();
            playerData.relateItem.atkFront({x:targetX,y:targetY},true);
            return;
        }
        item.resetXY(targetX,targetY)

        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var atk = Math.ceil(playerData.getAtk()*this.atkRate);
        var atkDis = 80
        var hitBack = 100
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(this.lastHitMonsterTime[monster.onlyID] && actionStep - this.lastHitMonsterTime[monster.onlyID] < 15)
                continue;

            var dis = MyTool.getDis(monster,playerData)
            if(dis < atkDis)
            {
                this.lastHitMonsterTime[monster.onlyID] = actionStep
                monster.addHp(-atk);

                if(hitBack && monster.hitBackAble)//可击退
                {
                    var rotaBase = PKTool.getRota(playerData,monster);
                    var x = Math.cos(rotaBase)*hitBack
                    var y = Math.sin(rotaBase)*hitBack
                    monster.relateItem.resetXY(monster.x+x,monster.y+y)
                }
                playerData.addGunBuff(monster)
            }
        }
    }
}