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
    private mv: egret.MovieClip;


    public endTime = 0
    public speed = 0
    public atk = 0
    public atkR = 0
    public hitPass = false//命中后不消失
    public isSkill = false//是技能
    public hitList = {}//已撞过
    public hitBack = 0//推后
    public hitSkill = false//带刀技能
    public rotaAdd = 0
    public hurtTimeCD = 0
    public moveFun
    public atkFun


    public owner
    public constructor() {
        super();
        this.skinName = "PKBulletItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 25
        this.anchorOffsetY = 25
    }

    public setImage(url,rota=0){
        if(this.mv)
        {
            AniManager_wx3.getInstance().removeMV(this.mv)
            this.mv = null;
        }
        this.mc.source = url;
        this.mc.rotation = rota
    }

    public setMV(skillID){
        this.mv = AniManager_wx3.getInstance().getAni(skillID);
        this.addChild(this.mv);
        this.mv.x = this.mv.y = 25;
        this.mc.source = ''
        this.mv.rotation = -this.rotation
    }

    public dataChanged(){
        this.owner = this.data.owner;
        this.x = this.data.x
        this.y = this.data.y
        this.rotation = this.data.rota/Math.PI*180 + 90

        this.hitPass = false;
        this.atk = this.owner.atk;
        this.speed = this.owner.bulletSpeed;
        this.endTime = PKC.actionStep + PKC.frameRate*2;//默认2S后消失
        this.hitList = {};
        this.hitBack = 0;
        this.atkR = 0;
        this.rotaAdd = 0;
        this.hurtTimeCD = Number.MAX_VALUE;
        this.hitSkill = false;
        this.isSkill = false;
        this.moveFun = null;
        this.atkFun = null;


        this.setImage('')
    }

    public onE(){
        if(this.rotaAdd)
        {
            this.mc.rotation += this.rotaAdd
        }

        //move
        if(this.moveFun)
        {
            this.moveFun(this)
        }
        else
        {
            this.x += this.speed*Math.cos(this.data.rota)
            this.y += this.speed*Math.sin(this.data.rota)
        }



        //atk
        var arr = this.owner.isPlayer?PKC.monsterList:[PKC.playerData]
        var len = arr.length;
        var t = PKC.actionStep
        for(var i=0;i<len;i++)
        {
            var item = arr[i];
            if(item.isDie)
                continue;
            if(this.hitList[item.onlyID] && t - this.hitList[item.onlyID] < this.hurtTimeCD)
                continue;
            if(this.isSkill && !item.beSkillAble)
                continue;
            var dis = MyTool.getDis(this,item.getHitPos());
            if(dis < item.size + this.atkR)
            {
                this.hitList[item.onlyID] = t;
                item.addHp(-this.atk)
                if(this.atkFun)
                    this.atkFun();

                if(this.hitBack && item.hitBackAble)
                {
                    item.relateItem.resetXY(item.x + this.hitBack*Math.cos(this.data.rota),item.y + this.hitBack*Math.sin(this.data.rota))
                }
                if(this.hitSkill)
                    PKC.playerData.addGunBuff(item);
                if(!this.hitPass)
                    this.endTime = 0;
            }
        }
    }

    public remove(){
        MyTool.removeMC(this);
    }
}