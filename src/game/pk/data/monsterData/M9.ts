class M9 extends MBase{
    //掌旗使    大范围增加攻击力,移动速度
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this)
    }


    public onCreate(){
        PKC.monsterAddAtk = this.atk/2
        PKC.monsterAddSpeed = 2
    }

    public onDie(){
        var arr = PKC.monsterList;
        var len = arr.length;
        for(var i=0;i<len;i++)
        {
            if(arr[i].isDie || arr[i].mid != this.mid)
                continue;
            return;
        }
        PKC.monsterAddAtk = 0
        PKC.monsterAddSpeed = 0
    }
}