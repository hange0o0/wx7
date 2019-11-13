class LevelVO {
    public static dataKey = 'level';
    public static key = 'id';
    public static getObject(id): LevelVO{ //id有可能带\n or \r
        return CM_wx4.table[this.dataKey][Math.floor(id)];
    }
    public static get data(){
        return CM_wx4.table[this.dataKey]
    }

    private static _list
    public static get list(){
        if(!this._list)
            this._list = ObjectUtil_wx4.objToArray(this.data);
        return this._list;
    }

    public static swap(id1,id2){
        var vo1 = this.getObject(id1)
        var vo2 = this.getObject(id2)
        vo2.id = id1
        vo1.id = id2
        this.data[vo1.id] = vo1
        this.data[vo2.id] = vo2
        ArrayUtil_wx4.sortByField(LevelVO.list,['id'],[0])
    }


    public static clear(){
        this._list = null;
        delete CM_wx4.table[this.dataKey]
    }

    public static thumbMap
    public static thumbGroup = new eui.Group()


    public id: number;
    public width: number;
    public height: number;
    public hard: number;
    public data: string;


    public roadNum = 0
    public roundNum = 0
    public towerNum = 0
    public pathNum = 0
    public forceRate = 1
    public monsterArr
    public heroPos
    public thumb
    public constructor() {

    }

    public getHpRate(){
        return (1 + (this.id-1 + this.hard)/4)// * this.forceRate*(1+0.15*this.towerNum)
    }

    public reInit(){
        this.hard = this.hard || 0
        this.reset();
    }

    public reset(monsterArr?){
        this.thumb = null;

        //回合数
        this.roundNum = Math.min(12,3 + Math.floor(this.id/10))


        //会出现的怪物
        if(monsterArr)
        {
            this.monsterArr = monsterArr;
        }
        else
        {
            this.monsterArr = []
            var lastRandomSeed  = TC.randomSeed
            TC.randomSeed = this.id*12345678901;
            var monsterList = [];
            var monsterObj = {};//最多出2个
            var lastID = 0//不会相邻出
            for(var s in MonsterVO.data)
            {
                var mvo = MonsterVO.data[s]
                if(mvo.level <= this.id)
                {
                    monsterList.push(mvo)
                    if(mvo.level == this.id)
                    {
                        lastID = mvo.id;
                        monsterObj[mvo.id] = (monsterObj[mvo.id] || 0) + 1
                        this.monsterArr.push(mvo.id)
                    }
                }
            }
            var roundNum = this.roundNum;
            while(this.monsterArr.length < roundNum)
            {
                var mvo = monsterList[Math.floor(TC.random()*monsterList.length)]
                if(mvo.id == lastID)
                    continue;
                if(monsterObj[mvo.id] && monsterObj[mvo.id] >= 2)
                    continue;
                this.monsterArr.push(mvo.id);
                lastID = mvo.id;
                monsterObj[mvo.id] = (monsterObj[mvo.id] || 0) + 1
            }
            TC.randomSeed = lastRandomSeed;
        }




        this.roadNum = 0//有多少条路
        this.towerNum = 0//有多少座塔
        var myDrawPath = 0
        var arr1 = this.data.split('');
        for(var i=0;i<arr1.length;i++)
        {
            if(arr1[i] == '5')
                this.roadNum ++;
            if(arr1[i] == '7')
                this.heroPos = {x:i%this.width,y:Math.floor(i/this.width)};
            if(arr1[i] == '2')
                this.towerNum ++;
            if(arr1[i] == '1')
                myDrawPath ++;
            if(arr1[i] == '1' || arr1[i] == '4')
                this.pathNum ++;
        }
        if(this.id == 1)
        {
            this.forceRate = 0.5;
        }
        else if(myDrawPath >= 5 && this.towerNum > 0)
        {
            this.forceRate = this.pathNum/(this.width*this.height)*2
        }

        if(!this.heroPos)
        {
            this.heroPos = {x:0,y:0}
        }

    }

    public getThumb(){
        if(!this.thumb)
        {
            this.thumb = new egret.RenderTexture()


            if(!LevelVO.thumbMap)
            {
                LevelVO.thumbMap = new PKMap();
                LevelVO.thumbGroup.addChild(LevelVO.thumbMap)
                LevelVO.thumbMap.x = 0
                LevelVO.thumbMap.y = 32
            }

            var pkMap = LevelVO.thumbMap
            var group = LevelVO.thumbGroup



            GameManager_wx4.container.addChild(group)
            pkMap.width = 64*this.width
            pkMap.height = 64*this.height
            pkMap.initMap(this.id)
            pkMap.draw(this.getRoadData(),true);
            pkMap.sortY();

            group.width = pkMap.width
            group.height = pkMap.height + 64
            group.validateNow()
            var scale = Math.min(140/group.width,160/group.height,0.25)
            this.thumb.drawToTexture(group,null,scale)
            //this.thumb.drawToTexture(group)
            MyTool.removeMC(group)
        }


        return this.thumb
    }



    public getRoadData(showPath = false){
        if(showPath)
            var str = this.data
        else
            var str = this.data.replace(/1/g,'0')

        var arr = str.split('');
        var resultData = [];
        for(var i=0;i<this.height;i++)
        {
            resultData.push(arr.slice(i*this.width,(i+1)*this.width))
        }
        return resultData
    }
}