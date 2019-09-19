class S44 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){
        PKC.playerData.atkBuff['fire'] = {
            step:PKTool.getStepByTime(this.getValue(2)*1000),
            hurt:this.getValue(1)
        };
    }

}