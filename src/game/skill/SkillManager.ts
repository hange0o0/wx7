class SkillManager extends egret.EventDispatcher {
    private static _instance:SkillManager;

    public static getInstance() {
        if (!this._instance) this._instance = new SkillManager();
        return this._instance;
    }

    public mySkill = [];
    public maxLevel = 20;
    public levelBase = []
    public initData(data) {
        data = data || {}
        this.mySkill = [];
        var arr = data.mySkill?data.mySkill.split(','):[]
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].split('#')
            this.mySkill.push({
                id:parseInt(temp[0]),
                num:parseInt(temp[1]),
            })
        }
        if(this.mySkill.length == 0)
        {
            for(var s in  SkillVO.data)
            {
                if(SkillVO.data[s].level == 1)
                {
                    this.mySkill.push({
                        id:parseInt(s),
                        num:1,
                    })
                }

            }
        }


        var levelArr = [0,4,10,20,45,70,100,150,200,250,300,350,400,450,500,550,600,650,700,750]//20
        var count = 0;
        for(var i=0;i<levelArr.length;i++)
        {
            count += levelArr[i];
            this.levelBase.push(count)
        }
    }

    public getSave(){
        var arr = [];
        for(var i=0;i<this.mySkill.length;i++)
        {
            arr.push(this.mySkill[i].id + '#' + this.mySkill[i].num)
        }
        return {
            mySkill:arr.join(',')
        }
    }


    public getLevelByNum(num){
        for(var i=0;i<this.levelBase.length;i++)
        {
            if(this.levelBase[i] > num)
                return i;
        }
        return this.maxLevel;
    }

    //达到这个等级要的数量
    public getLevelNum(lv){
        return this.levelBase[lv-1];
    }


    //
    public getSkillNum(id){
        for(var i=0;i<this.mySkill.length;i++)
        {
            if(this.mySkill[i].id == id)
                return this.mySkill[i].num
        }
        return 0;
    }

    public getSkillLevel(id){
        for(var i=0;i<this.mySkill.length;i++)
        {
            if(this.mySkill[i].id == id)
                return this.getLevelByNum(this.mySkill[i].num)
        }
        return 0;
    }

    public addSkill(id,num){
        for(var i=0;i<this.mySkill.length;i++)
        {
            if(this.mySkill[i].id == id)
            {
                this.mySkill[i].num += num;
                return;
            }
        }
        this.mySkill.push({
                id:id,
                num:num
            })
    }

    //返回新增技能
    public getNewSkill(num){
        var list = [];
        var data = SkillVO.data
        var level = 1;
        for(var s in data)
        {
            var vo = data[s];
            if(vo.level <= level)
            {
                var level = this.getSkillLevel(vo.id)
                if(level >= this.maxLevel)
                    continue;
                list.push({id:vo.id,rate:Math.pow(1.6,this.maxLevel-level)})
            }
        }
        var baseList = ArrayUtil_wx4.randomNumByRate(list,4,'rate')
        var oo = {}
        for(var i=0;i<num;i++)
        {
            var id = ArrayUtil_wx4.randomByRate(baseList).id;
            oo[id] = (oo[id] || 0) + 1;
        }
        return oo;
    }
}