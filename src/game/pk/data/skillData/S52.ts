class S52 extends SBase{
    constructor() {
        super();
    }

    public hurt = 0.3
    public step = 5
    public totalStep = 5

    public bulletArr = []
    public onCreate(){
        this.hurt = this.getValue(1)/100;
        this.totalStep = PKTool.getStepByTime(this.getValue(2)*1000);
    }

    public onUse(){
        this.bulletArr.length = 0;
        var playerData = PKC.playerData;
        var item = playerData.relateItem;
        playerData.isSkilling = this.sid;
        //playerData.isSkillingStopMove = true


        var num = 4;
        var addRota = Math.PI/2
        for(var i=0;i<num;i++)
        {
            var bullet = PKCodeUI.getInstance().shoot(playerData,addRota*i);
            bullet.setImage( 'knife_'+playerData.gunid+'_png');
            bullet.endTime = PKC.actionStep + this.totalStep
            bullet.speed = 15
            bullet.hitBack = 0
            bullet.hitSkill = true
            bullet.hurtTimeCD = 10
            bullet.hitPass = true
            bullet.rotaAdd = 60
            bullet.atkR = 30
            bullet.atk = Math.ceil(this.hurt*playerData.atk/3)
            this.bulletArr.push(bullet);
        }

        item.showDoubleMV();
        this.step = this.totalStep

        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        for(var i=0;i<this.bulletArr.length;i++)
        {
            var bullet = this.bulletArr[i];
            if(bullet.speed > 0)
            {
                bullet.speed --;
                if(bullet.speed < 0)
                    bullet.speed = 0;
            }
        }
        this.step --;
        if(this.step <= 0)
        {
            playerData.isSkilling = 0;
            //playerData.isSkillingStopMove = false
        }
    }

}