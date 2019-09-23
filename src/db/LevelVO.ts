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


    public id: number;
    public width: number;
    public height: number;
    public data: string;


    private roadNum = 0
    private roundNum = 0
    private monsterArr
    public constructor() {

    }

    public reInit(){

    }

    //回合数
    public getRoundNum(){
        if(!this.roundNum)
            this.roundNum = Math.min(10,3 + Math.floor(this.id/10))
        return this.roundNum
    }

    //怪物列表
    public getMonsterArr(){
        if(!this.monsterArr)
        {
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

            var roundNum = this.getRoundNum();
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
        }

        return this.monsterArr
    }

    public getRoadNum(){
        if(!this.roadNum)
        {
            var arr1 = this.data.split('');
            for(var i=0;i<arr1.length;i++)
            {
                if(arr1[i] == '5')
                    this.roadNum ++;
            }
        }
        return this.roadNum;
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