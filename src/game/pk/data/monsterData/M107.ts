class M107 extends MBase{
    //神圣波利  死后回满所有怪血量
    constructor() {
        super();
    }


    public onDie(){
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

            monster.addHp(monster.maxHp - monster.hp)
            AniManager_wx3.getInstance().playInItem(128,monster.relateItem,{
                x:50,
                y:300 - this.getVO().height*0.4
            })
        }
    }
}