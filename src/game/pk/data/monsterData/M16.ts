class M16 extends MBase{
    //毒巫师 攻击时有几率分身
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this)
        if(Math.random() < 0.2 && PKC.monsterList.length < PKC.maxMonsterNum)
        {
            var playerData = PKC.playerData
            var rota = Math.random()*Math.PI*2
            var r = playerData.size + this.size
            var x = playerData.x + Math.cos(rota) * r
            var y = playerData.y + Math.sin(rota) * r
            MTool.addNewMonster({mid:16,x:x,y:y})
        }
    }
}