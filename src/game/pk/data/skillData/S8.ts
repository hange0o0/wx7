class S8 extends SBase{
    constructor() {
        super();
    }

    public hurt = 60
    public step = 100
    public yunStep = 100
    public distance = 100
    public onCreate(){

        this.distance = this.getValue(1)
        this.yunStep = PKTool.getStepByTime(this.getValue(2)*1000)
        this.hurt = this.getValue(3)
    }

    public onUse(){
        var playerData = PKC.playerData;
        var item = playerData.relateItem;
        playerData.isSkilling = this.sid;
        playerData.isSkillingStopMove = true;



        this.step = 10;


        PKTool.playMV({
            mvType:1,
            num:4,
            key:'zhen',
            type:'on',
            anX:167/2,
            anY:145/2,
            item:item,
            once:true,
            //xy:{x:100,y:100}
        })

        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var atk = this.hurt
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(!monster.beSkillAble)
                continue;

            var dis = MyTool.getDis(monster,playerData)
            if(dis < this.distance)
            {
                monster.addHp(-atk);
                monster.relateItem.setYun(this.yunStep)
            }
        }

        return true;

    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        this.step --;
        if(this.step <= 0)
        {
            playerData.isSkilling = 0;
            playerData.isSkillingStopMove = false;
        }
    }
}