class HeroItem extends game.BaseItem {

    public path
    public targetPos
    public scale = 1

    public monsterMV:HeroMVItem = new HeroMVItem();




    public speed
    public atk
    public atkDis = 100


    public lastAtkTime = 0//上次攻击的时间
    public enemy//被攻击的目标
    public hurtStep//攻击到达倒计时
    public stopStep//不到移动的时间

    public frameSpeed = 1;
    public constructor() {
        super();
    }

    public childrenCreated() {
        super.childrenCreated();

        this.touchChildren = this.touchEnabled = false;

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 50;
        this.monsterMV.y = 300;
        this.anchorOffsetX = 50;
        this.anchorOffsetY = 300;
    }



    public dataChanged(){
        this.monsterMV.load(this.data)
        this.monsterMV.stand();
        this.monsterMV.alpha = 1;

        this.targetPos = null;
        this.path = null
        this.speed = 7
        this.atk = Math.ceil(TC.forceRate*150);
        this.atkDis = 100

        this.lastAtkTime = 0;
        this.enemy = null;
        this.hurtStep = 0;
        this.stopStep = 0;

        this.setSpeed(this.frameSpeed)
    }

    public setSpeed(speed){
        this.frameSpeed = speed
        this.monsterMV && this.monsterMV.setSpeed(speed)
    }


    public setPath(path){
        this.path = path;
        this.targetPos = null;
        if(this.stopStep && !this.hurtStep)
            this.stopStep = 0;
    }

    private testAtk(){
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = this.atkDis

        var enemy
        var minDis
        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            var dis = MyTool.getDis(mItem,this);
            if(dis > atkDis)
                continue

            if(!enemy || minDis > dis)
            {
                enemy = mItem;
                minDis = dis;
            }
        }

        if(enemy)
        {
            this.atkMV();
            this.hurtStep = 15;
            this.stopStep = 30;
            this.enemy = enemy;
            this.lastAtkTime = TC.actionStep;

            var addX = Math.floor(this.enemy.x - this.x)
            if(addX > 0)
                this.monsterMV.scaleX = -1*this.scale
            else if(addX < 0)
                this.monsterMV.scaleX = 1*this.scale
        }

    }


    public onE(){
        if(this.enemy && this.enemy.isDie)
        {
            this.enemy = null;
        }

        if(this.hurtStep > 0)
        {
            this.hurtStep --;
            if(this.hurtStep == 0)
            {
                if(this.enemy)
                {
                    this.enemy.addHp(-this.atk);
                }
            }
        }


        if(this.stopStep > 0)
        {
            this.stopStep --;
            return;
        }


        //move
        var speed = this.speed;
        if(!this.targetPos && this.path)
        {
            this.targetPos = TC.getMonsterPosByPath(this.path.shift());
        }
        if(!this.targetPos)//到终点
        {
            this.testAtk();
            return;
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

        this.x = this.x + addX
        this.y = this.y+addY
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

    public runMV(){
        if(this.monsterMV.state != MonsterMV.STAT_RUN )
            this.monsterMV.run();
    }

    public standMV(){
        if(this.monsterMV.state != MonsterMV.STAT_STAND)
            this.monsterMV.stand();
    }

    public atkMV(){
        this.monsterMV.atk();
    }


    public remove(){
        egret.Tween.removeTweens(this);
        MyTool.removeMC(this);
        this.monsterMV.stop();
    }
}