class M70 extends MBase{
    //蓝泥怪   自爆 速
    constructor() {
        super();
    }

    private moveStep = 0
    public atkDisAdd = 0//判断命中时，增加的判断距离

    public atkFun(){
        this.moveStep = 15
        MTool.nearAtkFun(this,()=>{

            var playerData = PKC.playerData
            if(playerData.speed > 4)
            {
                playerData.speed -= 1;
                playerData.addBuff({
                    endTime:PKC.actionStep + 8*PKC.frameRate,
                    onEnd:()=>{
                        playerData.speed += 1;
                    }
                })

            }
        },()=>{
            this.hp = 0
            this.isDie = 1;
            this.relateItem.dieMV();
            this.relateItem.renewHp();
        })
    }

    public onStep(){
        if(this.moveStep > 0)
        {
            this.moveStep --;
            var playerData = PKC.playerData
            var rota = Math.atan2(playerData.y - this.y,playerData.x-this.x)

            var x = this.x + 5*Math.cos(rota)
            var y = this.y + 5*Math.sin(rota)
            this.relateItem.resetXY(x,y)
        }
    }
}