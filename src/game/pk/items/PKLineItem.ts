class PKLineItem extends game.BaseItem{

    private static pool = [];
    public static createItem():PKLineItem {
        var item:PKLineItem = this.pool.pop();
        if (!item) {
            item = new PKLineItem();
        }
        return item;
    }

    public static freeItem(item:PKLineItem) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }



    public constructor() {
        super();
    }

    public mc = new eui.Image();
    public len = 800;


    public wait = 30;
    public isDie = 0;
    public isFollow = 0;
    public owner
    public hurt

    public type
    public endFun
    public isFootPos

    public childrenCreated() {
        super.childrenCreated();

        this.addChild(this.mc)
        this.mc.source = 'line_png'
        this.mc.fillMode = 'repeat'
        this.mc.anchorOffsetX = 3/2
    }

    public dataChanged(){
        this.wait = 60
        this.isDie = 0
        this.isFollow = this.data.isFollow;
        this.hurt = this.data.hurt;
        this.len = this.data.len;
        this.owner = this.data.owner;
        this.type = this.data.type;
        this.endFun = this.data.endFun;
        this.isFootPos = this.data.isFootPos;

        this.mc.height = this.len
        this.mc.scaleX = 1;
    }

    public remove(){
        MyTool.removeMC(this)
    }

    public onE(){
        if(this.owner.isDie)
        {
            this.isDie = 2;
            return;
        }

        if(this.isDie)
        {
            if(this.isDie == 1)
            {
                this.wait --;
                if(this.wait > 2)
                    this.mc.scaleX += 3
                else
                    this.mc.scaleX -= 3
                if(this.wait == 0)
                {
                    this.isDie = 2
                }
            }
            return;
        }
        this.wait --;
        if(this.isFollow && this.wait > 30)
        {
            var playerData = PKC.playerData;
            if(this.isFootPos)
                var hitPoint = this.owner;
            else
                var hitPoint = this.owner.getHitPos();
            this.rotation = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)/Math.PI*180 - 90
        }

        if(this.wait == 0)
        {
            if(this.type = 'mark')
            {
                this.isDie = 2;
                this.endFun && this.endFun.apply(this.owner,[this.rotation + 90]);
                return;
            }
            this.isDie = 1;
            this.wait = 5;
            if(this.checkHit())
            {
                PKC.playerData.addHp(-this.hurt,this.owner)
            }
        }
    }

    public checkHit()
    {
        var enemy = PKC.playerData
        if(MyTool.getDis(enemy,this)>this.len)
            return false;



        var angle = this.rotation-90
        angle = angle>360?angle-360:angle
        angle = angle<0?angle+360:angle
        if (angle==90 || angle==270) {
            if (angle == 90) {
                if (enemy.y+20 > this.y && Math.abs(enemy.x - this.x)<20) {
                    return true;
                }
            }
            else {
                if (enemy.y-40 < this.y && Math.abs(enemy.x - this.x)<20) {
                    return true;
                }
            }
        }
        else if (angle==0 || angle==180) {
            if (angle==0 ) {
                if (this.x < enemy.x+20)
                {
                    var dec = enemy.y - this.y
                    if(dec > 0 && dec<20 || dec<=0 && dec >-40)
                    {
                        return true;
                    }
                }
            }
            else {
                if (this.x > enemy.x-20)
                {
                    var dec = enemy.y - this.y
                    if(dec > 0 && dec<20 || dec<=0 && dec >-40)
                    {
                        return true;
                    }
                }
            }
        }else
        {
            var k = Math.tan(angle/180*Math.PI)
            var c = this.y - k*this.x
            var dis = Math.abs(k*enemy.x - enemy.y+c)/Math.sqrt((k*k+1))
            return dis < 40
        }
        return false;
    }

}