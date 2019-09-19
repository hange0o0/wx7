class M10 extends MBase{
    //回血，单体电
    constructor() {
        super();
    }

    public atkFun(){
        MTool.markAtkFun(100,1,{
            owner:this,
            hurt:this.atk,
            sound:'thurder',
            mv:{
                url:'monster1_mv',
                num:3,
                anX:91/2,
                anY:208*0.8,
            }
        })

    }



    public skillDis = 500//技能距离
    public skillCD = PKTool.getStepByTime(500)//技能间隔

    public canSkill(){
        var arr = PKC.monsterList;
        var len = arr.length;
        for(var i=0;i<len;i++)
        {
            if(arr[i].isDie)
                continue;
            if(arr[i].hp >= arr[i].maxHp)
                continue;
            var dis = MyTool.getDis(arr[i],this)
            if(dis > 500)
                continue;
            return true;
        }
    }

    public skillFun(){

        var arr = PKC.monsterList;
        var len = arr.length;

        var minMonster;
        var minHpRate;
        for(var i=0;i<len;i++)
        {
            var monster = arr[i];
            if(monster.isDie)
                continue;
            var hpRate = monster.hp/ monster.maxHp
            if(hpRate >= 1)
                continue;
            var dis = MyTool.getDis(monster,this)
            if(dis > 500)
                continue;

            if(!minMonster || minHpRate>hpRate)
            {
                minMonster = monster
                minHpRate = hpRate
            }
        }
        this.relateItem.atkMV();
        this.skillEnd = PKC.actionStep + 30
        minMonster.addHp(this.atk)
        AniManager_wx3.getInstance().playInItem(128,minMonster.relateItem,{
            x:50,
            y:300 - this.getVO().height*0.4
        })

    }
}