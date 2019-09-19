class M68 extends MBase{
    //幽灵    前方随机多个球攻击
    constructor() {
        super();
    }

    public atkFun(){
        //var playerData = PKC.playerData
        //var hitPoint = this.getHitPos();
        //var rota = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)/Math.PI*180 - 90
        //PKCodeUI.getInstance().addLine(hitPoint.x,hitPoint.y,rota,{
        //    type:'atk',
        //    isFollow:true,
        //    owner:this,
        //    hurt:100,
        //    len:1000
        //})

        this.runDelay(this.shootFun,10)
    }

    private shootNum = 0
    private lastShootNum = 0
    private shootFun(){
        this.shootNum = 8;
        this.lastShootNum = 0;
        this.relateItem.stopMV();
    }

    public onStep(){
        if(this.shootNum <= 0)
            return;
        this.lastShootNum --;
        if(this.lastShootNum >0)
            return;
        this.lastShootNum = 5;
        this.shootNum --;
        if(this.shootNum == 0)
        {
            this.relateItem.playMV();
        }


        var playerData = PKC.playerData
        var hitPoint = this.getHitPos();
        var rota = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)
        rota -= Math.PI/3

        var bullet = PKCodeUI.getInstance().shoot(this,rota + Math.PI/3*2*Math.random(),hitPoint);
        bullet.setImage( 'enemy68_attack_png');
        bullet.endTime = PKC.actionStep + 150
        bullet.speed = 7
        bullet.rotaAdd = 30
        bullet.atk = this.atk
    }
}