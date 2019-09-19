class PKCodeUI extends game.BaseContainer_wx4{
    private static _instance:PKCodeUI;
    public static getInstance():PKCodeUI {
        if (!this._instance)
            this._instance = new PKCodeUI();
        return this._instance;
    }


    public con: eui.Group;
    private bg: eui.Image;
    public bottomCon: eui.Group;
    public roleCon: eui.Group;
    public bulletCon: eui.Group;









    public playerItem = new PlayerItem()
    public monsterArr = [];
    public bulletArr = [];
    public bulletArr2 = [];
    public bombArr = [];
    public trapArr = [];
    public markArr = [];
    public lineArr = [];


    public constructor() {
        super();
        this.skinName = "PKCodeUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.roleCon.addChild(this.playerItem)
        PKC.playerData.relateItem = this.playerItem;

    }

    public renewConY(isE?){
       var toY = (GameManager_wx4.uiHeight - 320)/2 - this.playerItem.y;
        var toX = 320 - this.playerItem.x;

        if(isE && Math.abs(toY - this.con.y) + Math.abs(toX - this.con.x) > 60)
        {
            var rota = Math.atan2(toY - this.con.y,toX - this.con.x)
            toY = this.con.y + Math.sin(rota)*30
            toX = this.con.x + Math.cos(rota)*30
        }


        this.con.y = toY
        this.con.x = toX

        var x = toX%200;
        var y = toY%200
        if(x > 0)
            x -= 200
        if(y > 0)
            y -= 200
        this.bg.x = x
        this.bg.y = y
    }

    public onShow(){
        this.bg.source = UM_wx4.getBG();//'bg_'+Math.ceil(Math.random()*10)+'_jpg'
        while(this.monsterArr.length)
        {
            PKMonsterItem_wx3.freeItem(this.monsterArr.pop())
        }
        while(this.bulletArr.length)
        {
            PKBulletItem.freeItem(this.bulletArr.pop())
        }
        while(this.bulletArr2.length)
        {
            PKBulletItem2.freeItem(this.bulletArr2.pop())
        }
        while(this.bombArr.length)
        {
            BombItem.freeItem(this.bombArr.pop())
        }
        while(this.trapArr.length)
        {
            TrapItem.freeItem(this.trapArr.pop())
        }

        while(this.markArr.length)
        {
            PKMarkItem.freeItem(this.markArr.pop())
        }
        while(this.lineArr.length)
        {
            PKLineItem.freeItem(this.lineArr.pop())
        }

        PKC.initData()

        PKC.playerData.initData();
        this.playerItem.data = PKC.playerData;
        this.playerItem.resetXY(this.con.width/2,this.con.height/2)
        this.playerItem.showStandMV();
        this.renewConY();
        this.height = GameManager_wx4.uiHeight

        this.bg.height = 200 + Math.ceil(GameManager_wx4.uiHeight/200)*200
        this.bg.width = 200 + Math.ceil(GameManager_wx4.uiWidth/200)*200
    }

    public sortY(){
        var num = this.roleCon.numChildren;
        for(var i=1;i<num;i++)
        {
            var lastItem = this.roleCon.getChildAt(i-1)
            var currentItem = this.roleCon.getChildAt(i)
            if(currentItem.y < lastItem.y)//深度不对，调整
            {
                var index = i-1;
                for(var j = index - 1;j>=0;j--)
                {
                    var lastItem = this.roleCon.getChildAt(j)
                    if(currentItem.y > lastItem.y)
                    {
                        index = j+1;
                        break;
                    }
                }
                this.roleCon.setChildIndex(currentItem,index)
            }
        }
    }

    public onE(){
        PKC.onStep();
        var actionStep = PKC.actionStep;


        PKC.playerData.onStep()
        this.playerItem.onE()
 /*       this.addMonster();*/

        var len = this.bulletArr.length;
        for(var i=0;i<len;i++)
        {
            var bItem = this.bulletArr[i];
            if(bItem.endTime < actionStep)
            {
                PKBulletItem.freeItem(bItem);
                this.bulletArr.splice(i,1)
                len--;
                i--;
                continue;
            }
            bItem.onE();
        }

        var len = this.bulletArr2.length;
        for(var i=0;i<len;i++)
        {
            var bItem2 = this.bulletArr2[i];
            if(bItem2.isDie)
            {
                PKBulletItem2.freeItem(bItem2);
                this.bulletArr2.splice(i,1)
                len--;
                i--;
                continue;
            }
            bItem2.onE();
        }



        var len = this.monsterArr.length;
        for(var i=0;i<len;i++)
        {
             var mItem = this.monsterArr[i];
            if(mItem.data.isDie == 2)
            {
                PKMonsterItem_wx3.freeItem(mItem);
                this.monsterArr.splice(i,1)
                len--;
                i--;

                var index = PKC.monsterList.indexOf(mItem.data)
                if(index != -1)
                    PKC.monsterList.splice(index,1);
                continue;
            }
            mItem.onE();
        }

        len = this.bombArr.length
        for(var i=0;i<len;i++)
        {
            var bombItem = this.bombArr[i];
            if(bombItem.isDie == 2)
            {
                BombItem.freeItem(bombItem);
                this.bombArr.splice(i,1)
                i--;
                len -- ;
                continue;
            }
            bombItem.testHit();
        }

        len = this.trapArr.length
        for(var i=0;i<len;i++)
        {
            var trapItem = this.trapArr[i];
            if(trapItem.isDie)
            {
                TrapItem.freeItem(trapItem);
                this.trapArr.splice(i,1)
                i--;
                len --;
                continue;
            }
            trapItem.testHit();
        }

        len = this.markArr.length
        for(var i=0;i<len;i++)
        {
            var markItem = this.markArr[i];
            if(markItem.isDie == 2)
            {
                PKMarkItem.freeItem(markItem);
                this.markArr.splice(i,1)
                i--;
                len --;
                continue;
            }
            markItem.onE();
        }


        len = this.lineArr.length
        for(var i=0;i<len;i++)
        {
            var linetem = this.lineArr[i];
            if(linetem.isDie == 2)
            {
                PKLineItem.freeItem(linetem);
                this.lineArr.splice(i,1)
                i--;
                len --;
                continue;
            }
            linetem.onE();
        }

        this.sortY();
    }

    public addMonster(mid,x,y){
       var newItem = PKMonsterItem_wx3.createItem();
        this.monsterArr.push(newItem);
        this.roleCon.addChild(newItem);
        newItem.data = MBase.getItem(mid);
        newItem.resetXY(x,y)
        return newItem.data;
    }

    public shoot(owner,rota,fromXY?){
        var bullet = PKBulletItem.createItem();
        this.bulletArr.push(bullet);
        this.bulletCon.addChild(bullet);
        var x = fromXY?fromXY.x:owner.x
        var y = fromXY?fromXY.y:owner.y
        bullet.data = {
            owner:owner,
            rota:rota,
            x:x,
            y:y
        }
        return bullet;
    }

    public playerAtk(type,rota,len){
        var bullet = PKBulletItem2.createItem();
        var owner = PKC.playerData;
        this.bulletArr2.push(bullet);
        this.bulletCon.addChild(bullet);
        bullet.data = {
            owner:owner,
            rota:rota,
            type:type,
            len:len
        }
        return bullet;
    }

    public addBomb(monsterItem,hurt,hurtDis){
        var item = BombItem.createItem();
        this.bombArr.push(item);
        this.roleCon.addChild(item)


        item.dataChanged();
        item.decHp = hurt;
        item.hurtDis = hurtDis;
        item.x = monsterItem.x
        item.y = monsterItem.y
    }

    public addTrap(data){
        var item = TrapItem.createItem();
        this.trapArr.push(item);
        this.roleCon.addChild(item)

        item.data = data
        item.x = PKC.playerData.x
        item.y = PKC.playerData.y
    }


    public addMark(x,y,data){
        var item = PKMarkItem.createItem();
        this.markArr.push(item);
        this.bottomCon.addChild(item);

        item.data = data
        item.x = x
        item.y = y
    }

    public addLine(x,y,rota,data){
        var item = PKLineItem.createItem();
        this.lineArr.push(item);
        this.bulletCon.addChild(item);

        item.data = data
        item.x = x
        item.y = y
        item.rotation = rota;
        return item;
    }


}