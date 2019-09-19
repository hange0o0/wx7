class S5 extends SBase{
    constructor() {
        super();
    }

    public hurt = 1.5
    public step = 5
    public onCreate(){
        this.hurt = this.getValue(1)/100
    }

    public onUse(){
        var playerData = PKC.playerData;
        var item = playerData.relateItem;
        playerData.isSkilling = this.sid;

        var monster = MTool.getNearMonster();
        if(!monster)
            return false;

        var pos = monster.getHitPos();
        var rota = Math.atan2(pos.y-playerData.y,pos.x-playerData.x)
        var rota90 = rota - Math.PI/2;
        var num = 3
        var des = 40*(num-1)
        var dStart  = -des/2
        var dAdd = 40
        for(var i=0;i<num;i++)
        {
            var len = dStart + dAdd*i
            var x = Math.cos(rota90)*len + playerData.x
            var y = Math.sin(rota90)*len + playerData.y
            var bullet = PKCodeUI.getInstance().shoot(playerData,rota,{x:x,y:y});
            bullet.setImage( 'knife_'+playerData.gunid+'_png');
            bullet.endTime = PKC.actionStep + 60
            bullet.speed = 35
            bullet.hitBack = 20
            bullet.hitPass = true
            bullet.hitSkill = true
            bullet.atk = Math.ceil(this.hurt*playerData.atk)
        }



        item.roleCon.rotation = rota/Math.PI*180+90
        item.showShootMV();

        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        this.step --;
        if(this.step <= 0)
        {
            playerData.isSkilling = 0;
        }
    }
}