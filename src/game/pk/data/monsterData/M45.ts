class M45 extends MBase{
    //蓝色风暴  召唤风+移动
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
        var rota = Math.PI*2*Math.random()
        mark.isDie = 2;
        var bullet = PKCodeUI.getInstance().shoot(this,rota,mark);
        bullet.hurtTimeCD = 10
        bullet.hitPass = true
        bullet.setMV(8);
        bullet.endTime = PKC.actionStep + 150
        bullet.speed = 6
        bullet.atk = this.atk
        PKCodeUI.getInstance().roleCon.addChild(bullet)
    }
}