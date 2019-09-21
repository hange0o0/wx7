class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public jumpPK = false;
    public stop = 0;
    public winCardArr = [];
    public finishFun = function(winArr){return false}


    public constructor() {

    }


    public printDetail = false;  //打印胜出怪物
    public winMonster = {}
    public winUseCard = []

    public outPut = []

    public callCost = 0
    public callLevel = 0
    public callNum = 0
    public repeatNum = 0

    public addTime = 0;
    public addTimeCD(t){
        this.addTime += t;
        SharedObjectManager_wx4.getInstance().setMyValue('addTime',this.addTime)


        //var arr = [1,1,1];
        //var level = 0;
        //while(arr.length<50)
        //{
        //    level += 4;
        //    arr.push(level)
        //}
        //ArrayUtil_wx4.random(arr,10)
        //console.log(arr.join('\n'))
        //
        //
        //
        //
        ///////////////////////////////////
        //var arr = [];
        //for(var i=0;i<50;i++)
        //{
        //    arr.push([]);
        //}
        //
        //var list = ObjectUtil_wx4.objToArray(MonsterVO.data)
        //ArrayUtil_wx4.sortByField(list,['level'],[0])
        //
        //var key1 = list.concat();
        //for(var i=0;i<50;i++)
        //{
        //    arr[i].push(list[i].id)
        //}
        //
        //while(true)
        //{
        //    ArrayUtil_wx4.random(list,10)
        //    var ok = true;
        //    for(var i=0;i<list.length;i++)
        //    {
        //        if(list[i] == key1[i])
        //        {
        //            ok = false;
        //            break;
        //        }
        //    }
        //    if(ok)
        //    {
        //        var key2 = list.concat();
        //        for(var i=0;i<50;i++)
        //        {
        //            arr[i].push(list[i].id)
        //        }
        //        break;
        //    }
        //}
        //
        //
        //while(true)
        //{
        //    ArrayUtil_wx4.random(list,10)
        //    var ok = true;
        //    for(var i=0;i<list.length;i++)
        //    {
        //        if(list[i] == key1[i] || list[i] == key2[i])
        //        {
        //            ok = false;
        //            break;
        //        }
        //    }
        //    if(ok)
        //    {
        //        for(var i=0;i<50;i++)
        //        {
        //            arr[i].push(list[i].id)
        //        }
        //        break;
        //    }
        //}
        //
        //for(var i=0;i<50;i++)
        //{
        //    arr[i] = arr[i].join(',')
        //}
        //console.log(arr.join('\n'))



    }





}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;