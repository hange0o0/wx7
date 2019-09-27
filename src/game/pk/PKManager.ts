class PKManager {
    private static instance:PKManager;

    public static getInstance():PKManager {
        if (!this.instance)
            this.instance = new PKManager();
        return this.instance;
    }

    public maxEnergy = 20;
    public energyCD = 30*60;

    public energy = 1;
    public lastEnergyTime = 1;
    public forceAdd = 0;
    public heroid = 101;
    public heroList = [101];


    public playerLevel = 1
    public atkAdd = 20

    public gunList = [];
    public initData(data) {
        data = data || {}
        var energyData = data.energy || {};
        this.energy = energyData.v || 0;
        this.lastEnergyTime = energyData.t || 0;
        this.playerLevel = data.playerLevel || 1;
        this.gunList = data.gunList || [];
        this.forceAdd = data.forceAdd || 0;
        this.heroid = data.heroid || 101;
    }

    public getSave(){
        return {
            energy:{v:this.energy,t:this.lastEnergyTime},
            playerLevel:this.playerLevel,
            gunList:this.gunList,
            forceAdd:this.forceAdd,
            heroid:this.heroid,
        }
    }

    public setHeroID(id){
        this.heroid = id;
        UM_wx4.needUpUser = true;
        EM_wx4.dispatch(GameEvent.client.HERO_CHANGE)
    }

    public resetSkin(){
        this.heroList = [101];
        for(var s in UM_wx4.shareUser)
        {
            var id = parseInt(s) || 0;
            if(id > 100)
                this.heroList.push(id)
        }
    }

    public getPlayerValue(level?){
        level = level || this.playerLevel
        return (level-1)*this.atkAdd
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
        if(this.energy < 0)
            this.energy = 0;
        UM_wx4.needUpUser = true
    }

    public getNextEnergyCD(){
        return this.energyCD - (TM_wx4.now() - this.lastEnergyTime)
    }


    public initGunList(num){

        if(this.gunList.length < num)
        {
            if(UM_wx4.level == 1)
            {
                this.gunList = [2,1,1,3,3,3,3,3];
            }
            else
            {
                this.gunList = this.getGunArr(num,true);
            }

            UM_wx4.needUpUser = true
        }
    }

    public addGunList(num = 5){
        var newList = this.getGunArr(num)
        this.gunList = this.gunList.concat(newList);
        UM_wx4.needUpUser = true
        return newList;
    }

    public getGunArr(num,isInit?){
        var resultArr = []
        var monsterList = [];
        var level = UM_wx4.level
        for(var s in GunVO.data)
        {
            var gvo = GunVO.data[s]
            if(gvo.level <= level)
            {
                monsterList.push(gvo.id)
                if(isInit && gvo.level == level)
                {
                    resultArr.push(gvo.id)
                    resultArr.push(gvo.id)
                    num -= 2;
                }
            }
        }

        while(num > 0)
        {
            num --;
            resultArr.push(ArrayUtil_wx4.randomOne(monsterList))
        }
        return resultArr;
    }

    //public initChooseSkill(){
    //    this.lastChooseData = [];
    //    var mySkill = SkillManager.getInstance().mySkill.concat();
    //    if(mySkill.length > 12)
    //    {
    //        ArrayUtil_wx4.random(mySkill,3);
    //        mySkill.length = 12;
    //    }
    //
    //    for(var i=0;i<mySkill.length;i++)
    //    {
    //        this.lastChooseData.push(mySkill[i].id)
    //    }
    //    UM_wx4.needUpUser = true
    //}
    //
    //public endGame(result){
    //    var SM = SkillManager.getInstance();
    //    for(var s in result.skill)
    //    {
    //        SM.addSkill(s,result.skill[s])
    //    }
    //    UM_wx4.addCoin(result.coin)//save
    //    UM_wx4.needUpUser = true
    //}
    //

    public getForceRate(){
        var force = 1 + (this.playerLevel-1)*0.2;
        return force*(1+this.forceAdd);
    }

    public addForce(){
        this.forceAdd += 0.2;
        UM_wx4.needUpUser = true
    }

    public getWinCoin(level){
        var rate = 1 + Math.max(0,this.heroList.length-1)/100
        return Math.ceil(level * 50 * rate)
    }

    public getFailCoin(level,rate){
        var rate2 = 1 + Math.max(0,this.heroList.length-1)/100
        return Math.ceil(level * rate * 20 * rate2)
    }

    public onGameEnd(isWin){
        this.forceAdd = 0;
        if(isWin)
            this.gunList.length = 0;
        UM_wx4.needUpUser = true
    }

    public getUpCost(){
        return 50 + Math.floor(Math.pow(this.playerLevel,1.5))*50
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