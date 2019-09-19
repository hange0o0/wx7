class M33 extends MBase{
    //橙光仙菇   乱射5
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

        for(var i = 0;i<5;i++)
        {
            var bullet = PKCodeUI.getInstance().shoot(this,rota + Math.PI/2*2*Math.random(),hitPoint);
            bullet.setImage( 'bullet1_png');
            bullet.endTime = PKC.actionStep + 150
            bullet.speed = 7
            bullet.atk = this.atk
        }
    }
}