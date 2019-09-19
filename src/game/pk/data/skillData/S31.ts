class S31 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){
        PKC.playerData.atkBuff['xixue'] = {
            value:this.getValue(1)
        };
    }

}