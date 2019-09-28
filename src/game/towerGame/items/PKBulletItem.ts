class PKBulletItem extends game.BaseItem {
    private static pool = [];
    public static createItem():PKBulletItem {
        var item:PKBulletItem = this.pool.pop();
        if (!item) {
            item = new PKBulletItem();
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

    private mc: eui.Image;

    public owner:TowerItem;
    public target:PKMonsterItem;


    public speed = 15;
    public isDie = 0;

    public targetDiePos;
    public constructor() {
        super();
        this.skinName = "PKBulletItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 25
        this.anchorOffsetY = 25

        this.mc.scaleX = this.mc.scaleY = 0.6
        this.mc.rotation = 90
    }

    public dataChanged(){
        this.owner = this.data.owner;
        this.target = this.data.target;

        this.mc.source = this.owner.gvo.getUrl();

        this.isDie = 0
        this.targetDiePos = null

        this.scaleX = this.scaleY = 0;
    }

    public resetXY(x,y){
        this.x = x;
        this.y = y;
    }

    public onE(){
        if(this.isDie)
            return;
        if(this.scaleX<1)
        {
            this.scaleX = this.scaleY = this.scaleX + 0.2;
        }


        if(this.target.isDie && !this.targetDiePos)
        {
            this.targetDiePos = this.target.getHitPos();
        }

        var targetXY = this.targetDiePos || this.target.getHitPos()


        var rota = Math.atan2(targetXY.y-this.y,targetXY.x-this.x)
        this.rotation = rota/Math.PI*180

        var addX = this.speed*Math.cos(rota)
        var addY = this.speed*Math.sin(rota)
        this.resetXY(this.x + addX,this.y+addY)

        if(MyTool.getDis(this,targetXY) <= this.speed)
        {
            this.isDie = 1;
            this.onAtk();
        }




    }

    public onAtk(){
        if(this.targetDiePos)
            return;
        var hurt = -this.owner.getHurt(this.target.data);
        this.target.addHp(hurt);
        if(this.target.isDie)
            return;

        var gvo = this.owner.gvo;
        switch(gvo.skilltype)
        {
            //case 'ice':
            //    return '降低目标 ' + MyTool.createHtml('50%',0xFFFF00) + ' 的移动速度，持续 '+ MyTool.createHtml(this.sv1,0xFFFF00) + '秒'
            //case 'fire':
            //    return '点燃目标，每秒造成 ' + MyTool.createHtml('30',0xFFFF00) + ' 点伤害，持续 '+ MyTool.createHtml(this.sv1,0xFFFF00) + '秒'
            //case 'poison':
            //    return '使目标中毒，每秒造成 ' + MyTool.createHtml('10',0xFFFF00) + ' 点伤害，直至目标死亡'
            //case 'yun':
            //    return '有 ' + MyTool.createHtml(this.sv1 + '%',0xFFFF00) + ' 的机率使目标陷入晕眩，持续 '+ MyTool.createHtml(this.sv2,0xFFFF00) + '秒'
            case 'ice':
                this.target.setIce(PKTool.getStepByTime(gvo.sv1*1000),0.5)
                break
            case 'fire':
                //return '点燃目标，每秒造成 ' + MyTool.createHtml(this.sv1 + '',0xFFFF00) + ' 点伤害，持续 '+ MyTool.createHtml(this.sv2,0xFFFF00) + '秒'
                this.target.setFire(PKTool.getStepByTime(gvo.sv1*1000),Math.ceil(50*TC.forceRate))
                break
            case 'poison':
                //return '使目标中毒，每秒造成 ' + MyTool.createHtml(this.sv1 + '',0xFFFF00) + ' 点伤害，直至目标死亡'
                this.target.setPoison(Number.MAX_VALUE,Math.ceil(20*TC.forceRate))
                break
            case 'yun':
                //return '有 ' + MyTool.createHtml(this.sv1 + '%',0xFFFF00) + ' 的机率使目标陷入晕眩，持续 '+ MyTool.createHtml(this.sv2,0xFFFF00) + '秒
                if(TC.random() < gvo.sv1/100)
                    this.target.setYun(PKTool.getStepByTime(gvo.sv2*1000))
                break
        }
    }

    public remove(){
        MyTool.removeMC(this);
    }
}