class M102 extends MBase{
    //幽鬼    分裂
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this)
        if(this.scale == 1 && Math.random() < 0.2)
        {
            var playerData = PKC.playerData
            var rota = Math.random()*Math.PI*2
            var r = playerData.size + this.size
            var x = playerData.x + Math.cos(rota) * r
            var y = playerData.y + Math.sin(rota) * r
            var mData = MTool.addNewMonster({mid:102,x:x,y:y})

            mData.scale = 0.6
            mData.relateItem.resetHpBarY()
        }
    }
}