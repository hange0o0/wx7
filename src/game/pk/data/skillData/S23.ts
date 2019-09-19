class S23 extends SBase{
    constructor() {
        super();
    }

    public dis = 200
    public hitBack = 200

    private mv
    public onCreate(){
        this.dis = this.getValue(1)
        this.hitBack = this.getValue(2)
    }

    public onUse(){
        var playerData = PKC.playerData


        if(!this.mv)
        {
            this.mv = new eui.Image('21_png')
            this.mv.anchorOffsetX = 251/2
            this.mv.anchorOffsetY = 251/2
        }

        PKCodeUI.getInstance().bottomCon.addChild(this.mv)
        this.mv.x = playerData.x
        this.mv.y = playerData.y
        this.mv.scaleX = this.mv.scaleY = 0.3;
        egret.Tween.get(this.mv).to({scaleX:2,scaleY:2},150).call(()=>{
            MyTool.removeMC(this.mv);
        })



        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var atkDis = this.dis
        var hitBack = this.hitBack
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(!monster.beSkillAble)
                continue;

            var dis = MyTool.getDis(monster,playerData)
            if(dis < atkDis)
            {
                var rotaBase = PKTool.getRota(playerData,monster);
                var x = Math.cos(rotaBase)*hitBack
                var y = Math.sin(rotaBase)*hitBack
                monster.relateItem.resetXY(monster.x+x,monster.y+y)
            }
        }
        return true;
    }
}