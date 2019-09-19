class M31 extends MBase{
    //黑耀石菇  乱射3
    constructor() {
        super();
    }


    public atkFun(){
        //var playerData = PKC.playerData
        //var hitPoint = this.getHitPos();
        //var rota = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)/Math.PI*180 - 90
        //PKCodeUI.getInstance().addLine(hitPoint.x,hitPoint.y,rota,{
        //    type:'atk',
        //    isFollow:true,
        //    owner:this,
        //    hurt:100,
        //    len:1000
        //})

        this.runDelay(this.shootFun,3)
    }

    private shootFun(){
        var playerData = PKC.playerData
        var hitPoint = this.getHitPos();
        var rota = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)
        rota -= Math.PI/6

        for(var i = 0;i<3;i++)
        {
            var bullet = PKCodeUI.getInstance().shoot(this,rota + Math.PI/3*Math.random(),hitPoint);
            bullet.setImage( 'bullet6_png');
            bullet.endTime = PKC.actionStep + 150
            bullet.speed = 7
            bullet.atk = this.atk
        }


    }
}