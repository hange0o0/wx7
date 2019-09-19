class M12 extends MBase{
    //攻击成功后闪离
    constructor() {
        super();
    }

    public atkFun(){
        MTool.nearAtkFun(this,()=>{
            this.runDelay(this.runAway,20)
        })
    }

    public runAway(){
        var rota = Math.random()*Math.PI*2
        var r = 500
        var x = this.x + Math.cos(rota) * r
        var y = this.y + Math.sin(rota) * r
        this.relateItem.resetXY(x,y);

        this.skillEnd = PKC.actionStep + 10;
        this.relateItem.visible = false;

        var mv = PKTool.playMV({
            mvType:1,
            num:5,
            key:'zhaohuan',
            type:'on',
            anX:98/2,
            anY:89/2,
            item:this.relateItem,
            once:true,
            xy:this.getHitPos()
        })
        mv.scaleX = mv.scaleY = 1.5

        this.runDelay(()=>{
            this.relateItem.visible = true;
        },5)
    }
}