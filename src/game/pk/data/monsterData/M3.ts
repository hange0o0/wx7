class M3 extends MBase{
    //宝石狂徒  远程，直线3个
    constructor() {
        super();
    }

    public atkFun(){
        this.runDelay(this.shootFun,3)
    }

    private shootNum = 0
    private lastShootNum = 0
    private shootFun(){
        this.shootNum = 3;
        this.lastShootNum = 0;
    }

    public onStep(){
        if(this.shootNum <= 0)
            return;
        this.lastShootNum --;
        if(this.lastShootNum >0)
            return;
        this.lastShootNum = 10;
        this.shootNum --;
        var playerDataHitPoint = PKC.playerData
        var hitPoint = this.getHitPos();
        var rota = Math.atan2(playerDataHitPoint.y - hitPoint.y,playerDataHitPoint.x-hitPoint.x)

        var bullet = PKCodeUI.getInstance().shoot(this,rota,hitPoint);
        bullet.setImage( 'enemy3_attack_png');
        bullet.endTime = PKC.actionStep + 150
        bullet.speed = 7
        bullet.rotaAdd = -50
        bullet.atk = this.atk
    }




}