class M38 extends MBase{
    //豌豆射手  攻速快
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
        bullet.setImage( 'bullet9_png');
        bullet.endTime = PKC.actionStep + 150
        bullet.speed = 7
        bullet.atk = this.atk
    }
}