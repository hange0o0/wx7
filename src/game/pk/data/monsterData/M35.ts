class M35 extends MBase{
    //炽红花菇  单体攻击，会分身
    constructor() {
        super();
    }

    private splitCD = 10*PKC.frameRate
    private lastSplitTime
    public onCreate(){
        this.lastSplitTime = PKC.actionStep
    }

    public onStep(){
        if(PKC.actionStep - this.lastSplitTime > this.splitCD)
        {
            this.lastSplitTime = PKC.actionStep;

            if(PKC.monsterList.length >= PKC.maxMonsterNum)
                return;


            var rota = Math.random()*Math.PI*2
            var r = this.size + this.size
            var x = this.x + Math.cos(rota) * r
            var y = this.y + Math.sin(rota) * r
            MTool.addNewMonster({mid:35,x:x,y:y})
        }
    }




    public atkFun(){
        this.runDelay(this.shootFun,3)
    }

    private shootFun(){
        var playerData = PKC.playerData
        var hitPoint = this.getHitPos();
        var rota = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)



        var bullet = PKCodeUI.getInstance().shoot(this,rota,hitPoint);
        bullet.setImage( 'bullet2_png');
        bullet.endTime = PKC.actionStep + 150
        bullet.speed = 7
        bullet.atk = this.atk
    }
}