class TowerItem extends game.BaseItem{

    private static pool = [];
    public static createItem():TowerItem {
        var item:TowerItem = this.pool.pop();
        if (!item) {
            item = new TowerItem();
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

    public remove(){
        MyTool.removeMC(this);
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