class S42 extends SBase{
    constructor() {
        super();
    }


    public onCreate(){
        PKC.playerData.rebornDec = PKTool.getStepByTime(this.getValue(1)*1000)
    }

}