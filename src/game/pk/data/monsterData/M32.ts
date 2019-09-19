class M32 extends MBase{
    //碧玉药菇     扇形3
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
        rota -= Math.PI/6

        for(var i = 0;i<3;i++)
        {
            var bullet = PKCodeUI.getInstance().shoot(this,rota + Math.PI/6*i,hitPoint);
            bullet.setImage( 'bullet7_png');
            bullet.endTime = PKC.actionStep + 150
            bullet.speed = 7
            bullet.atk = this.atk
        }

    }
}