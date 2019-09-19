class M110 extends MBase{
    //天使    大范围加血
    constructor() {
        super();
    }

    public skillDis = 300//技能距离
    public skillCD = PKTool.getStepByTime(500)//技能间隔

    public canSkill(){
       return true
    }

    public skillFun(){

        var arr = PKC.monsterList;
        var len = arr.length;

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

            monster.addHp(this.atk)
            AniManager_wx3.getInstance().playInItem(128,monster.relateItem,{
                x:50,
                y:300 - this.getVO().height*0.4
            })
        }
        this.relateItem.atkMV();
        this.skillEnd = PKC.actionStep + 30


    }
}