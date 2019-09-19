class S29 extends SBase{
    constructor() {
        super();
    }

    public step = 0
    public onCreate(){

    }


    public onUse(){
        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var arr = []
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie || !monster.isFarAtk)
                continue;
            arr.push(monster)
        }

        if(arr.length == 0)
            return false;


        monster = ArrayUtil_wx4.randomOne(arr);
        var player = PKC.playerData.relateItem
        var rota = Math.random()*Math.PI*2
        var r = monster.size + 40
        var x = monster.x + Math.cos(rota) * r
        var y = monster.y + Math.sin(rota) * r
        player.resetXY(x,y);

        var playerData = PKC.playerData;
        playerData.isSkilling = this.sid;
        playerData.isSkillingStopMove = true;



        this.step = 10;
        player.visible = false;
        var mv = PKTool.playMV({
            mvType:1,
            num:5,
            key:'zhaohuan',
            type:'on',
            anX:98/2,
            anY:89/2,
            item:player,
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