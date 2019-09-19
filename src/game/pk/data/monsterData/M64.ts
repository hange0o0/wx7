class M64 extends MBase{
    //骷髅弓箭手 瞄准 ＋ 快剪
    constructor() {
        super();
    }

    public canSkill(){
        return super.canSkill() && !PKC.playerData.isDie
    }

    private lineItem;
    public onBeHit(){
        if(this.lineItem && this.lineItem.owner == this && !this.lineItem.isDie)
        {
            this.lineItem.isDie = 2;
            this.lineItem = null
            this.relateItem.standMV();
            this.skillEnd = PKC.actionStep
        }
    }



    public atkFun(){
        this.skillEnd = Number.MAX_VALUE
        this.relateItem.stopMV()
        this.lineItem = MTool.moveSkillFun(this,{
            isFollow:true,
            endFun:this.skillEndFun,
        })
    }

    private skillEndFun(rota){
        this.relateItem.playMV()
        rota = rota/180*Math.PI
        var bullet = PKCodeUI.getInstance().shoot(this,rota,this.getHitPos());
        bullet.setImage( 'pk_arrow_1_png',-90);
        bullet.endTime = PKC.actionStep + 60
        bullet.speed = 50
        bullet.atk = this.atk
        this.lineItem = null;
        this.skillEnd = PKC.actionStep
    }

}