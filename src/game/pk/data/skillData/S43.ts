class S43 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){
        PKC.playerData.atkBuff['poison'] = {
            step:Number.MAX_VALUE,
            hurt:this.getValue(1)
        };
    }

}