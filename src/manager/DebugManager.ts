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
        var arr = [];
        for(var i=0;i<50;i++)
        {
            arr.push([]);
        }

        var list = ObjectUtil_wx4.objToArray(MonsterVO.data)
        ArrayUtil_wx4.sortByField(list,['level'],[0])

        var key1 = list.concat();
        for(var i=0;i<50;i++)
        {
            arr[i].push(list[i].id)
        }


        var atkList = []
        var effectList = []
        var effectType = ['ice','yun','atk','speed','dis']
        for(var s in GunVO.data)
        {
            var gvo = GunVO.data[s]
            if(effectType.indexOf(gvo.skilltype) == -1)
                atkList.push(gvo.id)
            else
                effectList.push(gvo.id)
        }



        while(true)
        {
            ArrayUtil_wx4.random(list,10)
            var newList = list.concat();
            var ok = true;
            for(var i=0;i<atkList.length;i++)
            {
                var index = atkList[i] - 1;
                var temp = arr[index]
                var mid = newList.pop().id;
                if(temp.indexOf(mid) != -1)
                {
                    ok = false;
                    break;
                }
                var mid = newList.pop().id;
                if(temp.indexOf(mid) != -1)
                {
                    ok = false;
                    break;
                }
            }
            if(ok)
            {
                var newList = list.concat();
                for(var i=0;i<atkList.length;i++)
                {
                    var index = atkList[i] - 1;
                    var temp = arr[index]
                    var mid = newList.pop().id;
                    temp.push(mid)
                    var mid = newList.pop().id;
                    temp.push(mid)
                }
                break;
            }
        }


        while(true)
        {
            ArrayUtil_wx4.random(list,10)
            var newList = list.concat();
            var ok = true;
            for(var i=0;i<effectList.length;i++)
            {
                var index = effectList[i] - 1;
                var temp = arr[index]
                var mid = newList.pop().id;
                if(temp.indexOf(mid) != -1)
                {
                    ok = false;
                    break;
                }
                var mid = newList.pop().id;
                if(temp.indexOf(mid) != -1)
                {
                    ok = false;
                    break;
                }
            }
            if(ok)
            {
                var newList = list.concat();
                for(var i=0;i<effectList.length;i++)
                {
                    var index = effectList[i] - 1;
                    var temp = arr[index]
                    var mid = newList.pop().id;
                    temp.push(mid)
                    var mid = newList.pop().id;
                    temp.push(mid)
                }
                break;
            }
        }

        for(var i=0;i<50;i++)
        {
            arr[i] = arr[i].join(',')
        }
        console.log(arr.join('\n'))



    }


    public setGun(){
        while(true)
        {
            var typeObj = {}

            var typeArr = ['atk','speed','dis','num','']
            for(var s in GunVO.data)
            {
                var vo:GunVO = GunVO.data[s]
                if(!typeObj[vo.skilltype])
                    typeObj[vo.skilltype] = [];
                typeObj[vo.skilltype].push(vo);
            }
            for(var s in typeObj)
            {
                var arr = typeObj[s];
                ArrayUtil_wx4.random(arr)
                for(var i=0;i<arr.length;i++)
                {
                    var type = typeArr.shift();
                    typeArr.push(type);
                    this.setOneGun(arr[i],type)
                }
            }

            var maxScore = 0;
            var minScore = 990;
            for(var s in GunVO.data)
            {
                var gvo:GunVO = GunVO.data[s]
                var score = this.getScore(gvo)
                minScore = Math.min(minScore,score)
                maxScore = Math.max(maxScore,score)
            }
            if(maxScore > 500)
                continue;
            if(minScore < 150)
                continue;

            for(var s in GunVO.data)
            {
                var gvo:GunVO = GunVO.data[s]
                var score = this.getScore(gvo)
                console.log(gvo.id + '\tatk:' + gvo.atk + '\tspeed:' + gvo.atkspeed + '\tdis:' + gvo.atkdis + '\tnum:' + gvo.shootnum + '\tscore:' + Math.round(score))
            }
            console.log('maxScore',maxScore)
            console.log('minScore',minScore)

            this.getValue('atk')
            this.getValue('atkspeed')
            this.getValue('atkdis')
            this.getValue('shootnum')

            break;
        }


    }

    private getScore(gvo){
        return gvo.atk*(1000/Math.pow(gvo.atkspeed,1.05))*gvo.atkdis/150*gvo.shootnum
    }

    private setOneGun(gvo:GunVO,type){
        var atk = 100
        var speed = 800
        var dis = 150
        var num = 1

        gvo.atk = (0.8 + 0.4*Math.random())*atk
        gvo.atkspeed = (0.8 + 0.4*Math.random())*speed
        gvo.atkdis = (0.8 + 0.4*Math.random())*dis
        gvo.shootnum = num + (Math.random()<0.3?1:0)

        if(type == 'atk')
        {
            gvo.atk *= 2.5
            if(num == 2)
                gvo.atkspeed *= 2.5
        }
        else if(type == 'speed')
        {
            gvo.atkspeed /= 2.5
            if(num == 2)
                gvo.atk /= 2
        }
        else if(type == 'dis')
        {
            gvo.atkdis *= 2
            if(num == 2)
            {
                gvo.atk /= 1.5
                gvo.atkspeed *= 1.5
            }
            else
            {
                var v = 1.2
                gvo.atk *= v
                gvo.atkspeed /= v
            }
        }
        else if(type == 'num')
        {
            gvo.shootnum += 2 + Math.floor(Math.random()*3)

            var v = 1+gvo.shootnum*0.1
            gvo.atk /= v
        }
        else
        {
            var v = 1.5
            gvo.atk *= v
            gvo.atkdis *= v
            if(num == 2)
            {
                gvo.atk /= 2.5
            }
        }

        gvo.atk = Math.round(gvo.atk/5)*5
        gvo.atkspeed = Math.round(gvo.atkspeed/50)*50
        gvo.atkdis = Math.min(250,Math.round(gvo.atkdis/5)*5)


    }

    public getValue(key){
        var arr = [];
        for(var s in GunVO.data)
        {
            var gvo:GunVO = GunVO.data[s]
            arr.push(gvo[key])
        }
        console.log(key)
        console.log(arr.join('\n'))
    }



}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;