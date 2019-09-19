class M7 extends MBase{
    //斧王        冲过去攻击
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this)
    }

    public skillDis = 500//技能距离
    public skillCD = PKTool.getStepByTime(5000)//技能间隔

    public canSkill(){
        return super.canSkill() && MyTool.getDis(this,PKC.playerData)>300 && !PKC.playerData.isDie
    }

    private lineItem;
    public onBeHit(){

        if(this.lineItem && this.lineItem.owner == this && !this.lineItem.isDie)
        {
            this.lineItem.isDie = 2;
            this.lineItem = null
            this.moving = false;
            this.skillEnd = 0;
        }
    }

    public skillFun(){
        this.skillEnd = Number.MAX_VALUE
        this.lineItem = MTool.moveSkillFun(this,{
            isFollow:true,
            isFootPos:true,
            endFun:this.skillEndFun,
        })
    }


    private moving = false
    private moveRota = 0
    private lastDis = 0
    private skillEndFun(rota){
        this.moving = true;
        this.moveRota = rota/180*Math.PI
        this.lastDis = MyTool.getDis(this,PKC.playerData)
        this.relateItem.runMV()
    }

    public onStep(){
        if(this.moving)
        {
            var x = this.x + 50*Math.cos(this.moveRota);
            var y = this.y + 50*Math.sin(this.moveRota);
            this.relateItem.resetXY(x,y)

            var dis = MyTool.getDis(this,PKC.playerData)
            if(dis < this.atkDis || dis > this.lastDis)
            {
                this.moving = false;
                this.skillEnd = 0;
                return;
            }
            this.lastDis = dis;
        }
    }
}