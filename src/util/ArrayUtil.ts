class ArrayUtil_wx4 {
	public constructor() {
	}
		
    /**
    * 数组排序（只支持数值大小比较）
    * 例子：sortByField(ff, ["score","level","exp"], [1,1,1]);
    * @param data 源数组
    * @param fields 字段名
    * @param type 字段排序规则[0,0,0....] 0表示从小到大,其他任何值都是从大到小
    */
    public static sortByField(data:Array<any>, fields:Array<any>, type:Array<any>):Array<any>
    {
        if(data && fields && type && fields.length == type.length)
        {
            var copy:Array<any> = fields.slice();//复制一份
            var copy2:Array<any> = type.slice();//复制一份
            data.sort(listSort);
        }
        
        function listSort(a:Object, b:Object):number
        {
            if(a != null && b != null)
            {
                fields = copy.slice();
                type = copy2.slice();
                while(fields.length > 0)
                {
                    if(<number>(a[fields[0]]) < <number>(b[fields[0]]))
                    {
                        return (type[0] == 0 || type[0] == -1 ? -1 : 1);
                        break;
                    }
                    else if(<number>(a[fields[0]]) > <number>(b[fields[0]]))
                    {
                        return (type[0] == 0 || type[0] == -1 ? 1 : -1);
                        break;
                    }
                    else
                    {
                        fields.shift();
                        type.shift();
                    }
                }
            }
            return 0;
        }
        return data;
    }
    
    public static randomOne(arr:Array<any>,splice = false):any{
        var index = Math.floor(arr.length * Math.random())
        var data = arr[index];
        if(splice)
            arr.splice(index,1);
        return data;
    }

    public static removeItem(arr:Array<any>,item):boolean{
        var index = arr.indexOf(item);
        if(index == -1)
            return false
        arr.splice(index,1);
        return true;
    }

    public static random(arr,deep = 1){
        while(deep--)
        {
            arr.sort(rdFun);
        }

        function rdFun(){
            return Math.random()>0.5?-1:1;
        }

    }
    
    public static disposeList(itemList: Array<any>):void{
        if(itemList) {
            for(var i = 0;i < itemList.length;i++) {
                var item:any = itemList[i];
                if(item.parent)
                    item.parent.removeChild(item);
                item.dispose();
            }
        }
        itemList = [];
    }

    public static indexOfByKey(arr:Array<any>, key:string | number, value:any):number{
        if(arr) {
            for(var i = 0;i < arr.length;i++) {
                var item:any = arr[i];
                if(item[key] == value){
                    return i;
                }
            }
            return -1;
        }
        return -1;
    }

    public static indexOf(arr,value,key?){
        for(var i=0;i<arr.length;i++)
        {
            if(key)
            {
                if(arr[i][key] == value)
                    return i;
            }
            else
            {
                if(arr[i] == value)
                    return i;
            }

        }
        return -1;
    }

    public static randomByRate(arr,key='rate'){
        var count = 0
        for(var s in arr)
        {
            count += arr[s][key]
        }
        var rate = count * Math.random();
        var indexCount = 0;
        for(var i=0;i<arr.length;i++)
        {
            var vo = arr[i];
            indexCount += vo[key];
            if(indexCount >= rate)
            {
                return vo;
            }
        }
        return arr[0];
    }

    public static randomNumByRate(rates,num,key='rate',value='@whole'){
        var arr = []
        for(var i=0;i<num;i++) {
            var skillData = ArrayUtil_wx4.randomByRate(rates,key)
            if(skillData) {
                var index = rates.indexOf(skillData);
                if(index != -1)
                    rates.splice(index,1)
                if(value == '@whole')
                    arr.push(skillData)
                else
                    arr.push(skillData[value])
            }
        }
        return arr;
    }
}
