class S10 extends SBase{
    constructor() {
        super();
    }

    public distance = 100
    public step = 100
    public onCreate(){
        this.distance = this.getValue(1)
    }

    public onUse(){
        var playerData = PKC.playerData;
        var item = playerData.relateItem;
        playerData.isSkilling = this.sid;
        playerData.isSkillingStopMove = true;



        this.step = 10;

        var rota = item.ctrlRota/180*Math.PI;
        item.resetXY(
            item.x + this.distance*Math.cos(rota),
            item.y + this.distance*Math.sin(rota)
        )

        item.visible = false;
        var mv = PKTool.playMV({
            mvType:1,
            num:5,
            key:'zhaohuan',
            type:'on',
            anX:98/2,
            anY:89/2,
            item:item,
            once:true,
        })
        mv.scaleX = mv.scaleY = 1.5

        return true;
    }

    public onStep(){
        var playerData = PKC.playerData;
        if(playerData.isSkilling != this.sid)
            return;
        this.step --;
        if(this.step <= 5)
            playerData.relateItem.visible = true;
        if(this.step <= 0)
        {
            playerData.isSkilling = 0;
            playerData.isSkillingStopMove = false;
        }
    }
}