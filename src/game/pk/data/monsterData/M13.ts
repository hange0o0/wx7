class M13 extends MBase{

    //烧
    constructor() {
        super();
    }

    private lastHurtTime = 0;

    public onStep(){
        if(PKC.actionStep - this.lastHurtTime < 30)
            return;
        var playerData = PKC.playerData
        var dis = MyTool.getDis(this,playerData)
        if(dis < 120)
        {
            playerData.addHp(-this.atk);
            this.lastHurtTime = PKC.actionStep;
        }
    }
}