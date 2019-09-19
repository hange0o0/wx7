class S7 extends SBase{
    constructor() {
        super();
    }

    public shootRota;
    public num = 9
    public hurt = 1.5
    public step = 5
    public onCreate(){

        this.num = Math.floor(this.getValue(1))
        this.hurt = this.getValue(2)/100
    }

    public onUse(){
        var playerData = PKC.playerData;
        var item = playerData.relateItem;
        playerData.isSkilling = this.sid;



        this.step = this.num;

        var monster = MTool.getNearMonster();
        if(!monster)
            return false;

        var pos = monster.getHitPos();
        var rota = Math.atan2(pos.y-playerData.y,pos.x-playerData.x)
        item.roleCon.rotation = rota/Math.PI*180+90
        this.shootRota = rota;

        item.showShootMV();

        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        this.step --;

        var bullet = PKCodeUI.getInstance().shoot(playerData,this.shootRota +  (Math.random()*10-5)/180*Math.PI);
        bullet.setImage( 'knife_'+playerData.gunid+'_png');
        bullet.endTime = PKC.actionStep + 60
        bullet.speed = 30
        bullet.hitBack = 20
        bullet.hitSkill = true
        bullet.atk = Math.ceil(this.hurt*playerData.atk)

        if(this.step <= 0)
        {
            playerData.isSkilling = 0;
        }
    }
}