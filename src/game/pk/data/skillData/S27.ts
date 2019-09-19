class S27 extends SBase{
    constructor() {
        super();
    }

    public totalStep = 60



    public step = 0
    public lasPos = {x:0,y:0}
    public stopMoveTime = 5
    public onCreate(){
        this.totalStep = PKTool.getStepByTime(this.getValue(1)*1000)
    }

    public onUse(){
        var playerData = PKC.playerData
        playerData.isSkilling = this.sid
        playerData.isHide = true;
        playerData.wudiStep = this.totalStep;
        playerData.relateItem.alpha = 0.2
        playerData.hitEnemy = null

        this.step = this.totalStep
        this.lasPos = {x:playerData.x,y:playerData.y}
        playerData.isSkillingStopMove = true;
        this.stopMoveTime = 10;
        playerData.relateItem.showStandMV();

        return true;
    }


    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        if(this.stopMoveTime > 0)
        {
            this.stopMoveTime --;
            if(this.stopMoveTime == 0)
                playerData.isSkillingStopMove = false;
        }

            this.step --;

            if(Math.abs(playerData.x - this.lasPos.x) > 5 || Math.abs(playerData.y - this.lasPos.y) > 5)
            {
                this.step = 0;
                if(playerData.wudiStep > 1)
                    playerData.wudiStep = 1;
            }
            if(this.step <= 0)
            {
                playerData.isHide  = false;
                playerData.isSkilling = 0;
                playerData.relateItem.alpha = 1
            }

        }
}