class M8 extends MBase{
    //守卫者   拆陷阱
    constructor() {
        super();
    }

    public trapAble = false;
    public skillDis = 2000//技能距离
    public skillCD = PKTool.getStepByTime(1000)//技能间隔

    public targetTrap;

    public atkFun(){
        MTool.nearAtkFun(this)
    }

    public canSkill(){
        if(this.targetTrap)
            return false;
        var arr = PKCodeUI.getInstance().trapArr.concat(PKCodeUI.getInstance().bombArr);
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i].isDie)
                continue;
            return true;
        }
        return false
    }

    public skillFun(){
        var minDis
        var minTrap
        var arr = PKCodeUI.getInstance().trapArr.concat(PKCodeUI.getInstance().bombArr);
        for(var i=0;i<arr.length;i++)
        {
            var trapItem = arr[i];
            if(arr[i].isDie)
                continue;
            var dis = MyTool.getDis(this,trapItem)
            if(!minTrap || minDis > dis)
            {
                minTrap = trapItem;
                minDis = dis
            }
        }
        this.targetTrap = minTrap;
    }
}