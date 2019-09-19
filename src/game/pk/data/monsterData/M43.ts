class M43 extends MBase{
    //黑色风暴  远程风
    constructor() {
        super();
    }

    public atkFun(){
        this.runDelay(this.shootFun,3)
    }

    private shootFun(){
        var playerData = PKC.playerData
        var hitPoint = this.getHitPos();
        var rota = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)

        var bullet = PKCodeUI.getInstance().shoot(this,rota,hitPoint);
        bullet.hurtTimeCD = 10
        bullet.hitPass = true
        bullet.setMV(8);
        bullet.endTime = PKC.actionStep + 150
        bullet.speed = 6
        bullet.atk = this.atk


    }
}