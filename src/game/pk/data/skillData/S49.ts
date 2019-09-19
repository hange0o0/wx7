class S49 extends SBase{
    constructor() {
        super();
    }

    public dis = 300
    public hurt = 30

    public onCreate(){
        this.dis = this.getValue(1)
        this.hurt = this.getValue(2)
    }


    public onStep(){
        if(PKC.actionStep%30 == 0)
        {
            var playerData = PKC.playerData;
            var monsterList = PKC.monsterList;
            var len = monsterList.length;
            for(var i=0;i<len;i++)
            {
                var monster2 = monsterList[i];
                if(monster2.isDie)
                    continue;
                var dis = MyTool.getDis(monster2,playerData)
                if(dis < this.dis)
                {
                    monster2.addHp(-this.hurt);
                }
            }
        }
    }
}