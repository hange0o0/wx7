class PKCode_wx4 {
    private static instance:PKCode_wx4;

    public static getInstance() {
        if (!this.instance) this.instance = new PKCode_wx4();
        return this.instance;
    }

    public isAuto = false;
    public frameRate = 30   //PKTool.getStepByTime 也要改
    public maxMonsterNum = 20   //场上最多存活怪物数量


    public playerData = new PlayerData()
    public actionStep = 0;
    public monsterList = [];

    public monsterAddAtk = 0
    public monsterAddSpeed = 0



    public chooseSkill = [];//玩家选择的技能
    public autoMonster = [];

    public isStop = false
    public haveReborn = false

    public maxBossNum = 0
    public roundMonsterNum = 0
    public maxStep = 0
    public randomSeed = 99999999;

    public isPKing = false
    public random(seedIn?){
        var seed = seedIn || this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        if(!seedIn)
            this.randomSeed = rd * 100000000;
        return rd;
    }




    //每一步执行
    public onStep(){
        this.actionStep ++;
        this.autoAction();//上怪
        //this.monsterAction();
        //this.monsterMove();
        PKMonsterAction_wx3.getInstance().actionAtk();//攻击落实
        //PKBulletManager_wx3.getInstance().actionAll();//攻击落实
        //this.actionFinish();
        //PlayManager.getInstance().onE();

        var len = this.monsterList.length;
        for(var i=0;i<len;i++)
        {
            var monster = this.monsterList[i];
            monster.onStep();
        }
    }

    //自动出战上怪
    public autoAction(){
        if(this.actionStep < 50)
            return;
        if(this.isAuto)
        {
            if(this.monsterList.length < 5)
            {
                if(this.autoMonster.length == 0)
                {
                    var mlv = (UM_wx4.level-1) || 1;
                    for(var s in MonsterVO.data)
                    {
                        if(MonsterVO.data[s].level <= mlv)
                        {
                            this.autoMonster.push(MonsterVO.data[s])
                        }
                    }
                    ArrayUtil_wx4.random(this.autoMonster,3)
                }
                var rota = Math.PI*2*Math.random()
                var monster = PKCodeUI.getInstance().addMonster(this.autoMonster.pop().id,this.playerData.x + Math.cos(rota)*500,this.playerData.y + Math.sin(rota)*500)
                this.monsterList.push(monster)
                if(monster.mid == 65)
                    monster.callAble = true
            }
            return;
        }

        while(this.canAddMonster())// && this.monsterList.length == 0
        {
            var data = this.autoMonster.shift()
            var mid = _get['mid'] || data.id;
            var monster =PKCodeUI.getInstance().addMonster(mid,this.playerData.x + data.x,this.playerData.y + data.y)
            this.monsterList.push(monster)
            if(monster.mid == 65)
                monster.callAble = true
            if(MonsterVO.getObject(mid).isHero())
            {
                SoundManager.getInstance().playEffect('boss')
            }
        }
    }

    private canAddMonster(){
        if(!this.autoMonster[0])
            return false;
        if(this.monsterList.length < 3)
            return true;
        if(this.monsterList.length >= 10)
            return false;
        return this.autoMonster[0].step <= this.actionStep
    }



    public initData(){
        this.monsterAddAtk = 0
        this.monsterAddSpeed= 0
        this.isStop = false;
        this.haveReborn = false;
        this.actionStep = 0;
        this.monsterList.length = 0;
        PKMonsterAction_wx3.getInstance().init();
        this.autoMonster = this.getLevelMonster(UM_wx4.level);
        this.maxStep = this.autoMonster[this.autoMonster.length-1].step + (30 + this.maxBossNum*20)*this.frameRate;
        //PKBulletManager_wx3.getInstance().freeAll();
    }

    public getLevelMonster(level){
        this.randomSeed = level*1234567890;
        //this.randomSeed = Math.random()*1234567890;

        var maxCost = 90 + level*Math.pow(1.02,level)*10;  //每一关增加的花费
        var stepCost = maxCost/Math.min(300,27 + level*3)/30;//每一关增加的时间
        var nowCost = 0;
        var step = 50;
        var monsterCost = -10;
        var monsterList = [];
        var mlv = level;
        for(var s in MonsterVO.data)
        {
            if(MonsterVO.data[s].level <= mlv && !MonsterVO.data[s].isHero())
            {
                monsterList.push(MonsterVO.data[s])
            }
        }
        if(monsterList.length > 10)//同一次最多出场10种怪物
        {
            var temp = [];
            for(var i=0;i<10;i++)
            {
                var index = Math.floor(this.random()*monsterList.length)
                temp.push(monsterList[index])
                monsterList.splice(index,1);
            }
            monsterList = temp;
        }

        ArrayUtil_wx4.sortByField(monsterList,['cost','id'],[0,0]);
        var minRate = this.random()*0.8;//出现小怪的机率
        var minRateAdd = 0.2 + this.random()*0.3;//出现小怪的机率
        var list = [];
        //list.push(103+'|' + step + '|' +50)

        var needAddBoss = level%5 == 0
        var bossNum = Math.ceil(level/(9*5))
        this.maxBossNum = needAddBoss?bossNum:0
        
        var bossRate = 0.5//Math.max(0.5,1-level/50);
        while(nowCost < maxCost)
        {
            while(monsterCost < nowCost)
            {
                if(this.random() < minRate)
                    var vo = monsterList[Math.floor(monsterList.length*this.random()*minRateAdd)]
                else
                    var vo = monsterList[Math.floor(monsterList.length*this.random())]
                var rotation = Math.PI*2*Math.random()
                list.push({
                    id:vo.id,
                    step:step,
                    x:Math.cos(rotation) * 500,
                    y:Math.sin(rotation) * 500,
                })
                monsterCost += vo.cost;
            }
            step++;
            nowCost += stepCost


            if(needAddBoss && nowCost/maxCost > bossRate)
            {
                var boss = [101,102,104,105,106,107,108,109,110]
                needAddBoss = false;
                nowCost += 10;//固定10费

                if(bossNum == 1)
                    list.push({
                        id:boss[Math.floor(level/5)],
                        step:step,
                        x:Math.cos(rotation) * 500,
                        y:Math.sin(rotation) * 500,
                    })
                else
                {
                    for(var i=0;i<bossNum;i++)
                    {
                        var index = Math.floor(Math.random() * boss.length)
                        var bossid =  boss[index]
                        boss.splice(index,1)
                        list.push({
                            id:bossid,
                            step:step,
                            x:Math.cos(rotation) * 500,
                            y:Math.sin(rotation) * 500,
                        })
                    }
                }
            }
        }
        this.roundMonsterNum = list.length;
        return list
    }
}