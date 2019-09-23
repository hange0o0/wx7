class TowerCode {
    private static instance:TowerCode;

    public static getInstance() {
        if (!this.instance) this.instance = new TowerCode();
        return this.instance;
    }


    public frameRate = 30   //PKTool.getStepByTime 也要改

    public actionStep = 0;
    public forceRate = 1;//塔的战力加成
    public monsterHPRate = 1;//怪物生成值加成



    public round = 1;
    public maxRound = 1;
    public roundAutoMonster = []
    public totalAutoMonster = []
    public gunList = [1,1,1,2,2,3,3]//可选的武器




    public isStop = false
    public randomSeed = 99999999;

    public isPKing = false

    private dataArr
    private astar



    public skillBase = {
        1:{name:'攻击提升',des:'提升场上所有武器 #1% 的攻击力，持续 #2 秒',cd:30,value1:50,value2:10},
        2:{name:'攻速提升',des:'提升场上所有武器 #1% 的攻击速度，持续 #2 秒',cd:30,value1:50,value2:10},
        3:{name:'大地震击',des:'使当前场上所有怪物晕眩 #1 秒',cd:30,value1:5},
        4:{name:'急速冷却',des:'使当前场上所有怪物减速 #1% ，持续 #2 秒',cd:30,value1:50,value2:10},
        5:{name:'闪电风暴',des:'召唤闪电攻击场上所有怪物，造成 #1 点伤害',cd:40,value1:100},
    }
    public lastSkillTime = {};

    public constructor(){
        this.dataArr = new GardenAStarModel()
        this.astar = new AStar(this.dataArr)
    }


    public random(seedIn?){
        var seed = seedIn || this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        if(!seedIn)
            this.randomSeed = rd * 100000000;
        return rd;
    }

    public getMonsterPosByPath(path){
        if(!path)
            return null
        return{
            x:path[0]*64+32,
            y:path[1]*64+32 + 20,
        }
    }


    public getSkillCD(sid){
        return this.lastSkillTime[sid] || 0
    }

    public onSkillUse(sid){
        this.lastSkillTime[sid]  = this.skillBase[sid].cd*this.frameRate
    }



    //每一步执行
    public onStep(){
        this.actionStep ++;
        for(var s in this.lastSkillTime)
        {
            if(this.lastSkillTime[s] > 0)
                this.lastSkillTime[s] --;
        }
        this.autoAction();//上怪
    }

    //自动出战上怪
    public autoAction(){
        if(this.roundAutoMonster.length == 0)//加入新的关卡
        {
            if(this.totalAutoMonster[0])
            {
                this.roundAutoMonster = this.totalAutoMonster.shift();
                this.round ++;
            }
        }

        if(this.roundAutoMonster[0] && this.roundAutoMonster[0].step <= this.actionStep)
        {
            var data = this.roundAutoMonster.shift();
            var mid = _get['mid'] || data.id;
            PKTowerUI.getInstance().addMonster(mid,data.road)
        }
    }




    public initData(level){
        this.isStop = false;
        this.actionStep = 0;
        this.lastSkillTime = {}
        PKMonsterAction_wx3.getInstance().init();
        this.roundAutoMonster.length = 0;
        this.totalAutoMonster = this.getLevelMonster(level);
        this.gunList = [1,1,1,2,2,3,3];
        this.monsterHPRate = 1 + level/4
    }


    public getLevelMonster(level){
        this.randomSeed = level*1234567890;

        var vo = LevelVO.getObject(level);
        var roadNum = vo.getRoadNum()

        var monsterList = vo.getMonsterArr().concat();


        var returnArr = []

        this.maxRound = monsterList.length;
        this.round = 0;
        var step = 10

        var roadIndex = 0;
        var maxCost = 60 * 10 * Math.pow(level,1.2)
        var roundTimeStep = 30*15 + Math.floor(Math.pow(level,1.1))

        while(monsterList.length > 0)
        {
            var mvo = MonsterVO.getObject(monsterList.shift())

            var roadRandom = roadIndex == roadNum;
            if(roadRandom)
                roadIndex = 0

            var list = [];
            returnArr.push(list);

            var num = Math.round(maxCost/mvo.cost);
            var stepAdd = Math.round(roundTimeStep/num);
            while(num > 0)
            {
                num --;
                list.push({
                    id:mvo.id,
                    step:step,
                    road:roadIndex,
                    })
                step += stepAdd;
                if(roadRandom)
                {
                    roadIndex ++;
                    if(roadIndex >= roadNum)
                        roadIndex = 0;
                }
            }
            step += 3*30;//两波怪之间的间隔
            roadIndex ++;
            if(roadRandom)
                roadIndex = 0;

        }

        return returnArr
    }


    //返回一条路
    public findPath(arr)
    {
        this.dataArr.reset();
        var startPos = [];
        var endPos = []
        for(var i=0;i<arr.length;i++)
        {
            for(var j=0;j<arr[i].length;j++)
            {
                var type = arr[i][j]
                if(type == 5)
                    startPos.push({x:j,y:i});
                if(type == 6)
                    endPos.push({x:j,y:i});
                if(type == 1 || type == 4 || type == 5 || type == 6)
                    this.dataArr.setOK(i,j)
            }
        }
        if(startPos.length == 0)
            return null
        if(endPos.length == 0)
            return null
        var results = []
        for(var i=0;i<startPos.length;i++)
        {
            //找最近一条路
            var endPath:any = null;
            for(var j=0;j<endPos.length;j++)
            {
                var path = this.astar.find(startPos[i].x, startPos[i].y, endPos[j].x, endPos[j].y)
                if(path)
                {
                    if(!endPath || endPath.length > path.length)
                        endPath = path;
                }
            }
            results.push(endPath)
        }
        return results;
    }

    public resetWalkArr(walkArr){
        for (var i = 2; i < walkArr.length; i++) {
            var o1 = walkArr[i - 2];
            var o2 = walkArr[i - 1];
            var o3 = walkArr[i];
            if (o1[0] == o2[0] && o2[0] == o3[0]) {
                walkArr.splice(i - 1, 1)
                i--;
                continue;
            }
            if (o1[1] == o2[1] && o2[1] == o3[1]) {
                walkArr.splice(i - 1, 1)
                i--;
                continue;
            }
        }
        return walkArr
    }
}