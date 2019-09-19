class S4 extends SBase{
    constructor() {
        super();
    }

    public farAtkSpeedRate
    public farAtkRate

    public step

    public onCreate(){
        this.farAtkSpeedRate = 1/(this.getValue(1)/100)
        this.farAtkRate = this.getValue(2)/100
    }



    public onUse(){
        var playerData =  PKC.playerData;
        playerData.isFar = true;

        playerData.farAtkSpeedRate = this.farAtkSpeedRate //远程形态
        playerData.farAtkRate = this.farAtkRate; //远程形态


        playerData.isSkilling = this.sid
        playerData.isSkillingStopMove = true
        playerData.relateItem.showShootMV()
        this.step = 10*PKC.frameRate;
        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        this.step --;
        if(this.step <= 0)
        {
            playerData.isSkilling = 0
            playerData.isSkillingStopMove = false
            playerData.isFar = false
        }
    }
}