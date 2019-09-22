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
    public constructor() {

    }

    public reInit(){

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