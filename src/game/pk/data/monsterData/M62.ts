class M62 extends MBase{
    //橙泥怪   自爆 血
    constructor() {
        super();
    }

    private moveStep = 0
    public atkDisAdd = 0//判断命中时，增加的判断距离
    public atkFun(){
        this.moveStep = 15
        MTool.nearAtkFun(this,()=>{
            PKC.playerData.beHitRate += 0.05
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