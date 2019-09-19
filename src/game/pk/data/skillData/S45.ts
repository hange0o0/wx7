class S45 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){

        PKC.playerData.atkBuff['bomb'] = {
            dis:this.getValue(1),
            hurt:this.getValue(2)
        };
    }

}