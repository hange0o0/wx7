class S21 extends SBase{
    constructor() {
        super();
    }

    public totalTime = 100

    public onCreate(){
        this.totalTime = PKTool.getStepByTime(this.getValue(1)*1000)
    }

    public onUse(){
        PKC.playerData.wudiStep = this.totalTime
        return true;
    }


}