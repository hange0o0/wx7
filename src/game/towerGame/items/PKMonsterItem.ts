class PKMonsterItem extends game.BaseItem {
    private static pool = [];
    private static index = 1
     public static createItem():PKMonsterItem{
         var item:PKMonsterItem = this.pool.pop();
         if(!item)
         {
             item = new PKMonsterItem();
         }
         item.id = this.index;
         this.index++
         return item;
     }
     public static freeItem(item){
         if(!item)
             return;
         item.remove();
         if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
     }

    private hpBar: HPBar;

    public path
    public targetPos
    public scale = 1



    public id = 0;
    public yunStep = 0;
    public iceStep = 0;
    public fireStep = 0;
    public poisonStep = 0;
    public fireHurt = 0;
    public poisonHurt = 0;
    public speedRate = 0;
    public lastHurtTime = 0;

    public stateYunMV
    public stateFireMV
    public statePoisonMV
    public iceMC:eui.Image
    public monsterMV:PKMonsterMV_wx3 = new PKMonsterMV_wx3();
    
    

    public totalDis = 0;//到终点的距离，用于箭塔攻击排序
    public speed
    public mvo:MonsterVO
    public hp
    public maxHp
    public isDie

    public constructor() {
        super();
        this.skinName = "PKMonsterItemSkin";
        this.monsterMV.addEventListener('mv_die',this.onDieFinish,this)
    }

    public childrenCreated() {
        super.childrenCreated();

        this.touchChildren = this.touchEnabled = false;
        this.hpBar.currentState = 's2';

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 50;
        this.monsterMV.y = 300;
        this.anchorOffsetX = 50;
        this.anchorOffsetY = 300;
    }

    public setPath(path){
        this.path = path;
        var dis = 0;
        var lastPos
        for(var i=0;i<path.length;i++)
        {
            if(lastPos)
            {
                dis += Math.abs(lastPos[0] - path[i][0]) + Math.abs(lastPos[1] - path[i][1])
            }
            lastPos = path[i];
        }
        this.totalDis = dis*64;

    }
    public resetHpBarY(){
        this.hpBar.y = 300 - this.mvo.height*this.scale - 20
        this.monsterMV.scaleX = this.monsterMV.scaleY = this.scale

    }

    public dataChanged(){
        this.mvo = MonsterVO.getObject(this.data)
        
        this.monsterMV.load(this.mvo.id)
        this.monsterMV.stand();
        this.monsterMV.alpha = 1;
        this.resetHpBarY();

        this.iceStep = 0;
        this.yunStep = 0;
        this.fireStep = 0;
        this.poisonStep = 0;
        this.fireHurt = 0;
        this.poisonHurt = 0;
        this.lastHurtTime = 0;
        this.targetPos = null;
        
        this.isDie = 0
        this.speed = this.mvo.speed/10
        var hp = Math.ceil(TC.monsterHPRate * this.mvo.hp);
        this.hp = hp
        this.maxHp = hp;
        this.speedRate = 1;
        
        
        

        MyTool.removeMC(this.iceMC)
        this.hpBar.visible = false;
        this.renewHp();

        if(this.stateYunMV) {
            this.stateYunMV.stop()
            MyTool.removeMC(this.stateYunMV)
        }
        if(this.stateFireMV) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }
        if(this.statePoisonMV) {
            this.statePoisonMV.stop()
            MyTool.removeMC(this.statePoisonMV)
        }
    }

    public resetXY(x,y){
        this.x = x;
        this.y = y;
    }

    private onDieFinish(){
        if(this.isDie)
            this.isDie = 2;
    }

    public setIce(step,speedRate){
        if(!step)
            return;
        if(!this.iceMC)
        {
            this.iceMC =  new eui.Image('effect_ice_png');
            this.iceMC.anchorOffsetX = 102
            this.iceMC.anchorOffsetY = 161
            this.iceMC.x = 50;
            this.iceMC.y = 300;

        }

        this.iceStep = Math.max(step,this.iceStep);
        this.speedRate = Math.min(speedRate,this.speedRate);

        this.iceMC.scaleX = this.iceMC.scaleY = this.mvo.height/140*this.scale
        this.addChild(this.iceMC);
    }

    public setYun(step){
        if(!step)
            return;
        if(!this.yunStep)//表现晕
        {
            if(!this.stateYunMV)
            {
                this.stateYunMV = new MovieSimpleSpirMC2()
                this.stateYunMV.x =  50 -  154/4
                this.stateYunMV.setData('effect2_png',154/2,39,2,1000/6)
                this.stateYunMV.stop()
            }
            this.addChild(this.stateYunMV)
            this.stateYunMV.y = 300 - this.mvo.height - 35;
            this.stateYunMV.play()
            this.standMV()
        }
        this.yunStep = Math.max(step,this.yunStep);
    }

    public setFire(step,hurt){
        if(!step)
            return;
        if(!this.fireStep)//表现晕
        {
            if(!this.stateFireMV)
            {
                this.stateFireMV = new MovieSimpleSpirMC2()
                this.stateFireMV.anchorOffsetX = 531/3/2
                this.stateFireMV.anchorOffsetY = 532/2*0.8
                this.stateFireMV.x = 50
                this.stateFireMV.y = 300
                this.stateFireMV.setData('effect18_png',531/3,532/2,5,84)
                this.stateFireMV.widthNum = 3
                this.stateFireMV.stop()
            }
            this.addChild(this.stateFireMV)
            this.stateFireMV.play()
            this.stateFireMV.scaleX = this.stateFireMV.scaleY = this.mvo.height/140*this.scale
        }
        this.fireStep = Math.max(step,this.fireStep);
        this.fireHurt = Math.max(hurt,this.fireHurt);
    }


    public setPoison(step,hurt){
        if(!step)
            return;
        if(!this.poisonStep)//表现晕
        {
            if(!this.statePoisonMV)
            {
                this.statePoisonMV = new MovieSimpleSpirMC2()
                this.statePoisonMV.anchorOffsetX = 560/4/2
                this.statePoisonMV.anchorOffsetY = 412/2*0.8
                this.statePoisonMV.x = 50
                this.statePoisonMV.y = 300
                this.statePoisonMV.setData('effect17_png',560/4,412/2,7,84)
                this.statePoisonMV.widthNum = 4
                this.statePoisonMV.stop()
            }
            this.addChild(this.statePoisonMV)
            this.statePoisonMV.play()
            this.statePoisonMV.scaleX = this.statePoisonMV.scaleY = this.mvo.height/140*this.scale
        }
        this.poisonStep = Math.max(step,this.poisonStep);
        this.poisonHurt = Math.max(hurt,this.poisonHurt);
    }

    public onE(){
        if(this.isDie)
            return;
        this.runBuff();
        if(this.isDie)//buff会至死
            return;
        if(this.yunStep)
            return;

        //move
        var speed = this.speed*this.speedRate;


        if(!this.targetPos)
        {
            this.targetPos = TC.getMonsterPosByPath(this.path.shift());
            if(!this.targetPos)//到终点
            {
                this.isDie = 2
                PKTowerUI.getInstance().onFail();
                return;
            }
        }

        var addX = this.targetPos.x -  this.x
        var addY = this.targetPos.y -  this.y

        if(Math.abs(addX) < 1)
            addX = 0
        else if(Math.abs(addX) > speed)
            addX = addX>0?speed:-speed

        if(Math.abs(addY) < 1)
            addY = 0
        else if(Math.abs(addY) > speed)
            addY = addY>0?speed:-speed

        this.totalDis -= Math.abs(addX) + Math.abs(addY)
        this.resetXY(this.x + addX,this.y+addY)
        this.runMV();


        this.monsterMV.scaleY = this.scale
        if(addX > 0)
            this.monsterMV.scaleX = -1*this.scale
        else if(addX < 0)
            this.monsterMV.scaleX = 1*this.scale

        if(Math.abs(this.targetPos.x -  this.x) < 1 && Math.abs(this.targetPos.y -  this.y) < 1 )
        {
            this.targetPos = TC.getMonsterPosByPath(this.path.shift());
        }
    }


    private runBuff(){
        if(this.yunStep)
        {
            this.yunStep --;
            if(this.yunStep <= 0)
            {
                this.yunStep = 0;
                this.stateYunMV.stop()
                MyTool.removeMC(this.stateYunMV)
            }
        }

        if(this.iceStep)
        {
            this.iceStep --;
            if(this.iceStep <= 0)
            {
                this.iceStep = 0;
                this.speedRate = 1;
                MyTool.removeMC(this.iceMC)
            }
        }

        if(this.fireStep)
        {
            this.fireStep --;
            if(this.fireStep <= 0)
            {
                this.fireStep = 0;
                this.stateFireMV.stop()
                MyTool.removeMC(this.stateFireMV)
            }
        }

        if(this.poisonStep)
        {
            this.poisonStep --;
            if(this.poisonStep <= 0)
            {
                this.poisonStep = 0;
                this.statePoisonMV.stop()
                MyTool.removeMC(this.statePoisonMV)
            }
        }

        if(!this.isDie && TC.actionStep - this.lastHurtTime >= TC.frameRate)
        {
            this.lastHurtTime = TC.actionStep;
            var hurt = this.fireHurt + this.poisonHurt;
            if(hurt)
                this.addHp(-hurt)
        }
    }

    public addHp(v){
        if(this.isDie)
            return
        this.hp += v;
        if(this.hp <= 0)
        {
            this.hp = 0;
            this.isDie = 1
            this.dieMV();
        }
        this.renewHp()
        this.hpBar.visible = !this.isDie && this.hp < this.maxHp
    }


    public runMV(){
        if(this.monsterMV.state != MonsterMV.STAT_RUN )
            this.monsterMV.run();
    }

    public standMV(){
        if(this.monsterMV.state != MonsterMV.STAT_STAND)
            this.monsterMV.stand();
    }

    public dieMV(){

        MyTool.removeMC(this.iceMC)
        if(this.stateYunMV) {
            this.stateYunMV.stop()
            MyTool.removeMC(this.stateYunMV)
        }
        if(this.stateFireMV) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }
        if(this.statePoisonMV) {
            this.statePoisonMV.stop()
            MyTool.removeMC(this.statePoisonMV)
        }


        this.monsterMV.die();
        this.mvo.playDieSound()
        this.hpBar.visible = false;
    }

    public atkMV(){
        this.monsterMV.atk();
    }

    public renewHp(){
        this.hpBar.data = this;
    }

    public getHitPos(){
        return {
            x:this.x,
            y:this.y - this.mvo.height*0.4*this.scale
        }
    }


    public remove(){
        egret.Tween.removeTweens(this);
        MyTool.removeMC(this);
        this.monsterMV.stop();

        if(this.statePoisonMV)
            this.statePoisonMV.stop()
        if(this.stateFireMV)
            this.stateFireMV.stop()
        if(this.stateYunMV)
            this.stateYunMV.stop()
    }
}