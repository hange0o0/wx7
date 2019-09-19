class M2 extends MBase{
    constructor() {
        super();
    }
    //幻影剌客  闪过去攻击
    public skillDis = 800//技能距离
    public skillCD = PKTool.getStepByTime(5000)//技能间隔

    public canSkill(){
        return super.canSkill() && MyTool.getDis(this,PKC.playerData)>300 && !PKC.playerData.isDie
    }

    public atkFun(){
        MTool.nearAtkFun(this)
    }

    public skillFun(){
        var playerData = PKC.playerData

        var rota = Math.random()*Math.PI*2
        var r = playerData.size + this.size
        var x = playerData.x + Math.cos(rota) * r
        var y = playerData.y + Math.sin(rota) * r
        this.relateItem.resetXY(x,y);

        this.skillEnd = PKC.actionStep + 10;



        this.relateItem.visible = false;
        var mv = PKTool.playMV({
            mvType:1,
            num:5,
            key:'zhaohuan',
            type:'on',
            anX:98/2,
            anY:89/2,
            item:this.relateItem,
            once:true,
            xy:this.getHitPos()
        })
        mv.scaleX = mv.scaleY = 1.5

        this.runDelay(()=>{
            this.relateItem.visible = true;
        },5)
    }



    //public canSkill(){
    //    return Math.random()< 0.5
    //}

    //public skillFun(){
    //    MTool.moveSkillFun(this,{
    //        isFollow:true,
    //        endFun:this.skillEndFun,
    //
    //    })
    //
    //}
    //
    //private skillEndFun(rota){
    //    rota = rota/180*Math.PI
    //    var bullet = PKCodeUI.getInstance().shoot(this,rota);
    //    bullet.setImage( 'bullet9_png');
    //    bullet.endTime = PKC.actionStep + 60
    //    bullet.speed = 10
    //    bullet.atk = this.atk
    //}
}