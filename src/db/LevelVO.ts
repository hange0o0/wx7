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

    public static clear(){
        this._list = null;
        delete CM_wx4.table[this.dataKey]
    }


    public id: number;
    public width: number;
    public height: number;
    public data: string;


    public roadNum = 0
    public roundNum = 0
    public towerNum = 0
    public monsterArr
    public constructor() {

    }

    public reInit(){
        this.reset();
    }

    public reset(){
        //回合数
        this.roundNum = Math.min(10,3 + Math.floor(this.id/10))


        //会出现的怪物
        this.monsterArr = []
        var lastRandomSeed  = TC.randomSeed
        TC.randomSeed = this.id*12345678901;
        var monsterList = [];
        for(var s in MonsterVO.data)
        {
            if(MonsterVO.data[s].level <= this.id)
            {
                monsterList.push(MonsterVO.data[s])
            }
        }
        var roundNum = this.roundNum;
        var lastID = 0;
        while(this.monsterArr.length < roundNum)
        {
            var mvo = monsterList[Math.floor(TC.random()*monsterList.length)]
            if(mvo.id == lastID)
                continue;
            this.monsterArr.push(mvo.id);
            lastID = mvo.id;
        }
        TC.randomSeed = lastRandomSeed;



        this.roadNum = 0//有多少条路
        this.towerNum = 0//有多少座塔
        var arr1 = this.data.split('');
        for(var i=0;i<arr1.length;i++)
        {
            if(arr1[i] == '5')
                this.roadNum ++;
            if(arr1[i] == '2')
                this.towerNum ++;
        }
    }



    public getRoadData(){
        var arr = this.data.split('');
        var resultData = [];
        for(var i=0;i<this.height;i++)
        {
            resultData.push(arr.slice(i*this.width,(i+1)*this.width))
        }
        return resultData
    }
}