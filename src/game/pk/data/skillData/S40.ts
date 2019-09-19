class S40 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    public onCreate(){
        var playerData = PKC.playerData;
        var addValue = this.getValue(1)
        playerData.maxHp += addValue
        playerData.hp += addValue
    }

}