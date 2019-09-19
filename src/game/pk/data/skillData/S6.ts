class S6 extends SBase{
    constructor() {
        super();
    }

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


        var num = this.num;
        var step = 10;


        var monster = MTool.getNearMonster();
        if(!monster)
            return false;

        var decNum = 0;
        if(num%2 == 0)
        {
            num++;
            decNum ++;
        }

        var pos = monster.getHitPos();
        var rota = Math.atan2(pos.y-playerData.y,pos.x-playerData.x)

        var startRota = rota - (num-1)/2*step/180*Math.PI

        var addRota = step/180*Math.PI
        num -= decNum;
        for(var i=0;i<num;i++)
        {
            var bullet = PKCodeUI.getInstance().shoot(playerData,startRota + addRota*i);
            bullet.setImage( 'knife_'+playerData.gunid+'_png');
            bullet.endTime = PKC.actionStep + 60
            bullet.speed = 30
            bullet.hitBack = 20
            bullet.hitSkill = true
            bullet.atk = Math.ceil(this.hurt*playerData.atk)
        }



        item.roleCon.rotation = rota/Math.PI*180+90
        item.showDoubleMV();

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