class PKTowerUI extends game.BaseUI_wx4 {

    private static _instance: PKTowerUI;
    public static getInstance(): PKTowerUI {
        if(!this._instance)
            this._instance = new PKTowerUI();
        return this._instance;
    }

    private list: eui.List;
    private levetText: eui.Label;
    private closeBtn: eui.Image;









    public pkMap = new PKMap();
    public scale


    public data;


    public mapData;
    public ww;
    public hh;

    public towerPos = {}
    public movePaths

    public monsterArr = []
    public bulletArr = []
    public constructor() {
        super();
        this.skinName = "PKTowerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addChildAt(this.pkMap,1);
        this.pkMap.horizontalCenter = 0
        this.pkMap.verticalCenter = -80


        this.list.itemRenderer = CreateMapItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([1,0])//1,

        this.addBtnEvent(this.closeBtn,()=>{
            this.hide()
        })

    }



    public show(data?){

        this.towerPos = data.tower
        this.movePaths = []
        for(var i=0;i<data.path.length;i++)
        {
            this.movePaths.push(TC.resetWalkArr(data.path[i].concat()))
        }
        var road = data.road
        data = this.data = data.vo;


        this.pkMap.initMap(data.id)
        this.ww = data.width
        this.hh = data.height
        var arr1 = data.getRoadData();

        this.mapData = [];
        for(var i=0;i<this.hh;i++)
        {
            this.mapData.push([]);
            for(var j=0;j<this.ww;j++)
            {
                var id = Math.floor(arr1[i][j]) || 0
                this.mapData[i].push(id);
            }
        }


        for(var i=0;i<road.length;i++)
        {
            var oo = road[i]
            this.mapData[oo.y][oo.x] = 1;
        }

        super.show()
    }

    public hide() {
        super.hide();
    }

    private renewMap(){
        this.pkMap.draw(this.mapData);
        this.pkMap.renewTower(this.towerPos);
    }

    public onShow(){
        while(this.monsterArr.length)
        {
            PKMonsterItem.freeItem(this.monsterArr.pop())
        }
        while(this.bulletArr.length)
        {
            PKBulletItem.freeItem(this.bulletArr.pop())
        }

        this.pkMap.width = 64*this.ww
        this.pkMap.height = 64*this.hh

        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh)
        this.pkMap.scaleX = this.pkMap.scaleY = this.scale;

        this.renewMap();
        TC.initData(this.data.id);

        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
    }

    private onE(){
        TC.onStep();


        var len = this.monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem = this.monsterArr[i];
            if(mItem.isDie == 2)
            {
                PKMonsterItem.freeItem(mItem);
                this.monsterArr.splice(i,1)
                len--;
                i--;
                continue;
            }
            mItem.onE();
        }

        var len = this.bulletArr.length;
        for(var i=0;i<len;i++)
        {
            var bItem = this.bulletArr[i];
            if(bItem.isDie)
            {
                PKBulletItem.freeItem(bItem);
                this.bulletArr.splice(i,1)
                len--;
                i--;
                continue;
            }
            bItem.onE();
        }

        var gunArr = this.pkMap.gunArr;
        len = gunArr.length;
        for(var i=0;i<len;i++)
        {
            var gItem = gunArr[i];
            gItem.onE(this.monsterArr);
        }


        this.pkMap.sortY();
    }

    public addMonster(mid,roadIndex = 0){
        var newItem = PKMonsterItem.createItem();
        this.monsterArr.push(newItem);
        this.pkMap.roleCon.addChild(newItem);
        newItem.data = mid;
        newItem.setPath(this.movePaths[roadIndex].concat());

        var startPos = TC.getMonsterPosByPath(newItem.path.shift());
        newItem.resetXY(startPos.x,startPos.y)
    }

    public createBullet(owner,target){
        var bullet = PKBulletItem.createItem();
        this.bulletArr.push(bullet);
        this.pkMap.topCon.addChild(bullet);
        bullet.data = {
            owner:owner,
            target:target,
        }
        bullet.resetXY(owner.x,owner.y - 50)
        return bullet;
    }

}