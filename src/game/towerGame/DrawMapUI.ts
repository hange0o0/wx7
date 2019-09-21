class DrawMapUI extends game.BaseUI_wx4 {

    private static _instance: DrawMapUI;
    public static getInstance(): DrawMapUI {
        if(!this._instance)
            this._instance = new DrawMapUI();
        return this._instance;
    }

    private list: eui.List;
    private startBtn: eui.Button;
    private backBtn: eui.Button;
    private addForceBtn: eui.Button;
    private resetBtn: eui.Button;
    private closeBtn: eui.Image;
    private levetText: eui.Label;




    public pkMap = new PKMap();
    public scale = 1;


    public data;


    public mapData;
    public ww;
    public hh;

    public towerPos = {}
    public movePaths = []
    public isChange = false
    public constructor() {
        super();
        this.skinName = "DrawMapUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addChildAt(this.pkMap,1);
        this.pkMap.horizontalCenter = 0
        this.pkMap.verticalCenter = -80


        this.list.itemRenderer = CreateMapItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([1,0])//1,

        this.pkMap.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this)
        this.pkMap.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this)
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this)

        this.addBtnEvent(this.closeBtn,()=>{
            this.hide()
        })
        this.addBtnEvent(this.backBtn,()=>{
            this.hide()
        })
        this.addBtnEvent(this.addForceBtn,()=>{
            this.hide()
        })
        this.addBtnEvent(this.resetBtn,()=>{
            var change = false
            for(var i=0;i<this.hh;i++)
            {
                for(var j=0;j<this.ww;j++)
                {
                    if(this.mapData[i][j] == 1)
                    {
                        this.mapData[i][j] = 0;
                        change  = true;
                    }
                }
            }
            if(change)
            {
                this.renewMap();
                this.movePaths = []
                this.showArrow();
                this.saveLocal();
            }
        })
        this.addBtnEvent(this.startBtn,()=>{
            this.onStartGame();
        })
    }

    public onStartGame(){
        for(var i=0;i<this.movePaths.length;i++)
        {
            if(!this.movePaths[i])
            {
                MyWindow.ShowTips('有出怪点被阻档了！')
                return;
            }
        }

        for(var s in this.towerPos)
        {
            if(!this.towerPos[s])
            {
                this.towerPos[s] = 6//Math.ceil(Math.random()*50);
                //MyWindow.ShowTips('这个位置还没放置飞刀哦！' + s)
                //return;
            }
        }

        if(!PKManager.getInstance().getEnergy())
        {
            var share = false;
            if(share)
            {
                MyWindow.Confirm('体力不足，分享到群可免去本次体力消耗。',(type)=>{
                    if(type == 1)
                    {
                        ShareTool.share('加入我们，让我们一起割草无双',Config.getShare(0),{},()=>{
                            this.startGame();
                        })
                    }
                },['取消', '分享到群'])
                return;
            }
            MyWindow.Confirm('体力不足，可观看广告可增加10点体力。',(type)=>{
                if(type == 1)
                {
                    ShareTool.openGDTV(()=>{
                        PKManager.getInstance().addEnergy(10);
                    })
                }
            },['取消', '观看广告'])
            return;
        }
        this.startGame();
    }
    public startGame(){
        PKManager.getInstance().addEnergy(-1)
        var road = [];
        for(var i=0;i<this.hh;i++)
        {
            for(var j=0;j<this.ww;j++)
            {
                if(this.mapData[i][j] == 1)
                {
                    road.push({
                        x:j,y:i,
                    })
                }
            }
        }

        var data = {
            vo:this.data,
            path:this.movePaths,
            tower:this.towerPos,
            road:road
        }
        PKTowerUI.getInstance().show(data)
    }


    private onTouch(e){

        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;
        if(this.mapData[y][x] != 0 && this.mapData[y][x]!= 1)
            return;

        var type = this.list.selectedItem || 0;
        if(this.mapData[y][x] != type)
        {
            this.isChange = true;
            this.mapData[y][x] = type;
            this.renewMap();
            this.saveLocal();
        }
    }

    private saveLocal(){
        var arr = [];
        for(var i=0;i<this.hh;i++)
        {
            for(var j=0;j<this.ww;j++)
            {
                if(this.mapData[i][j] == 1)
                {
                    arr.push({
                        x:j,y:i,
                    })
                }
            }
        }
        SharedObjectManager_wx4.getInstance().setValue('roundData',{
            id:this.data.id,
            data:arr
        })
    }

    private onTouchEnd(e){
        if(this.isChange)
        {
            this.isChange = false;
            this.movePaths = TC.findPath(this.mapData)
            this.showArrow();
        }
    }

    public show(data?){
        this.data = data;

        this.towerPos = {};
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
                if(id == 2)
                {
                    this.towerPos[j+'_' + i] = 0;
                }
            }
        }

        var roundData = SharedObjectManager_wx4.getInstance().getValue('roundData');
        if(roundData && roundData.id == data.id)
        {
            var arr = roundData.data;
            for(var i=0;i<arr.length;i++)
            {
                var oo = arr[i]
                if(this.mapData[oo.y] && this.mapData[oo.y][oo.x] === 0)
                    this.mapData[oo.y][oo.x] = 1;
            }
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
        this.pkMap.width = 64*this.ww
        this.pkMap.height = 64*this.hh
        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh)
        this.pkMap.scaleX = this.pkMap.scaleY = this.scale;



        this.renewMap();

        this.movePaths = TC.findPath(this.mapData)


        this.isChange = false;

        this.showArrow();
    }

    public showArrow(){
        var allRoadOK = true
        this.pkMap.clearArrow();
        for(var i=0;i<this.movePaths.length;i++)
        {
            if(!this.movePaths[i])
            {
                allRoadOK = false;
                continue;
            }
            this.pkMap.showArrow(this.movePaths[i],this.mapData);
        }


        if(allRoadOK)
        {
            this.startBtn.skinName = 'Btn2Skin'
        }
        else
        {
            this.startBtn.skinName = 'Btn1Skin'
        }

    }



}