class TowerCode {
    private static instance:TowerCode;

    public static getInstance() {
        if (!this.instance) this.instance = new TowerCode();
        return this.instance;
    }


    public frameRate = 30   //PKTool.getStepByTime 也要改

    public actionStep = 0;
    public monsterList = [];



    public round = 1;
    public maxRound = 1;
    public roundAutoMonster = []
    public totalAutoMonster = []



    public isStop = false
    public randomSeed = 99999999;

    public isPKing = false

    private dataArr
    private astar

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




    //每一步执行
    public onStep(){
        this.actionStep ++;
        this.autoAction();//上怪
        var len = this.monsterList.length;
        for(var i=0;i<len;i++)
        {
            var monster = this.monsterList[i];
            monster.onStep();
        }


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
            var monster = PKTowerUI.getInstance().addMonster(mid,data.road)
            this.monsterList.push(monster)
        }
    }




    public initData(level){
        this.isStop = false;
        this.actionStep = 0;
        this.monsterList.length = 0;
        PKMonsterAction_wx3.getInstance().init();
        this.roundAutoMonster.length = 0;
        this.totalAutoMonster = this.getLevelMonster(level);
    }


    public getLevelMonster(level){
        this.randomSeed = level*1234567890;

        var vo = LevelVO.getObject(level);
        var roadNum = vo.getRoadNum()

        var monsterList = [];
        for(var s in MonsterVO.data)
        {
            if(MonsterVO.data[s].level <= level && !MonsterVO.data[s].isHero())
            {
                monsterList.push(MonsterVO.data[s])
            }
        }

        var returnArr = []


        var round = Math.min(10,3 + Math.floor(level/10))
        this.maxRound = round;
        this.round = 0;
        var step = 10
        while(round > 0)
        {
            var roadIndex = 0;
            var roadRandom = Math.random()<0.3;
            if(roadNum > 1)
            {
                roadIndex = Math.floor(this.random()*roadNum)
            }
            round --;
            var list = [];
            returnArr.push(list);
            var mvo = monsterList[Math.floor(this.random()*monsterList.length)]
            var num = 10;
            var stepAdd = 30;
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
            step += 10*30;
        }

        return returnArr
    }


    //返回一条路
    public findPath(arr)
    {
        this.dataArr.reset();
        var startPos = [];
        var endPos
        for(var i=0;i<arr.length;i++)
        {
            for(var j=0;j<arr[i].length;j++)
            {
                var type = arr[i][j]
                if(type == 5)
                    startPos.push({x:j,y:i});
                if(type == 6)
                    endPos = {x:j,y:i};
                if(type == 1 || type == 4 || type == 5 || type == 6)
                    this.dataArr.setOK(i,j)
            }
        }
        if(startPos.length == 0)
            return null
        if(!endPos)
            return null
        var results = []
        for(var i=0;i<startPos.length;i++)
        {
            results.push(this.astar.find(startPos[i].x, startPos[i].y, endPos.x, endPos.y))
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