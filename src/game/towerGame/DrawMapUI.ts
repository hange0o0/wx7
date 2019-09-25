class DrawMapUI extends game.BaseUI_wx4 {

    private static _instance: DrawMapUI;
    public static getInstance(): DrawMapUI {
        if(!this._instance)
            this._instance = new DrawMapUI();
        return this._instance;
    }

    private list: eui.List;
    private startBtn: eui.Button;
    private randomBtn: eui.Button;
    private addForceBtn: eui.Button;
    private resetBtn: eui.Button;
    private closeBtn: eui.Image;
    private monsterGroup: eui.Group;
    private monsterList: eui.List;
    private monsterBtn: eui.Group;
    private levetText: eui.Label;




    public isTest = false;

    public pkMap = new PKMap();
    public scale = 1;


    public data;


    public mapData;
    public ww;
    public hh;

    public towerPos = {}
    public movePaths = []
    public startPos = []
    public endPos = []
    public isChange = false
    public touchPos

    public isGuiding = false
    private showMonsterListTime = 0
    public constructor() {
        super();
        this.skinName = "DrawMapUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addChildAt(this.pkMap,1);
        this.pkMap.horizontalCenter = 0
        this.pkMap.verticalCenter = -80

        this.monsterList.itemRenderer = MonsterHeadItem
        this.addBtnEvent(this.monsterBtn,()=>{
            this.showMonsterListTime = egret.getTimer();
            this.monsterGroup.visible = true;
            var arr = this.data.monsterArr;
            this.monsterList.dataProvider = new eui.ArrayCollection(arr)
            if(arr.length <= 6)
                this.monsterList.layout['requestedColumnCount'] = arr.length;
            else
                this.monsterList.layout['requestedColumnCount'] = Math.ceil(arr.length/2);
        })

        this.list.itemRenderer = CreateMapItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([1,0])//1,

        this.pkMap.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this)
        this.pkMap.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this)
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this)

        this.addBtnEvent(this.closeBtn,()=>{
            this.hide()
        })

        this.addBtnEvent(this.randomBtn,this.randomGun)

        this.addBtnEvent(this.addForceBtn,()=>{
            PKManager.getInstance().addForce();
            this.addForceBtn.label = '战力+' + PKManager.getInstance().forceAdd*100 + '%'
        })

        this.addBtnEvent(this.resetBtn,this.onReset)
        this.addBtnEvent(this.startBtn,()=>{
            this.onStartGame();
        })

        this.addBtnEvent(this,(e)=>{
            if(this.monsterGroup.visible)
            {
                if(egret.getTimer() - this.showMonsterListTime < 100)
                    return
                if(!this.monsterGroup.hitTestPoint(e.stageX,e.stageY))
                {
                    this.monsterGroup.visible = false;
                }
            }
        })
    }

    private randomGun(){
        var list = PKManager.getInstance().gunList.concat();
        ArrayUtil_wx4.random(list,2)
        for(var s in this.towerPos)
        {
            this.towerPos[s] = list.pop();
        }
        this.onChoosGun()
    }

    private onReset(){
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
            this.movePaths = TC.findPath(this.mapData)
            this.showArrow();
            this.saveLocal();
        }
    }


    private showGuideLightPos(x,y){
        var xx = x*64+32
        var yy = y*64+32
        var p = this.pkMap.localToGlobal(xx,yy);
        TowerManager.getInstance().showGuideMC(p)
    }

    public showHand(){
        var startP = this.pkMap.localToGlobal(this.startPos[0].x*64+32, this.startPos[0].y*64+32)
        var endP = this.pkMap.localToGlobal(this.endPos[0].x*64+32, this.endPos[0].y*64+32)
        var len = Math.abs(this.startPos[0].y - this.endPos[0].y+1)*64
        var guideData:any = {};
        guideData.mc = new egret.Rectangle(endP.x-32,endP.y-32,
            64*this.scale,len*this.scale);
        console.log(guideData.mc)
        guideData.text = '移动画出怪物行走区域';
        guideData.toBottom = 50;
        guideData.showFun = ()=>{
            GuideUI.getInstance().handMovePos({x:startP.x,y:startP.y},{x:endP.x,y:endP.y})
        };

        GuideUI.getInstance().show(guideData)

    }



    public onStartGame(){
        if(this.isGuiding)
        {
            GuideUI.getInstance().hide();
            this.isGuiding = false;
        }
        if(!this.movePaths)
            return;
        for(var i=0;i<this.movePaths.length;i++)
        {
            if(!this.movePaths[i])
            {
                MyWindow.ShowTips('出怪点被阻档了！',1000)
                var xy = this.startPos[i]
                this.showGuideLightPos(xy.x,xy.y);
                return;
            }
        }

        for(var s in this.towerPos)
        {
            if(!this.towerPos[s])
            {
                //this.towerPos[s] = 6//Math.ceil(Math.random()*50);
                MyWindow.ShowTips('还没放置塔器！',1000)

                var xy2 = s.split('_')
                this.showGuideLightPos(parseInt(xy2[0]),parseInt(xy2[1]));
                return;
            }
        }

        if(!PKManager.getInstance().getEnergy() && !this.isTest)
        {
            var share = !UM_wx4.isTest;
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
            MyWindow.Confirm('体力不足，可观看广告可增加 '+this.createHtml(5,0x00ff00)+' 点体力。',(type)=>{
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
        if(!this.isTest)
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
        PKTowerUI.getInstance().isTest = this.isTest;
        PKTowerUI.getInstance().show(data)

        if(!this.isTest)
        {
            this.hide();
            PKManager.getInstance().sendGameStart(this.data.id)
        }
    }


    private onTouch(e){

        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;
        this.touchPos = {
            x:x,
            y:y,
        }

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
        if(!this.stage)
            return;
        if(this.touchPos)
        {
            var itemSize = 64*this.scale;
            var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
            var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
            if(this.touchPos.x == x && this.touchPos.y == y && this.mapData[y][x] == 2)//点了塔
            {
                if(!this.towerPos[x + '_' +y])
                {
                    ChangeGunUI.getInstance().show(this.towerPos,x,y)
                }
                else
                {
                    var tower = this.pkMap.getTowerByPos(x,y);
                    if(tower.isLighting)
                    {
                        ChangeGunUI.getInstance().show(this.towerPos,x,y)
                    }
                    else
                    {
                        tower.showLight(this.pkMap)
                        if(UM_wx4.level < 10)
                            MyWindow.ShowTips('再次点击底座可更换塔器')
                    }
                }
            }
            this.touchPos = null;
        }

        if(this.isChange)
        {
            this.isChange = false;
            this.movePaths = TC.findPath(this.mapData)
            this.showArrow();
            if(this.isGuiding && this.movePaths[0])
            {
                this.once(egret.Event.ENTER_FRAME,()=>{
                    var guideData:any = {};
                    guideData.mc = this.startBtn
                    guideData.text = '点击开始游戏';
                    GuideUI.getInstance().show(guideData)
                },this)
            }
        }
    }

    public show(data?){
        this.data = data;

        PKManager.getInstance().initGunList(data.towerNum + 3);

        this.towerPos = {};
        this.pkMap.initMap(data.id)
        this.ww = data.width
        this.hh = data.height
        var arr1 = data.getRoadData();

        this.mapData = [];

        this.startPos = [];
        this.endPos = [];
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
                if(id == 5)
                {
                    this.startPos.push({x:j,y:i});
                }
                if(id == 6)
                {
                    this.endPos.push({x:j,y:i});
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
        this.pkMap.renewTower(this.towerPos,true);
        this.pkMap.sortY()
    }

    public onShow(){
        this.monsterGroup.visible = false;
        this.levetText.text = '第 '+this.data.id+' 关'
        this.pkMap.width = 64*this.ww
        this.pkMap.height = 64*this.hh
        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh)
        this.pkMap.scaleX = this.pkMap.scaleY = this.scale;


        this.addForceBtn.label = '战力+' + PKManager.getInstance().forceAdd*100 + '%'

        this.renewMap();

        this.movePaths = TC.findPath(this.mapData)


        this.isChange = false;

        this.showArrow();


        this.isGuiding = this.data.id == 1 && UM_wx4.level == 1
        if(this.isGuiding)
        {
            this.list.selectedIndex = 0;
            this.randomGun();
            this.onReset();
            this.once(egret.Event.ENTER_FRAME,this.showHand,this)
        }
    }

    public showArrow(){
        if(!this.movePaths)
            return
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

    public onChoosGun(){
        this.pkMap.renewTower(this.towerPos,true);
    }





}