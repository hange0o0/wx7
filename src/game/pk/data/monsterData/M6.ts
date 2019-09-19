class M6 extends MBase{
    //狂战士   冲过去，过程会造成伤害
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
        if(this.lineItem)
            console.log(this.lineItem.owner == this, !this.lineItem.isDie)
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
    private moveDis = 600
    private isHit = false
    private skillEndFun(rota){
        this.moving = true;
        this.isHit = false;
        this.moveRota = rota/180*Math.PI
        this.moveDis = 800
        this.relateItem.runMV()
    }

    public onStep(){
        if(this.moving)
        {
            var x = this.x + 50*Math.cos(this.moveRota);
            var y = this.y + 50*Math.sin(this.moveRota);
            this.relateItem.resetXY(x,y)
            this.moveDis -= 50

            var playerData = PKC.playerData
            if(!this.isHit && MyTool.getDis(this,playerData) < 50)
            {
                playerData.addHp(-this.atk)
                this.isHit = true
            }


            if(this.moveDis <= 0)
            {
                this.moving = false;
                this.skillEnd = 0;
                return;
            }
        }
    }
}