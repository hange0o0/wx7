class CacheManager_wx4{

    private static _instance:CacheManager_wx4;
    public static getInstance():CacheManager_wx4 {
        if (!this._instance)
            this._instance = new CacheManager_wx4();
        return this._instance;
    }
    public registerData = {};
    public table = {};

    private cacheLoad = {};

    public constructor() {
        this.register(MonsterVO)
        this.register(GunVO)
        this.register(LevelVO)
    }

    private register(cls)
    {
        this.registerData[cls.dataKey] = cls;
    }

    //初始化数据
    public initData(data,key){
        if(!this.table[key])
            this.table[key] = {};
        data = data.replace(/\r/g,'')
        var rows = data.split('\n')
        var fieldDelim = '\t';
        var fields: Array<string> = String(rows[0]).split(fieldDelim);
        for(var i: number = 1;i < rows.length;i++) {
            var s: string = rows[i];
            if(s != null && s != "") {
                var cols: Array<any> = s.split(fieldDelim);
                var cls = this.registerData[key];
                var vo:any = new cls();
                for(var j: number = 0;j < fields.length;j++) {
                    var value = cols[j];
                    vo[fields[j]] = (value && value.length<20 && !isNaN(value)) ? Number(value) : value;
                }
                vo.reInit();
                this.table[key][vo[cls.key]] = vo;
            }
        }
    }

    //静态数据初始化后调用
    public initFinish(){

    }


}


//var a;
//var arr1 = [];
//for(var s in a)
//{
//    if(typeof a[s] == 'number')
//        arr1.push('public ' + s + ': number;')
//    else
//        arr1.push('public ' + s + ': string;')
//
//}
//for(var s in a)
//{
//    arr1.push('this.' + s + ' = data.' + s)
//}
//console.log(arr1.join('\n'))
