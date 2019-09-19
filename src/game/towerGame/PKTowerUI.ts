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


    public data;


    public mapData;
    public ww;
    public hh;

    public towerPos = {}
    public movePaths

    public monsterArr = []
    public constructor() {
        super();
        this.skinName = "PKTowerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addChildAt(this.pkMap,1);


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
        var arr1 = data.data.split('|');
        for(var i=0;i<arr1.length;i++)
        {
            arr1[i] = arr1[i].split(',')
        }

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
            PKMonsterItem_wx3.freeItem(this.monsterArr.pop())
        }

        this.pkMap.width = 64*this.ww
        this.pkMap.height = 64*this.hh

        this.pkMap.x = (640 - this.pkMap.width)/2
        this.pkMap.y = (this.height - 150 - this.pkMap.height)/2

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

        this.pkMap.sortY();
    }

    public addMonster(mid,roadIndex = 0){
        var newItem = PKMonsterItem_wx3.createItem();
        this.monsterArr.push(newItem);
        this.pkMap.roleCon.addChild(newItem);
        newItem.path = this.movePaths[roadIndex].concat();
        var startPos = TC.getMonsterPosByPath(newItem.path.shift());
        newItem.data = MBase.getItem(mid);
        newItem.resetXY(startPos.x,startPos.y)
        return newItem.data;
    }



}