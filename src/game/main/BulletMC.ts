//class BulletMC extends game.BaseItem{
//    private static pool = [];
//    public static createItem():BulletMC{
//        var item:BulletMC = this.pool.pop();
//        if(!item)
//        {
//            item = new BulletMC();
//        }
//        return item;
//    }
//    public static freeItem(item){
//        if(!item)
//            return;
//        item.remove();
//        if(this.pool.indexOf(item) == -1)
//            this.pool.push(item);
//    }
//
//    private mc: eui.Image;
//
//    public speed = 20;
//    public hitMonster = {};//已攻击的怪物
//    //public hp = 0
//    public isDie = 0
//    //public vo:GunVO
//
//    public enemy
//    public addRota
//
//    public typeObj = {};
//    public isAuto = false
//    public disableSkill = false
//
//    public constructor() {
//        super();
//        this.skinName = "BulletItemSkin";
//    }
//
//    public childrenCreated() {
//        super.childrenCreated();
//        this.anchorOffsetX = 50
//        this.anchorOffsetY = 50
//        this.touchChildren = this.touchEnabled = false
//
//        this.mc.scaleX = -1
//    }
//
//
//    public dataChanged():void {
//        egret.Tween.removeTweens(this);
//        this.enemy = null;
//        this.alpha = 1;
//        this.isDie = 0;
//        this.scaleX = this.scaleY = this.data.scale || 0.7
//
//        this.rotation = 90 + (this.data.rota || 0);
//        this.disableSkill = this.data.disableSkill;
//        this.hitMonster = {};
//        this.typeObj = GunManager.getInstance().getGunVOs(this.data.id);
//        if(this.data.id < 100)
//        {
//            this.mc.source = 'knife_'+this.data.id+'_png'
//        }
//        else
//        {
//            var vos = GunManager.getInstance().getVOs(this.data.id)
//            this.mc.source = 'knife_'+vos.vo2.id+'_png'
//        }
//        //this.vo = GunVO.getObject(this.data.id)
//        this.speed = 20;
//        this.isAuto = false
//        if(!this.disableSkill && this.getTypeVO(13) && !this.data.scale)
//        {
//            this.isAuto = true
//            this.speed = 12;
//            var addRota = -90 + Math.random()*180;
//            this.rotation += addRota
//            this.addRota = addRota > 0?-5:5;
//        }
//        //console.log(this.data.rota)
//
//        this.speed *= 2;//帧频降了
//    }
//
//
//
//    private resetRota(rota){
//        while(rota < 0)
//            rota += 360
//        while(rota > 360)
//            rota -= 360
//        return rota
//    }
//    public move(){
//        //var b = this.x && this.y
//
//        if(this.isDie)
//            return;
//        if(this.isAuto)
//        {
//            if(isNaN(this.rotation))
//                console.log(66666)
//            if(!this.enemy || this.enemy.isDie)
//                this.enemy = PKCode_wx4.getInstance().randomEnemy();
//            var rota1 = this.rotation - 90;
//            if(this.enemy)
//            {
//                var rota = Math.atan2(this.enemy.y - this.y,this.enemy.x - this.x)/Math.PI*180
//                if(isNaN(rota))
//                    console.log(66666)
//                rota = this.resetRota(rota)
//                rota1 = this.resetRota(rota1)
//
//                if(Math.abs(rota-rota1)>5)
//                {
//                    this.rotation += this.addRota
//                    rota1 += this.addRota
//                }
//                else
//                {
//                    rota1 = rota
//                    this.rotation = rota1 + 90
//                }
//            }
//            this.x += this.speed*Math.cos(rota1/180*Math.PI)
//            this.y += this.speed*Math.sin(rota1/180*Math.PI)
//        }
//        else
//        {
//            this.x += this.speed*Math.cos(this.data.rota/180*Math.PI)
//            this.y += this.speed*Math.sin(this.data.rota/180*Math.PI)
//            if(this.x > 700 || this.y < -50 || this.y >  GameManager_wx4.uiHeight + 50)
//                this.isDie = 2;
//        }
//
//        //if(b && !this.x && !this.y)
//        //    console.log(999)
//    }
//
//    private getTypeVO(type){
//        return this.typeObj[type];
//    }
//
//    public testHit(monsterArr,ballArr){
//        if(this.isDie)
//            return;
//        var len = ballArr.length
//        for(var i=0;i<len;i++)
//        {
//             var ball = ballArr[i];
//            if(ball.y < this.y)
//                continue;
//            if(ball.y > this.y + 150)
//                continue;
//            if(Math.abs(ball.x -this.x)>60/2)
//                continue;
//            ball.addHp()
//            this.playDie();
//                return;
//        }
//        len = monsterArr.length;
//        for(var i=0;i<len;i++)
//        {
//            var item = monsterArr[i];
//            if(item.isDie)
//                continue;
//            if(item.isWuDi())
//                continue;
//            if(this.hitMonster[item.id]) //打过
//                continue;
//            if(item.y < this.y)
//                continue;
//            var mvo = item.vo;
//            if(item.y > this.y + mvo.height)
//                continue;
//            if(Math.abs(item.x -this.x)>mvo.width/2)
//                continue;
//
//            this.hitMonster[item.id] = true//已经对这个怪造成伤害了
//            if(!this.getTypeVO(2) || this.disableSkill) //穿透
//            {
//                this.playDie();
//                return;
//            }
//        }
//    }
//
//    public playDie(){
//        this.isDie = 1;
//        egret.Tween.get(this).to({
//            y:this.y - 50 + Math.random()*20,
//            x:this.x - 30 - Math.random()*30,
//            rotation:this.rotation + 360 + 360*Math.random(),
//            //alpha:0,
//        },300).call(()=>{
//            this.isDie = 2;
//        })
//    }
//
//    public remove():void {
//        MyTool.removeMC(this);
//        egret.Tween.removeTweens(this);
//        //console.log('remove')
//    }
//
//
//}