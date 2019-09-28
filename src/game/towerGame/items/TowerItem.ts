class TowerItem extends game.BaseItem{

    public static index = 1
    private static pool = [];
    public static createItem():TowerItem {
        var item:TowerItem = this.pool.pop();
        if (!item) {
            item = new TowerItem();
            item.tid = this.index;
            this.index ++;
        }
        return item;
    }

    public static freeItem(item:TowerItem) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    public constructor() {
        super();
        this.skinName = "TowerItemSkin";
    }

    private mc: eui.Image;
    private disBottomMC: eui.Image;
    private disBottomMVMC: eui.Image;
    private effectGroup: eui.Group;
    private speedMC: eui.Image;
    private disMC: eui.Image;
    private atkMC: eui.Image;


    public posX
    public posY


    public tid = 0
    public gvo:GunVO
    private tw;
    private mv;


    public lastHurtTime = 0
    public atkSpeed = 0
    public atk = 0
    public atkDis = 0
    public shootNum = 0

    public effectTowers = []//影响我的塔

    public atkAdd = 0
    public atkStep = 0
    public speedAdd = 0
    public speedStep = 0

    public stateFireMV
    public statePoisonMV

    private isLighting = false

    public childrenCreated() {
        super.childrenCreated();
        this.mc.bottom = 50;
        this.tw = egret.Tween.get(this.mc,{loop:true}).to({bottom:30},300).to({bottom:50},300)
        this.anchorOffsetX = 32
        this.anchorOffsetY = 32

        var arr = [];
        for(var i=1;i<=11;i++)
        {
            arr.push('resource/game_assets2/map/gun_mv/mv_' + i + '.png')
        }
        this.mv = new MovieSimpleSpirMC()
        this.addChildAt(this.mv,0)
        this.mv.setData(arr);
        this.mv.anchorOffsetX = 66/2
        this.mv.anchorOffsetY = 30
        this.mv.x = 32
        this.mv.y = 32


    }

    public dataChanged():void {
        if(!this.mv)
            return;
        this.mv.gotoAndPay()
        this.mc.source = ''
        this.effectTowers = [];
        this.gvo = null;
        MyTool.removeMC(this.disBottomMC);
        MyTool.removeMC(this.disBottomMVMC);
        this.isLighting = false
        this.effectGroup.removeChildren();
        if(this.data)
        {
            this.tw.setPaused(false)
            this.gvo = GunVO.getObject(this.data)
            this.mc.source = this.gvo.getUrl();

            this.lastHurtTime = 0
            this.atkSpeed = this.gvo.atkspeed
            this.atk = Math.ceil(this.gvo.atk*TC.forceRate)
            this.atkDis = this.gvo.atkdis
            this.shootNum = this.gvo.shootnum

        }

        this.atkAdd = 0
        this.atkStep = 0
        this.speedAdd = 0
        this.speedStep = 0
        if(this.stateFireMV) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }
        if(this.statePoisonMV) {
            this.statePoisonMV.stop()
            MyTool.removeMC(this.statePoisonMV)
        }
    }

    public getDis(m2)
    {
        var x2 = Math.floor(m2.x/64)
        var y2 = Math.floor(m2.y/64)
        return Math.max(Math.abs(this.posX-x2),Math.abs(this.posY-y2))
    }

    //加入新塔后调用
    public onAddTower(towerList){
        if(!this.gvo)
            return;
        this.onRemoveTower(towerList);
        var skills=['atk','speed','dis']
        var skillType = this.gvo.skilltype
        if(skills.indexOf(skillType) == -1)
            return;

        var atkdis = this.gvo.sv1;
        var addValue = this.gvo.sv2/100;
        for(var i=0;i<towerList.length;i++)
        {
            var tower:TowerItem = towerList[i];
            if(tower == this)
                continue;
            var dis = this.getDis(tower);
            if(dis <= atkdis)
            {
                var value = 0;
                switch(skillType)
                {
                    case 'atk':
                        value = Math.ceil(tower.gvo.atk*addValue)
                        this.atk += value;
                        break;
                    case 'speed':
                        value = -(Math.floor(PKTool.getStepByTime(this.gvo.atkspeed)*addValue) || 1)
                        //if(this.atkSpeed + value < 1)
                        //{
                        //    value = -(this.atkSpeed - 1)
                        //    if(value >= 0)
                        //        continue;
                        //}
                        this.atkSpeed += value;
                        break;
                    case 'dis':
                        //if(this.atkDis > this.gvo.atkdis)
                        //    continue;
                        value =1;
                        this.atkDis += value;
                        break;
                }
                var effectData = {type:skillType,value:value,tid:this.tid}
                tower.addTowerEffect(effectData)
            }
        }
    }

    public addTowerEffect(effectData){
        if(!this.gvo)
            return;
        this.effectTowers.push(effectData)
        this.renewEffect();
    }

    public removeTowerEffect(tid){
        if(!this.gvo)
            return;
        for(var i=0;i<this.effectTowers.length;i++)
        {
            var effectData = this.effectTowers[i];
            if(effectData.tid == tid)
            {
                switch(effectData.type)
                {
                    case 'atk':
                        this.atk -= effectData.value;
                        break;
                    case 'speed':
                        this.atkSpeed -= effectData.value;
                        break;
                    case 'dis':
                        this.atkDis -= effectData.value;
                        break;
                }
                this.effectTowers.splice(i,1);
                i--;
            }
        }
        this.renewEffect();
    }

    //过程中移除塔调用
    public onRemoveTower(towerList){
        if(!this.gvo)
            return;
        for(var i=0;i<towerList.length;i++)
        {
            var tower:TowerItem = towerList[i];
            tower.removeTowerEffect(this.tid)
        }
    }

    private lastMap;
    public resetBottomMC(map?,con?){
        return;
        if(!this.gvo)
            return;
        map = map || this.lastMap;
        if(!map)
            return;

        this.lastMap = map;
        egret.Tween.removeTweens(this.disBottomMC)
        con && con.addChild(this.disBottomMC);
        this.setItemSize(map,this.disBottomMC)
    }

    public setItemSize(map,mc){
        var atkDis = this.atkDis
        if(atkDis > this.gvo.atkdis)
            atkDis = this.gvo.atkdis + 1;

        var xx = Math.floor(this.x/64)
        var yy = Math.floor(this.y/64)

        var left = Math.min(xx,atkDis)
        var right = Math.min(map.ww - (xx + 1),atkDis)
        var top = Math.min(yy,atkDis)
        var bottom = Math.min(map.hh - (yy + 1),atkDis)

        mc.width = (left+right + 1)*64
        mc.height = (top+bottom + 1)*64
        mc.anchorOffsetX = left*64 + 32;
        mc.anchorOffsetY = top*64 + 32;;
        mc.x = this.x
        mc.y = this.y
    }

    public showLight(pkMap){
        this.isLighting = true
        egret.Tween.removeTweens(this.disBottomMVMC)
        this.disBottomMVMC.alpha = 1;
        this.disBottomMVMC.scaleX = this.disBottomMVMC.scaleY = 0.1;
        this.setItemSize(pkMap,this.disBottomMVMC)
        pkMap.bottomCon.addChild(this.disBottomMVMC)
        egret.Tween.get(this.disBottomMVMC).to({alpha:0.5,scaleX:1,scaleY:1},500).
            wait(1500).to({alpha:0,scaleX:0.1,scaleY:0.1},500).call(this.removeLight,this)
    }

    private removeLight(){
        this.isLighting = false
        MyTool.removeMC(this.disBottomMVMC)
    }

    public renewEffect(){
        if(!this.gvo)
            return;
        this.effectGroup.removeChildren();
        for(var i=0;i<this.effectTowers.length;i++)
        {
            var effectData = this.effectTowers[i];
            this.effectGroup.addChild(this[effectData.type + 'MC'])
        }
        this.resetBottomMC();
    }

    public remove(){
        MyTool.removeMC(this);
        MyTool.removeMC(this.disBottomMC);
        this.stop();

        if(this.statePoisonMV)
            this.statePoisonMV.stop()
        if(this.stateFireMV)
            this.stateFireMV.stop()
    }

    public stop(){
        if(this.tw)
        {
            this.tw.setPaused(true)
            this.mv.stop();
        }
    }
    public play(){
        if(this.tw)
        {
            this.tw.setPaused(false)
            this.mv.play();
        }
    }

    public getHurt(mid){
        var add =  this.gvo.isAtkAdd(mid);
        if(add)
            return Math.ceil(this.atk*1.5)
        return this.atk
    }

    public onE(monsterArr){
        if(!this.data)
            return;
        this.runBuff();



        var atkSpeed = this.atkSpeed
        if(atkSpeed < 1)
            atkSpeed = 1
        if(TC.actionStep - this.lastHurtTime < atkSpeed)
            return;

        var atkList = [];
        var len = monsterArr.length;
        var atkDis = this.atkDis
        if(atkDis > this.gvo.atkdis)
            atkDis = this.gvo.atkdis + 1;
        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(this.getDis(mItem) > atkDis)
                continue
            atkList.push(mItem)
        }

        ArrayUtil_wx4.sortByField(atkList,['totalDis'],[0])

        var isShoot = false
        var shootNum = this.shootNum;
        var skillType = this.gvo.skilltype
        if(skillType)//优先加状态
        {
            var skills=['fire','yun','poison','ice']
            if(skills.indexOf(skillType) != -1)
            {
                for(var i=0;i<atkList.length;i++)
                {
                    mItem = atkList[i]
                    if(mItem.fireStep && skillType == 'fire')
                        continue;
                    if(mItem.yunStep && skillType == 'yun')
                        continue;
                    if(mItem.poisonStep && skillType == 'poison')
                        continue;
                    if(mItem.iceStep && skillType == 'ice')
                        continue;

                    PKTowerUI.getInstance().createBullet(this,mItem)

                    isShoot = true;

                    atkList.splice(i,1);
                    i--;
                    shootNum--;
                    if(shootNum <= 0)
                        break;
                }
            }
        }

        for(var i=0;i<shootNum;i++)
        {
            if(atkList[i])
            {
                PKTowerUI.getInstance().createBullet(this,atkList[i])
                isShoot = true;
            }
        }

        if(isShoot)
        {
            this.lastHurtTime = TC.actionStep;
            SoundManager.getInstance().playEffect('arc')
        }
    }

    private runBuff(){
        if(this.atkStep)
        {
            this.atkStep --;
            if(this.atkStep <= 0)
            {
                this.atkStep = 0;
                this.stateFireMV.stop()
                MyTool.removeMC(this.stateFireMV)
                this.atk -= this.atkAdd;
            }
        }

        if(this.speedStep)
        {
            this.speedStep --;
            if(this.speedStep <= 0)
            {
                this.speedStep = 0;
                this.statePoisonMV.stop()
                MyTool.removeMC(this.statePoisonMV)
                this.atkSpeed -= this.speedAdd;
            }
        }
    }


    public addAtk(step,value){
        if(!step)
            return;
        if(!this.atkStep)
        {
            if(!this.stateFireMV)
            {
                this.stateFireMV = new MovieSimpleSpirMC2()
                this.stateFireMV.anchorOffsetX = 531/3/2
                this.stateFireMV.anchorOffsetY = 532/2*0.8
                this.stateFireMV.x = 32
                this.stateFireMV.y = 32
                this.stateFireMV.setData('effect18_png',531/3,532/2,5,84)
                this.stateFireMV.widthNum = 3
                this.stateFireMV.stop()
            }
            this.addChild(this.stateFireMV)
            this.stateFireMV.play()
        }

        var atkAdd = Math.ceil(value/100*this.atk)
        this.atk += atkAdd;

        this.atkStep = Math.max(step,this.atkStep);
        this.atkAdd += atkAdd;
    }


    public addSpeed(step,value){
        if(!step)
            return;
        if(!this.speedStep)//表现晕
        {
            if(!this.statePoisonMV)
            {
                this.statePoisonMV = new MovieSimpleSpirMC2()
                this.statePoisonMV.anchorOffsetX = 560/4/2
                this.statePoisonMV.anchorOffsetY = 412/2*0.8
                this.statePoisonMV.x = 32
                this.statePoisonMV.y = 32
                this.statePoisonMV.setData('effect17_png',560/4,412/2,7,84)
                this.statePoisonMV.widthNum = 4
                this.statePoisonMV.stop()
            }
            this.addChild(this.statePoisonMV)
            this.statePoisonMV.play()
        }

        var speedAdd = -(Math.floor(PKTool.getStepByTime(this.gvo.atkspeed)*value/100) || 1)
        //if(this.atkSpeed + speedAdd < 1)
        //{
        //    speedAdd = -(this.atkSpeed - 1)
        //    if(speedAdd > 0)
        //        speedAdd = 0;
        //}
        this.atkSpeed += speedAdd;

        this.speedStep = Math.max(step,this.speedStep);
        this.speedAdd += speedAdd;
    }

}