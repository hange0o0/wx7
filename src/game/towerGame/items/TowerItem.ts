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
    private effectGroup: eui.Group;
    private speedMC: eui.Image;
    private disMC: eui.Image;
    private atkMC: eui.Image;




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
        this.mv.gotoAndPay()
        this.mc.source = ''
        this.effectTowers = [];
        this.gvo = null;
        MyTool.removeMC(this.disBottomMC);
        this.effectGroup.removeChildren();
        if(this.data)
        {
            this.tw.setPaused(false)
            this.gvo = GunVO.getObject(this.data)
            this.mc.source = this.gvo.getUrl();

            this.lastHurtTime = 0
            this.atkSpeed = PKTool.getStepByTime(this.gvo.atkspeed)
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

    //加入新塔后调用
    public onAddTower(towerList){
        if(!this.gvo)
            return;
        this.onRemoveTower(towerList);
        var skills=['atk','speed','dis']
        var skillType = this.gvo.skilltype
        if(skills.indexOf(skillType) == -1)
            return;

        var atkdis = this.gvo.atkdis;
        var addValue = this.gvo.sv1/100;
        for(var i=0;i<towerList.length;i++)
        {
            var tower:TowerItem = towerList[i];
            if(tower == this)
                continue;
            var dis = MyTool.getDis(tower,this);
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
                        if(this.atkSpeed + value < 1)
                        {
                            value = -(this.atkSpeed - 1)
                            if(value >= 0)
                                continue;
                        }
                        this.atkSpeed += value;
                        break;
                    case 'dis':
                        value = Math.ceil(tower.gvo.atkdis*addValue)
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

    public resetBottomMC(con?){
        if(!this.gvo)
            return;
        con && con.addChild(this.disBottomMC);
        this.disBottomMC.width = this.disBottomMC.height = this.atkDis*2;
        this.disBottomMC.anchorOffsetX = this.disBottomMC.anchorOffsetY = this.atkDis;
        this.disBottomMC.x = this.x
        this.disBottomMC.y = this.y
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
        this.tw.setPaused(true)
        this.mv.stop();
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



        if(TC.actionStep - this.lastHurtTime < this.atkSpeed)
            return;

        var atkList = [];
        var len = monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(MyTool.getDis(this,mItem) > this.atkDis)
                continue
            atkList.push(mItem)
        }

        ArrayUtil_wx4.sortByField(atkList,['totalDis'],[0])
        for(var i=0;i<this.shootNum;i++)
        {
            if(atkList[i])
            {
                PKTowerUI.getInstance().createBullet(this,atkList[i])
                this.lastHurtTime = TC.actionStep;
            }
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
                this.statePoisonMV.x = 50
                this.statePoisonMV.y = 300
                this.statePoisonMV.setData('effect17_png',560/4,412/2,7,84)
                this.statePoisonMV.widthNum = 4
                this.statePoisonMV.stop()
            }
            this.addChild(this.statePoisonMV)
            this.statePoisonMV.play()
        }

        var speedAdd = -(Math.floor(PKTool.getStepByTime(this.gvo.atkspeed)*value/100) || 1)
        if(this.atkSpeed + speedAdd < 1)
        {
            speedAdd = -(this.atkSpeed - 1)
            if(speedAdd > 0)
                speedAdd = 0;
        }
        this.atkSpeed += speedAdd;

        this.speedStep = Math.max(step,this.speedStep);
        this.speedAdd += speedAdd;
    }

}