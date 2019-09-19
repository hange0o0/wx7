class S9 extends SBase{
    constructor() {
        super();
    }

    public step = 100
    public iceStep = 100
    public distance = 500

    public mv
    public onCreate(){

        this.distance = this.getValue(1)
        this.iceStep = PKTool.getStepByTime(this.getValue(2)*1000)
    }

    public onUse(){
        var playerData = PKC.playerData;
        var item = playerData.relateItem;
        playerData.isSkilling = this.sid;
        playerData.isSkillingStopMove = true;



        this.step = 10;
        if(!this.mv)
        {
            this.mv = new eui.Image('9_png')
            this.mv.anchorOffsetX = 245/2
            this.mv.anchorOffsetY = 245/2
        }

        PKCodeUI.getInstance().bulletCon.addChild(this.mv)
        this.mv.x = item.x
        this.mv.y = item.y
        this.mv.scaleX = this.mv.scaleY = 0.3;
        egret.Tween.get(this.mv).to({scaleX:2,scaleY:2},300).call(()=>{
            MyTool.removeMC(this.mv);
        })


        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(!monster.beSkillAble)
                continue;

            var dis = MyTool.getDis(monster,playerData)
            if(dis < this.distance)
            {
                monster.relateItem.setIce(this.iceStep)
            }
        }


        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        this.step --;
        if(this.step <= 0)
        {
            playerData.isSkilling = 0;
            playerData.isSkillingStopMove = false;
        }
    }
}