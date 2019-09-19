class M34 extends MBase{
    //蓝瘦香菇  扇形5
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
        rota -= Math.PI/2
        var step = Math.PI/2*2/4

        for(var i = 0;i<5;i++)
        {
            var bullet = PKCodeUI.getInstance().shoot(this,rota + step*i,hitPoint);
            bullet.setImage( 'bullet3_png');
            bullet.endTime = PKC.actionStep + 150
            bullet.speed = 7
            bullet.atk = this.atk
        }

    }
}