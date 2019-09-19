class PKManager {
    private static instance:PKManager;

    public static getInstance():PKManager {
        if (!this.instance)
            this.instance = new PKManager();
        return this.instance;
    }

    public maxEnergy = 30;
    public energyCD = 30*60;

    public energy = 1;
    public lastEnergyTime = 1;

    public lastChooseData

    public playerLevel = 1
    public atkAdd = 10
    public hpAdd = 60
    public initData(data) {
        data = data || {}
        var energyData = data.energy || {};
        this.energy = energyData.v || 0;
        this.lastEnergyTime = energyData.t || 0;
        this.lastChooseData = data.choose || [];
        this.playerLevel = data.playerLevel || 1;
    }

    public getSave(){
        return {
            energy:{v:this.energy,t:this.lastEnergyTime},
            choose:this.lastChooseData,
            playerLevel:this.playerLevel,
        }
    }

    public getPlayerValue(level?,noAddForce?){
        level = level || this.playerLevel
        var atk = 60 + (level-1)*this.atkAdd
        var hp = 600 + (level-1)*this.hpAdd
        if(!noAddForce && UM_wx4.addForceEnd > TM_wx4.now())
        {
            atk = Math.ceil(atk*1.2);
            hp = Math.ceil(hp*1.2)
        }
        return {
            atk:atk,
            hp:hp
        }
    }

    public resetEnergy(){
        var num = Math.floor((TM_wx4.now() - this.lastEnergyTime)/this.energyCD)
        if(num)
        {
            this.energy += num;
            if(this.energy > this.maxEnergy)
                this.energy = this.maxEnergy;
            this.lastEnergyTime += num*this.energyCD;
        }
    }

    public getEnergy(){
        this.resetEnergy();
        return this.energy
    }

    public addEnergy(v){
        this.resetEnergy();
        this.energy += v;
        UM_wx4.needUpUser = true
    }

    public getNextEnergyCD(){
        return this.energyCD - (TM_wx4.now() - this.lastEnergyTime)
    }

    public getEnergyCost(){
        return Math.min(Math.ceil(UM_wx4.level/5),8)
    }

    public initChooseSkill(){
        this.lastChooseData = [];
        var mySkill = SkillManager.getInstance().mySkill.concat();
        if(mySkill.length > 12)
        {
            ArrayUtil_wx4.random(mySkill,3);
            mySkill.length = 12;
        }

        for(var i=0;i<mySkill.length;i++)
        {
            this.lastChooseData.push(mySkill[i].id)
        }
        UM_wx4.needUpUser = true
    }

    public endGame(result){
        var SM = SkillManager.getInstance();
        for(var s in result.skill)
        {
            SM.addSkill(s,result.skill[s])
        }
        UM_wx4.addCoin(result.coin)//save
        UM_wx4.needUpUser = true
    }

    public getWinResult(){
        var skillNum = 5 + UM_wx4.level;
        var skillArr = SkillManager.getInstance().getNewSkill(skillNum)
        var coin = 50 + Math.floor(Math.pow(UM_wx4.level,1.5))*50
        if(PKC.playerData.coinAdd)
            coin = Math.ceil(coin*(1+PKC.playerData.coinAdd))
        return {
            skill:skillArr,
            coin:coin,
            skillNum:skillNum
        }
    }

    public getFailResult(rate){
        var skillNum = Math.ceil(UM_wx4.level*0.5*rate);
        var skillArr = SkillManager.getInstance().getNewSkill(skillNum)
        var coin = Math.ceil(Math.pow(UM_wx4.level,1.5)*rate*20)
        if(PKC.playerData.coinAdd)
            coin = Math.ceil(coin*(1+PKC.playerData.coinAdd))
        return {
            skill:skillArr,
            coin:coin,
            skillNum:skillNum
        }
    }

    public getUpCost(){
        return 50 + Math.floor(Math.pow(this.playerLevel,1.8))*50
    }
    public upPlayerLevel(){
        var cost = this.getUpCost();
        this.playerLevel ++;
        UM_wx4.addCoin(-cost);
        SoundManager.getInstance().playEffect('upgrade')
    }


















    public sendKey
    public sendKeyName
    public sendGameStart(key){
        var wx = window['wx']
        if(!wx)
            return;
        this.sendKey = key
        this.sendKeyName = key == 9999?'无尽':'第'+key+'关'
        wx.aldStage.onStart({
            stageId : this.sendKey, //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
            stageName : this.sendKeyName,//关卡名称，该字段必传
            userId  : UM_wx4.gameid//用户ID
        })
    }

    public sendGameReborn(type){
        var wx = window['wx']
        if(!wx)
            return;
        wx.aldStage.onRunning({
            stageId : this.sendKey,    //关卡ID 该字段必传
            stageName : this.sendKeyName, //关卡名称  该字段必传
            userId : UM_wx4.gameid,//用户ID
            event : "revive",  //支付成功 关卡进行中，用户触发的操作    该字段必传
            params : {    //参数
                itemName : type || 'unknow',  //购买商品名称  该字段必传
            }
        })
    }

    public sendGameEnd(isSuccess,info?){
        var wx = window['wx']
        if(!wx)
            return;
        wx.aldStage.onEnd({
            stageId : this.sendKey,    //关卡ID 该字段必传
            stageName : this.sendKeyName, //关卡名称  该字段必传
            userId : UM_wx4.gameid,  //用户ID 可选
            event : isSuccess?"complete":"fail",   //关卡完成  关卡进行中，用户触发的操作    该字段必传
            params : {
                desc :info  || 'unknow'  //描述
            }
        })
    }
}