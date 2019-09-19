class M44 extends MBase{
    //红色风暴  召唤风,持续一段时间
    constructor() {
        super();
    }

    public atkFun(){
        MTool.markAtkFun(200,3,{
            owner:this,
            endFun:this.createBullet
        })
    }

    private createBullet(mark){
        mark.isDie = 2;
        var bullet = PKCodeUI.getInstance().shoot(this,0,mark);
        bullet.hurtTimeCD = 10
        bullet.hitPass = true
        bullet.setMV(8);
        bullet.endTime = PKC.actionStep + 150
        bullet.speed = 0
        bullet.atk = this.atk
        PKCodeUI.getInstance().roleCon.addChild(bullet)
    }

}