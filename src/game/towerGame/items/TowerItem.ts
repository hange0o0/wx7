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
    public level = 0
    public levelRate = 1

    public effectTowers = []//影响我的塔

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
            this.level = TowerManager.getInstance().level;

            this.levelRate = 1+(this.level-1)/5
            this.lastHurtTime = 0
            this.atkSpeed = PKTool.getStepByTime(this.gvo.atkspeed)
            this.atk = Math.ceil(this.gvo.atk*this.levelRate)
            this.atkDis = this.gvo.atkdis
            this.shootNum = this.gvo.shootnum

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
                        value = Math.ceil(tower.gvo.atk*0.1)
                        this.atk += value;
                        break;
                    case 'speed':
                        value = -(Math.floor(PKTool.getStepByTime(this.gvo.atkspeed)*0.1) || 1)
                        if(this.atkSpeed + value < 1)
                        {
                            value = -(this.atkSpeed - 1)
                            if(value >= 0)
                                continue;
                        }
                        this.atkSpeed += value;
                        break;
                    case 'dis':
                        value = Math.ceil(tower.gvo.atkdis*0.1)
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

}