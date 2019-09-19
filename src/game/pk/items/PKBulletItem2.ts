class PKBulletItem2 extends game.BaseItem {
    private static pool = [];

    public static createItem():PKBulletItem2 {
        var item:PKBulletItem2 = this.pool.pop();
        if (!item) {
            item = new PKBulletItem2();
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }

    private mc:eui.Image = new eui.Image();


    public speed = 30;
    public step;
    public rota;
    public isDie = 0
    public scale = 1

    public moveLen = 0
    public constructor() {
        super();
        this.skinName = "PKBulletItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 65
        this.anchorOffsetY = 21
        this.width = 132
        this.height = 119
        this.mc.source = 'bullet1'+1+'_png'
        this.mc.x= 0
        this.mc.y= 0
        this.addChild(this.mc)
    }

    public dataChanged(){
        var type = this.data.type;
        this.scale = type == 1?1:1.5

        this.rota = this.data.rota;
        this.rotation = this.rota/Math.PI*180 + 90;

        this.step = Math.ceil((this.data.len - 40)/this.speed)
        this.isDie = 0;
        this.scaleX = 0.5*this.scale
        this.scaleY = 0.5
        this.moveLen = 40

        this.resetXY();
    }

    public onE(){
        if(this.isDie)
            return;
        this.step --;
        if(this.step <= 0)
            this.isDie = 1;
        this.scaleX += 0.15*this.scale
        this.scaleY += 0.15

        this.moveLen += this.speed

        this.resetXY();
    }

    private resetXY(){
        this.x = PKC.playerData.x + this.moveLen*Math.cos(this.rota)
        this.y = PKC.playerData.y + this.moveLen*Math.sin(this.rota)
    }

    public remove(){
        MyTool.removeMC(this);
    }
}