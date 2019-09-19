class S22 extends SBase{
    constructor() {
        super();
    }
    public hurt = 200
    public totalTime = 200
    public bulletSpeed = 50

    public onCreate(){
        this.totalTime = Math.ceil(this.getValue(1)/this.bulletSpeed)
        this.hurt = this.getValue(2)
    }

    public onUse(){
        var playerData = PKC.playerData;
        var item = playerData.relateItem;




        var monster = MTool.getNearMonster();
        if(!monster)
            return false;

        var pos = monster.getHitPos();
        var rota = Math.atan2(pos.y-playerData.y,pos.x-playerData.x)
        item.roleCon.rotation = rota/Math.PI*180+90

        var x = playerData.x
        var y = playerData.y
        var bullet = PKCodeUI.getInstance().shoot(playerData,rota,{x:x,y:y});
        bullet.setImage( 'skill22_png',90);
        bullet.endTime = PKC.actionStep + this.totalTime
        bullet.speed = this.bulletSpeed
        bullet.hitBack = 0
        bullet.hitPass = true
        bullet.isSkill = true
        bullet.atk =  this.hurt
        bullet.atkR = 60


        item.showDoubleMV();
        playerData.lastAtkTime = PKC.actionStep;

        return true;
    }
}