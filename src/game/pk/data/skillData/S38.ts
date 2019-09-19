class S38 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){
        var playerData = PKC.playerData;
        var addValue = Math.ceil(playerData.atk * this.getValue(1)/100);
        playerData.atk += addValue
    }
}