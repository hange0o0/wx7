class S32 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){
        PKC.playerData.doubleRate += this.getValue(1)/100;
    }

}