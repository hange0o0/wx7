class S48 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){
        PKC.playerData.coinAdd += this.getValue(1)/100
    }

}