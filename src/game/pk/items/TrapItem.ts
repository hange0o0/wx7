class TrapItem extends game.BaseItem{
    private static pool = [];

    public static createItem():TrapItem {
        var item:TrapItem = this.pool.pop();
        if (!item) {
            item = new TrapItem();
        }
        return item;
    }

    public static freeItem(item:TrapItem) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    private hpBar: HPBar;


    private skillMC = new eui.Image()
    private mv:MovieSimpleSpirMC;
    private baseScale = 1.5;
    public isDie = 0;

    public hp = 0;
    public maxHp = 0;
    public hurt = 0;
    public hurtDis = 0;
    public hurtMonster = {};
    public lastHit = 0


    public constructor() {
        super();
        this.skinName = "TrapItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.mv = new MovieSimpleSpirMC();
        this.mv.scaleX = this.mv.scaleY = this.baseScale;
        this.mv.x = 0;
        this.mv.y = 0;

        this.skillMC.horizontalCenter = 0
        this.skillMC.verticalCenter = 0
    }

    public dataChanged(){
        this.hurtMonster = {};
        this.isDie = 0
        MyTool.removeMC(this.skillMC)
        MyTool.removeMC(this.mv)
        this.mv.stop();

        this.hp = this.data.hp
        this.maxHp = this.data.hp
        this.hurtDis = this.data.hurtDis
        this.lastHit = 0;

        if(this.data.id == 16)
        {
            this.skillMC.source = 'knife_'+PKC.playerData.gunid+'_png'
            this.addChildAt(this.skillMC,0)
            this.hpBar.y = -70
        }
        else if(this.data.id == 17)
        {
            this.addChildAt(this.mv,0)
            this.mv.setData(PKTool.getMVList('ani17',6),84)
            this.mv.anchorOffsetX = 78/2
            this.mv.anchorOffsetY = 146*0.8
            this.mv.gotoAndPay(0,0)
            this.hpBar.y = -100
        }
        else if(this.data.id == 18)
        {
            this.addChildAt(this.mv,0)
            this.mv.setData(PKTool.getMVList('ani18',5),84)
            this.mv.anchorOffsetX = 116/2
            this.mv.anchorOffsetY = 169*0.8
            this.mv.gotoAndPay(0,0)
            this.hpBar.y = -100
        }
        else if(this.data.id == 19)
        {
            this.addChildAt(this.mv,0)
            this.mv.setData(PKTool.getMVList('ani19',2),84)
            this.mv.anchorOffsetX = 116/2
            this.mv.anchorOffsetY = 116*0.7
            this.mv.gotoAndPay(0,0)
            this.hpBar.y = -100
        }
    }

    public remove(){
        this.mv && this.mv.stop();
        MyTool.removeMC(this);
    }

    public testHit(){
        if(this.isDie)
            return;
        if(this.data.id == 16)
        {
            this.skillMC.rotation -= 30;
        }
        this.hp --;
        if(this.hp < 0)
        {
            this.isDie = 1
            return;
        }
        var t = PKC.actionStep
        if(this.lastHit > t)
            return;




        this.hpBar.data = {hp:this.hp,maxHp:this.maxHp}
        var arr = PKC.monsterList;
        var len = arr.length;
        var dis = this.hurtDis
        for(var i=0;i<len;i++)
        {
            var mData =  arr[i];
            if(mData.isDie)
                continue;
            if(!mData.beSkillAble)
                continue;
            if(!mData.trapAble)
                continue;
            if(t < (this.hurtMonster[mData.onlyID] || 0))
                continue
            if(Math.abs(this.x - mData.x) < dis && Math.abs(this.y - mData.y) < dis)
            {
                this.onHit(mData);
            }
        }
    }

    public onHit(monster){
        if(this.data.id == 16)
        {
            monster.addHp(-this.data.hurt)
            this.hurtMonster[monster.onlyID] = PKC.actionStep + PKC.frameRate;
        }
        else if(this.data.id == 17)
        {
            monster.relateItem.setPoison(Number.MAX_VALUE,this.data.hurt)
            this.hurtMonster[monster.onlyID] = Number.MAX_VALUE
        }
        else if(this.data.id == 18)
        {
            monster.relateItem.setFire(this.data.step,this.data.hurt)
            this.hurtMonster[monster.onlyID] = PKC.actionStep + this.data.step
        }
        else if(this.data.id == 19)
        {
            this.lastHit = PKC.actionStep + PKC.frameRate;


            var lastMonster = monster;
            var nearList = [monster];
            var monsterObj = {};
            monsterObj[monster.onlyID] = true;

            var dis = this.hurtDis*2

            var monsterList = PKC.monsterList;
            var len = monsterList.length;
            while(nearList.length < 3)
            {
                var minMonster:any = null;
                var minDis = dis;
                for(var i=0;i<len;i++)
                {
                    var monster = monsterList[i];
                    if(monster.isDie)
                        continue;
                    if(monsterObj[monster.onlyID])
                        continue

                    var dis = MyTool.getDis(monster,lastMonster)
                    if(dis <= minDis)
                    {
                        minMonster = monster
                        minDis = dis
                    }
                }
                if(!minMonster)
                {
                    break;
                }

                nearList.push(minMonster)
                monsterObj[minMonster.onlyID] = true;
                lastMonster = minMonster;

            }
            nearList.unshift({x:this.x,y:this.y - 20})
            for(var i=0;i<nearList.length-1;i++)
            {
                var from = nearList[i]
                var to = nearList[i+1]
                to.addHp(-this.data.hurt)
                PKTool.showLight(from,to)
            }
        }

    }
}