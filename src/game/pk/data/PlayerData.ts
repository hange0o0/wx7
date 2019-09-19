class PlayerData{
    public isPlayer = true
    public onlyID = 'PlayerData'

    public x;
    public y;

    public size = 40//体积

    public baseAtk = 40
    public atk = 40
    public hp = 1000;
    public hpDef = 1000;
    public maxHp = 1000;
    public speed = 10
    public baseSpeed = 10
    public atkSpeed = PKTool.getStepByTime(600);  //攻击间隔上限300
    public hitBack = 100;
    public atkDis = 100;
    public lastAtkTime = 0;
    public bulletSpeed = 10;

    public doubleRate = 0.2
    public doubleValue = 1.5
    public missRate = 1.5
    public behurtAdd = 0//被打时扣血更多
    public rebornDec = 0//复活CD减小
    public coinAdd = 0//金币加成
    public beHitRate = 0

    public wudiStep = 0

    public gunid = 1;
    public buffArr = [];
    public skills = {}
    public skillsList = []
    public atkBuff = {}//用刀攻击带属性

    public hitEnemy
    public relateItem//

    public isSkilling = 0//正在使用的技能
    public isSkillingStopMove = false//正在使用技能,并且不能移动


    public isHide = false; //隐身

    public isFar = false; //远程形态
    public farAtkSpeedRate = 0.3; //远程形态
    public farAtkRate = 0.5; //远程形态

    public skillCD = {}//技能CD结束时间

    public stopEnd = 0;
    public isDie = 0;

    public getAtk(){
        //var hpStep = Math.ceil(8*this.hp/this.maxHp)
        return Math.ceil(this.atk * (2 - this.hp/this.maxHp))
    }

    public getHitPos(){
        return {
            x:this.x,
            y:this.y
        }
    }

    public initData(){
       this.isHide = false;
        this.isDie = 0;

        this.gunid = GunManager.getInstance().gunid
        var gunVO = GunVO.getObject(this.gunid)

        var playerData = PKManager.getInstance().getPlayerValue();
        this.atk = this.baseAtk = Math.ceil(playerData.atk * gunVO.atk/100);
        this.hp = playerData.hp
        this.speed = this.baseSpeed = 8
        this.atkSpeed = PKTool.getStepByTime(gunVO.atkspeed)
        this.hitBack = gunVO.atkback
        this.atkDis = gunVO.atkdis
        this.lastAtkTime = 0
        this.bulletSpeed = 10
        this.doubleRate = gunVO.doublerate/100
        this.doubleValue = gunVO.doublevalue
        this.missRate = gunVO.missrate/100
        this.hpDef = 0;
        this.wudiStep = 0;
        this.behurtAdd = 0;
        this.rebornDec = 0;
        this.coinAdd = 0;
        this.stopEnd = 0;
        this.beHitRate = 0;
        this.atkBuff = {}
        this.skillCD = {}
        this.isSkilling = 0;
        this.isSkillingStopMove = false;
        this.isHide = false;
        this.isFar = false;







        this.maxHp = this.hp
        this.buffArr.length = 0;



        var skill = _get['skill']?_get['skill'].split(','):[]
        if(skill.length == 0)
        {
            skill = PKC.chooseSkill
            //for(var i=0;i<51;i++)
            //{
            //    skill.push(i+1);
            //}
            //ArrayUtil_wx4.random(skill,3);
            //skill.length = 6
        }

        this.initSkill(skill);

    }

    //重新随机自动玩家技能
    public randomSKill(){
        var skill = []
        for(var i=0;i<51;i++)
        {
            if(i+1 == 4)//不要炮台技能
                continue;
            if(SkillManager.getInstance().getSkillNum(i+1))
                skill.push(i+1);
        }
        ArrayUtil_wx4.random(skill,3);
        skill.length = 6


        this.initSkill(skill)
    }

    public debugSkill(skillID){
        if(skillID)
        {
            this.skillCD = {}
            this.initSkill([skillID])
            this.useSkill(skillID)
            return;
        }
        var skill = []
        for(var i=0;i<52;i++)
        {
            skill.push(i+1);
        }
        this.initSkill(skill)
        for(var i=0;i<this.skillsList.length;i++)
        {
            this.skillsList[i].maxCD = 10;
        }
        this.hp = this.maxHp = 99999;
    }

    public initSkill(skill){

        for(var i=0;i<this.skillsList.length;i++)
        {
            this.skillsList[i].onRemoveSkill()
        }


        this.skills = {}
        this.skillsList = []
        for(var i=0;i<skill.length;i++)
        {
            var sItem = SBase.getItem(skill[i])
            this.skillsList.push(sItem)
            this.skills[sItem.sid] = sItem
            sItem.onCreate();
        }
    }

    public addBuff(buff){
          this.buffArr.push(buff);
    }

    public onStep(){
        var actionStep = PKC.actionStep
        for(var s in this.skills)
        {
            this.skills[s].onStep();
        }


        var len = this.buffArr.length;
        for(var i=0;i<len;i++)
        {
             var buff = this.buffArr[i];
            if(buff.endTime < actionStep)
            {
                buff.onEnd && buff.onEnd();
                this.buffArr.splice(i,1);
                len--;
                i--;
                continue;
            }
            buff.onStep && buff.onStep();
        }

        if(this.wudiStep > 0)
        {
            this.wudiStep --;
        }
    }

    //对怪物加上攻击BUFF
    public addGunBuff(monster,isNearAtk?){
        var monsterItem = monster.relateItem
        monster.lastBeHitTime = PKC.actionStep
        if(monster.hp <= 0)
        {
            var playerData = PKC.playerData
            if(this.atkBuff['xixue'] &&  playerData.hp < playerData.maxHp)
                playerData.addHp(this.atkBuff['xixue'].value)
            if(this.atkBuff['gun'] && isNearAtk)
            {
                var num = this.atkBuff['gun'].num;
                var hurt = Math.ceil(this.atkBuff['gun'].hurt*playerData.atk);
                for(var i=0;i<num;i++)
                {
                    var bullet = PKCodeUI.getInstance().shoot(playerData,Math.random()*2*Math.PI,monster);
                    bullet.setImage( 'knife_'+playerData.gunid+'_png');
                    bullet.endTime = PKC.actionStep + 60
                    bullet.speed = 30
                    bullet.hitBack = 0
                    bullet.atk = hurt
                }
            }
            if(this.atkBuff['bomb'] && isNearAtk)
            {
                var monsterList = PKC.monsterList;
                var len = monsterList.length;
                var atk = this.atkBuff['bomb'].hurt;
                var atkDis = this.atkBuff['bomb'].dis;
                for(var i=0;i<len;i++)
                {
                    var monster2 = monsterList[i];
                    if(monster2.isDie)
                        continue;
                    var dis = MyTool.getDis(monster2,monster)
                    if(dis < atkDis)
                    {
                        monster2.addHp(-atk);
                    }
                }

                PKTool.playMV({
                    mvType:1,
                    num:5,
                    key:'ani25',
                    type:'on',
                    anX:136/2,
                    anY:136/2,
                    item:monster.relateItem,
                    once:true,
                    xy:monster.getHitPos()
                })
            }
        }
        else
        {
            if(this.atkBuff['fire'])
                monsterItem.setFire(this.atkBuff['fire'].step,this.atkBuff['fire'].hurt)
            if(this.atkBuff['poison'])
                monsterItem.setPoison(this.atkBuff['poison'].step,this.atkBuff['poison'].hurt)
            if(this.atkBuff['ice'])
                monsterItem.setIce(this.atkBuff['ice'].step)
            if(this.atkBuff['yun'] && Math.random() < this.atkBuff['yun'].rate)
                monsterItem.setYun(this.atkBuff['yun'].step)
        }

    }


    public useSkill(id){
        if(this.isDie)
            return false;
        if(this.isSkilling)
            return false;
        if(this.getSkillCD(id) > 0)
            return false;

        if(this.skills[id] && this.skills[id].onUse())
        {
            this.skillCD[id] = PKC.actionStep + this.skills[id].maxCD;
            EM_wx4.dispatch(GameEvent.client.SKILL_USE)
            return true;
        }
    }

    //最剩余时间，0是可用
    public getSkillCD(id)
    {
        if(!this.skillCD[id])
            return 0;
        return Math.max(0,this.skillCD[id] - PKC.actionStep)
    }

    public addHp(v,enemy?){
        if(this.isDie)
            return;
        if(v<0)
        {
            if(this.wudiStep > 0)
                return;
            if(enemy && Math.random() < this.missRate)
            {
                var y = 300 - enemy.getVO().height - 20;
                PKTool.showWordMC(new eui.Image('miss_png'),enemy.relateItem,y)
                return;
            }

            if(this.behurtAdd)
                v = Math.floor(v*(1+this.behurtAdd))
            if(this.beHitRate)
                v = Math.floor(v*(1+this.beHitRate))

            if(this.hpDef>0)
            {
                this.hpDef += v;
                v = 0;
                if(this.hpDef < 0)
                {
                    v = this.hpDef;
                    this.hpDef = 0;
                }
            }

            this.onBehit(enemy)
            if(enemy)
                enemy.moveStartTime = 0;
            //if(this.isHide && !isBuff)
            //    return;
        }


        this.hp += v;


        if(this.hp > this.maxHp)
        {
            this.hp = this.maxHp
        }
        else if(this.hp <= 0)
        {
            this.hp = 0;
            this.isDie = 1;
        }

        this.relateItem.renewHp();
        if(this.hp <= 0)
        {
            this.onDie()
        }
        else if(v<0)
        {
            SoundManager.getInstance().playEffect('playerbehit')
        }

        PKTool.showHpChange(this,v)
        EM_wx4.dispatchEventWith(GameEvent.client.HP_CHANGE)
    }

    private onDie(){
        this.isSkilling = 0;
        this.isFar = false;
        this.isSkillingStopMove = false;
        this.isHide = false
        this.relateItem.alpha = 1

        SoundManager.getInstance().playEffect('playerdie')
        this.relateItem.showDieMV();
    }

    public canAtk(){
        if(this.isHide)
            return;
        var atkSpeed = this.atkSpeed;
        if(this.isFar)
            atkSpeed *= this.farAtkSpeedRate;
        return PKC.actionStep > this.lastAtkTime + atkSpeed
    }

    public onBehit(enemy){
        for(var s in this.skills)
        {
            this.skills[s].onBeHit(enemy);
        }
    }


}