class DrawMapUI extends game.BaseUI_wx4 {

    private static _instance: DrawMapUI;
    public static getInstance(): DrawMapUI {
        if(!this._instance)
            this._instance = new DrawMapUI();
        return this._instance;
    }

    private bg: eui.Image;
    private list: eui.List;
    private startBtn: eui.Button;
    private randomBtn: eui.Button;
    private addForceBtn: eui.Button;
    private resetBtn: eui.Button;
    private closeBtn: eui.Group;
    private monsterGroup: eui.Group;
    private monsterList: eui.List;
    private monsterBtn: eui.Group;
    private arrowMC: eui.Image;
    private levetText: eui.Label;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private helpBtn: eui.Group;








    public pkMap = new PKMap();
    public scale = 1;

    public heroItem = new HeroItem();
    public data;


    public mapData;
    public ww;
    public hh;

    public towerPos = {}
    public movePaths = []
    public startPos = []
    public endPos = []
    public isChange = false
    public showPath = false
    public touchPos

    public isGuiding = false


    public drogTowerItem = new TowerItem()
    public drogTowerKey = ''
    public constructor() {
        super();
        this.skinName = "DrawMapUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.drogTowerItem.scaleX = this.drogTowerItem.scaleY = 1.5

        this.addChildAt(this.pkMap,1);
        this.pkMap.horizontalCenter = 0
        this.pkMap.verticalCenter = -80
        this.pkMap.roleCon.addChild(this.heroItem);

        this.monsterList.itemRenderer = MonsterHeadItem
        this.monsterGroup.visible = true;
        this.addBtnEvent(this.monsterBtn,()=>{
            this.monsterGroup.visible = !this.monsterGroup.visible;
            this.renewMonsterList();

        })
        this.addBtnEvent(this.helpBtn,()=>{
           ShareTool.openGDTV(()=>{
               this.showPathTips();
               this.helpBtn.visible = false;
           })
        })

        this.list.itemRenderer = CreateMapItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([1,0])//1,

        this.pkMap.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this)
        this.pkMap.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this)
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this)

        this.addBtnEvent(this.closeBtn,()=>{
            if(TC.isTest == 3 || TC.isTest == 4)
            {
                MyWindow.Confirm('确定要放弃挑战吗？',(b)=>{
                    if(b==1)
                    {
                        this.hide();
                    }
                },['取消','确定']);
                return;
            }
            this.hide()
        })

        this.addBtnEvent(this.randomBtn,this.randomGun)

        this.addBtnEvent(this.addForceBtn,()=>{
            AddForceUI.getInstance().show()
        })

        this.addBtnEvent(this.resetBtn,this.onReset)
        this.addBtnEvent(this.startBtn,()=>{
            this.onStartGame();
        })

        this.addBtnEvent(this.leftBtn,()=>{
            this.gotoLevel(-1);
        })
        this.addBtnEvent(this.rightBtn,()=>{
            this.gotoLevel(1);
        })

    }

    public showPathTips(){
        var path = this.data.getRoadData(true);
        for(var i=0;i<this.hh;i++)
        {
            for(var j=0;j<this.ww;j++)
            {
                if(path[i][j] == 1)
                {
                    this.mapData[i][j] = 1;
                }
                else if(this.mapData[i][j] == 1)
                {
                    this.mapData[i][j] = 0;
                }
            }
        }

        this.renewMap();
        this.movePaths = TC.findPath(this.mapData)
        this.showArrow();
        this.saveLocal();
    }

    private renewMonsterList(){
        if(this.monsterGroup.visible)
        {
            this.arrowMC.scaleY = -1
            var arr = this.data.monsterArr;
            this.monsterList.dataProvider = new eui.ArrayCollection(arr)
            if(arr.length <= 6)
                this.monsterList.layout['requestedColumnCount'] = arr.length;
            else
                this.monsterList.layout['requestedColumnCount'] = Math.ceil(arr.length/2);
        }
        else
        {
            this.arrowMC.scaleY = 1
        }
    }

    private gotoLevel(add){
        var lv = this.data.id
        lv += add;
        var vo = LevelVO.getObject(lv)
        if(!vo)
            return;
        this.show(vo,this.showPath);
    }



    private randomGun(){
        var list = PKManager.getInstance().gunList.concat();
        if(TC.isTest)
        {
            list =  PKManager.getInstance().getTestGunList(this.data.id);
        }
        ArrayUtil_wx4.random(list,3);
        var okGun = [];
        var monsterList = this.data.monsterArr;
        for(var i=0;i<monsterList.length;i++)
        {
            var mid = monsterList[i] + ''
            for(var j=0;j<list.length;j++)
            {
                var gvo = GunVO.getObject(list[j])
                if(gvo.enemys.indexOf(mid) != -1)
                {
                    okGun.push(list[j]);
                    list.splice(j,1);
                    break;
                }
            }
        }

        ArrayUtil_wx4.random(okGun,2)
        ArrayUtil_wx4.random(list,2)
        var useGun = []
        for(var s in this.towerPos)
        {
            useGun.push(okGun.pop() || list.pop());
        }
        ArrayUtil_wx4.random(useGun,2)
        for(var s in this.towerPos)
        {
            this.towerPos[s] = useGun.pop() || list.pop();
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
                MyWindow.ShowTips('还没放置武器！',1000)

                var xy2 = s.split('_')
                this.showGuideLightPos(parseInt(xy2[0]),parseInt(xy2[1]));
                return;
            }
        }

        if(!PKManager.getInstance().getEnergy() && !TC.isTest)
        {
            var share = !UM_wx4.isTest;
            if(share)
            {
                MyWindow.Confirm('体力不足，分享到群可免去本次体力消耗。',(type)=>{
                    if(type == 1)
                    {
                        ShareTool.share('这个游戏掏空了我的体力！！！',Config.getShare(0),{},()=>{
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
                        PKManager.getInstance().addEnergy(5);
                    })
                }
            },['取消', '观看广告'])
            return;
        }
        this.startGame();
    }
    public startGame(){

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

        TC.initData(this.data);
        if(!TC.isTest)
        {
            PKManager.getInstance().forceAdd = 0;
            PKManager.getInstance().addEnergy(-1)
            this.hide();
            PKManager.getInstance().sendGameStart(this.data.id)
        }
        else
        {
            TC.monsterHPRate = this.data.getHpRate();
            TC.forceRate = 1 + (this.data.id-1)*0.25;
            if(TC.isTest == 3)
                this.hide();
        }

        PKTowerUI.getInstance().show(data)
    }


    private onTouchBegin(e){
        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;
        this.touchPos = {
            x:x,
            y:y,
            id:this.mapData[y][x],
            towerID:this.towerPos[x+'_' + y]
        }

        this.onTouchMove(e);
    }

    private onTouchMove(e){

        if(this.drogTowerItem.stage)
        {
            this.drogTowerItem.x = e.stageX
            this.drogTowerItem.y = e.stageY  - this.y  - 100
        }

        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;

        if(this.touchPos && this.touchPos.id == 2 && this.touchPos.towerID && !this.drogTowerItem.stage && !(this.touchPos.x == x && this.touchPos.y == y))
        {
            this.addChild(this.drogTowerItem)
            this.drogTowerItem.data = this.touchPos.towerID
            this.drogTowerItem.x = e.stageX
            this.drogTowerItem.y = e.stageY  - this.y  - 100
        }

        if(this.drogTowerItem.stage)
        {
            if((this.touchPos.x == x && this.touchPos.y == y) || this.mapData[y][x] != 2)
            {
                this.drogTowerItem.stop()
            }
            else
            {
                this.drogTowerItem.play()
            }
            return
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



    private onTouchEnd(e){
        if(!this.stage)
            return;

        if(this.drogTowerItem.stage && this.touchPos && this.touchPos.towerID)
        {
            var itemSize = 64*this.scale;
            var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
            var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
            var isXYError = y >= this.hh || y < 0 || x >= this.ww || x < 0
            if(!isXYError && this.mapData[y][x] == 2 && !(this.touchPos.x == x && this.touchPos.y == y))//换
            {
                var temp = this.towerPos[x + '_' + y];
                this.towerPos[x + '_' + y] = this.touchPos.towerID
                this.towerPos[this.touchPos.x + '_' + this.touchPos.y] = temp;
                this.onChoosGun();
            }
        }
        else if(this.touchPos)
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
                            MyWindow.ShowTips('再次点击底座可更换武器')
                    }
                }
            }
        }
        this.touchPos = null;
        MyTool.removeMC(this.drogTowerItem)

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

    private saveLocal(){
        if(TC.isTest == 2 || TC.isTest == 3 || TC.isTest == 4)
            return;
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
            data:arr,
            towerData:this.towerPos
        })
    }



    public show(data?,showPath?){
        this.data = data;

        PKManager.getInstance().initGunList(PKManager.getInstance().getGunNum(data.id,data.towerNum));

        this.showPath = showPath
        this.towerPos = {};
        this.pkMap.initMap(data.id)
        this.ww = data.width
        this.hh = data.height
        var arr1 = data.getRoadData(this.showPath);

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

        if(TC.isTest != 2 && TC.isTest != 3 && TC.isTest != 4)
        {
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
                var towerData = roundData.towerData;
                for(var s in this.towerPos)
                {
                    if(towerData[s])
                    {
                        this.towerPos[s] = towerData[s];
                    }
                }
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

    public renewForceAdd(){
        if(PKManager.getInstance().forceAdd)
            this.addForceBtn.label = '战力+' + Math.round(PKManager.getInstance().forceAdd*100) + '%';
        else
            this.addForceBtn.label = '增加战力'
    }

    public onShow(){
        TC.tempShowLevel = Math.max(UM_wx4.level,this.data.id);
        if(UM_wx4.level <=3)
            this.currentState = 's1'
        else if(UM_wx4.level <=6)
            this.currentState = 's2'
        else
            this.currentState = 's3'

        this.addForceBtn.visible = TC.isTest != 2 && TC.isTest != 3 && TC.isTest != 4;

        this.list.selectedIndex = 0;
        TC.currentVO = this.data;
        this.bg.source = UM_wx4.getBG()
        this.leftBtn.visible = this.rightBtn.visible = DEBUG || DebugUI.getInstance().debugOpen
        this.renewMonsterList();

        this.levetText.text = this.data.title || '第 '+this.data.id+' 关'

        this.pkMap.width = 64*this.ww
        this.pkMap.height = 64*this.hh
        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh)
        this.pkMap.scaleX = this.pkMap.scaleY = this.scale;


        this.heroItem.data = _get['hero'] || PKManager.getInstance().heroid
        this.heroItem.x = this.data.heroPos.x*64+32
        this.heroItem.y = this.data.heroPos.y*64+32 + 20
        this.heroItem.standMV()

        this.renewForceAdd();

        this.renewMap();

        this.movePaths = TC.findPath(this.mapData)


        this.isChange = false;
        this.helpBtn.visible = !TC.isTest

        this.showArrow();


        this.isGuiding = this.data.id == 1 && UM_wx4.level == 1 && !UM_wx4.pkMap
        if(this.isGuiding)
        {
            this.list.selectedIndex = 0;
            this.randomGun();
            this.onReset();

            HelpUI.getInstance().show(1,()=>{
                this.showHand();
            })

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
        this.saveLocal();
    }



    public findTower(){
        var testTime = TC.findType==1?200:300;
        if(TC.findTowerTimes > testTime)
        {
            TC.findTower = false;
            //console.log('no find!')
            console.log('currentLevel:' + this.data.id + '    currentHard:' + this.data.hard)
            if(this.data.hard == 0 && TC.findType == 1)
            {
                this.data.hard = -(this.data.id -1)
                var vo = this.data;
            }
            else
            {
                CreateMapManager.getInstance().save();
                SharedObjectManager_wx4.getInstance().setMyValue('lastTestMap',this.data.id)
                var vo = TC.findList.shift();
            }

            if(vo)
            {
                TC.findTowerTimes = 0;
                TC.findTower = true;
                this.show(vo,true)
                this.findTower();
            }
            else
            {
                console.log('finish')
            }
            return;
        }
        this.randomGun();
        this.startGame();
        TC.findTowerTimes ++;
        console.log(this.data.id + ' finding')
    }


}