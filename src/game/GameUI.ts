class GameUI extends game.BaseUI_wx4 {

    private static _instance: GameUI;
    public static getInstance(): GameUI {
        if(!this._instance)
            this._instance = new GameUI();
        return this._instance;
    }


    private bg: eui.Image;
    private helpBtn: eui.Group;
    private mapCon: eui.Group;
    private leftBtn: eui.Group;
    private rightBtn: eui.Group;
    private coinText: eui.Label;
    private energyText: eui.Label;
    private soundBtn: eui.Image;
    private rankBtn: eui.Image;
    private feedBackBtn: eui.Image;
    private ad1: eui.Image;
    private ad2: eui.Image;
    private skillBtn: eui.Group;
    private skillRedMC: eui.Image;
    private levelBtn: eui.Group;
    private levelRedMC: eui.Image;
    private editBtn: eui.Group;
    private equipRedMC: eui.Image;
    private levelText: eui.Label;
    private needEnergyGroup: eui.Group;
    private needEnergyText: eui.Label;
    private btnGroup: eui.Group;
    private startBtn: eui.Image;
    private swapBtn: eui.Button;





    public pkMap = new PKMap();
    public pkMap2 = new PKMap();
    public currentLevel
    public tempLevel



    private dragPos
    public constructor() {
        super();
        this.skinName = "GameUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.mapCon.addChild(this.pkMap);
        this.pkMap.horizontalCenter = 0
        this.pkMap.verticalCenter = 0;
        //this.pkMap.cacheAsBitmap = true;


        this.mapCon.addChild(this.pkMap2);
        this.pkMap2.horizontalCenter = -640
        this.pkMap2.verticalCenter = 0
        //this.pkMap2.cacheAsBitmap = true;


        this.addBtnEvent(this.feedBackBtn,()=>{
           FeedBackUI.getInstance().show();
        })
        this.addBtnEvent(this.ad1,()=>{
           MyADManager.getInstance().showAD(this.ad1['adData'])
        })
        this.addBtnEvent(this.ad2,()=>{
           MyADManager.getInstance().showAD(this.ad2['adData'])
        })

        this.addBtnEvent(this.helpBtn,()=>{
            HelpUI.getInstance().show()
        })


        this.addBtnEvent(this.swapBtn,()=>{
            var energy = PKManager.getInstance().getEnergy()
            if(!energy)
            {
                MyWindow.ShowTips('没有体力，无法进行扫荡')
                return;
            }
            var coin = PKManager.getInstance().getWinCoin(UM_wx4.level - 1) * energy
            MyWindow.Confirm('确定花光 '+this.createHtml(energy,0x00ff00)+' 体力进行扫荡？\n本次扫荡可获得 '+
                this.createHtml(NumberUtil_wx4.addNumSeparator(coin,2),0xffff00)+' 金币',(b)=>{
                if(b==1)
                {
                    MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(coin,2),0xFFFF00),1000)
                    UM_wx4.addCoin(coin)
                    PKManager.getInstance().addEnergy(-energy)
                }
            },['取消','扫荡']);
        })
        this.addBtnEvent(this.editBtn,()=>{
            MyWindow.Alert('自定义地图玩法即将开启！')
        })

        this.addBtnEvent(this.skillBtn,()=>{
            SkillListUI.getInstance().show()
        })

        this.addBtnEvent(this.levelBtn,()=>{
            PlayerUpUI.getInstance().show();
        })

        this.addBtnEvent(this.rankBtn,()=>{
            RankUI.getInstance().show();
        })


        this.addBtnEvent(this.startBtn,()=>{
            var vo = LevelVO.getObject(this.currentLevel);
            if(!vo)
            {
                MyWindow.Alert('新的关卡即将开启，请耐心等侯')
                return;
            }
            DrawMapUI.getInstance().isTest = false
            DrawMapUI.getInstance().show(vo);

        })


        this.addBtnEvent(this.leftBtn,()=>{
            egret.Tween.removeTweens(this.pkMap)
            egret.Tween.get(this.pkMap,{onChange:this.onScroll,onChangeObj:this}).
                to({horizontalCenter:640},(640-Math.abs(this.pkMap.horizontalCenter))*0.5).call(this.onScrollEnd,this)
        })

        this.addBtnEvent(this.rightBtn,()=>{
            egret.Tween.removeTweens(this.pkMap)
            egret.Tween.get(this.pkMap,{onChange:this.onScroll,onChangeObj:this}).
                to({horizontalCenter:-640},(640-Math.abs(this.pkMap.horizontalCenter))*0.5).call(this.onScrollEnd,this)
        })




        this.addBtnEvent(this.soundBtn,()=>{
            SoundManager.getInstance().soundPlaying = !SoundManager.getInstance().soundPlaying
            SoundManager.getInstance().bgPlaying = !SoundManager.getInstance().bgPlaying
            //if(SoundManager.getInstance().bgPlaying)
            //    SoundManager.getInstance().playSound('bg')
            //else
            //    SoundManager.getInstance().stopBgSound()
            this.renewSound();
        },this,true)


        MyTool.addLongTouch(this.energyText,()=>{
            DebugUI.getInstance().debugTimer = egret.getTimer()
            MyWindow.ShowTips('体力很重要')
        },this)

        MyTool.addLongTouch(this.coinText,()=>{
            if(egret.getTimer() - DebugUI.getInstance().debugTimer < 1500)
            {
                MyWindow.ShowTips('你作弊！')
                DebugUI.getInstance().debugOpen = true
            }
        },this)

        MyTool.addLongTouch(this.soundBtn,()=>{
            if(DEBUG)
            {
                DebugUI.getInstance().show();
                return;
            }
            if(DebugUI.getInstance().debugOpen && !SoundManager.getInstance().soundPlaying)
            {
                DebugUI.getInstance().show();
            }
        },this)


        this.mapCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEnd,this)

        this.skillRedMC.visible = false;
    }

    private onBegin(e){
        egret.Tween.removeTweens(this.pkMap)
        if(!this.dragPos)
        {
            this.dragPos = {
                x:e.stageX,
                y:e.stageY,
                horizontalCenter:this.pkMap.horizontalCenter
            }
        }
    }

    private onMove(e){
        if(!this.dragPos)
            return

        this.pkMap.horizontalCenter = this.dragPos.horizontalCenter +(e.stageX - this.dragPos.x);
        this.onScroll();
    }

    private onEnd(e){
        if(!this.dragPos)
            return
        this.dragPos = null;
        egret.Tween.removeTweens(this.pkMap)
        if(this.pkMap.horizontalCenter > 120 && this.currentLevel > 1)
        {
            egret.Tween.get(this.pkMap,{onChange:this.onScroll,onChangeObj:this}).
                to({horizontalCenter:640},(640-Math.abs(this.pkMap.horizontalCenter))*0.5).call(this.onScrollEnd,this)
        }
        else if(this.pkMap.horizontalCenter < -120  && this.currentLevel < UM_wx4.level)
        {
            egret.Tween.get(this.pkMap,{onChange:this.onScroll,onChangeObj:this}).
                to({horizontalCenter:-640},(640-Math.abs(this.pkMap.horizontalCenter))*0.5).call(this.onScrollEnd,this)
        }
        else
        {
            egret.Tween.get(this.pkMap,{onChange:this.onScroll,onChangeObj:this}).
                to({horizontalCenter:0},(Math.abs(this.pkMap.horizontalCenter))*0.5)
        }
    }


    private renewNeedEnergy(){
        //var PKM = PKManager.getInstance();
        //if(PKM.lastChooseData.length == 0)
        //{
        //    var enery = PKM.getEnergyCost(level);
            this.needEnergyText.text = '-' + 1 + '';
            this.needEnergyGroup.visible = true
        //}
        //else
        //{
        //    this.needEnergyGroup.visible = false
        //}
    }

    private renewSound(){
        this.soundBtn.source = SoundManager.getInstance().bgPlaying?'sound_btn1_png':'sound_btn2_png'
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        if(_get['level'])
            UM_wx4.level = parseInt(_get['level']);
        SoundManager.getInstance().playSound('main_bg')

        this.currentLevel = UM_wx4.level;
        if(!LevelVO.getObject(UM_wx4.level + 1))
            TowerManager.getInstance().getServerData();


        this.tempLevel = -1;
        this.pkMap.horizontalCenter = 0
        this.renewSound();
        this.renewCoin();
        this.renewEnergy();
        this.renewLevel()
        this.renewLevel2()
        this.renewBtn()
        this.renewNeedEnergy();
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewCoin)
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.LOAD_SERVER_DATA,this.onLoadServerData)

        //if(UM_wx4.pastDayCoin.coin)
        //{
        //    PassDayAwardUI.getInstance().show();
        //}
        this.showTips();




        //var map = new Map();
        //map.initMap(1)
        //map.draw([
        //    [0,0,1,0,0,0,0],
        //    [0,0,1,0,2,0,0],
        //    [0,0,1,0,2,0,0],
        //    [0,0,1,1,1,1,0],
        //    [0,0,0,0,0,1,0],
        //    [2,2,2,2,2,1,0],
        //    [0,0,0,0,0,1,1],
        //    [0,0,0,0,0,0,1],
        //    [0,0,0,0,1,1,1],
        //
        //
        //]);
        //map.draw([
        //    [0,0,1,0,0,0,0,0,0,0],
        //    [0,0,1,0,2,0,0,0,0,0],
        //    [0,0,1,0,2,0,0,0,0,0],
        //    [0,0,1,1,1,1,0,0,0,0],
        //    [0,0,0,0,0,1,0,0,0,0],
        //    [2,2,2,2,2,1,0,0,2,0],
        //    [0,0,0,0,0,1,1,0,2,0],
        //    [0,0,0,0,0,0,1,0,0,0],
        //    [0,0,0,0,1,1,1,0,0,0],
        //    [1,1,1,1,1,1,0,0,0,0],
        //    [1,0,0,3,0,0,0,0,0,0],
        //    [1,0,0,3,0,2,0,0,0,0],
        //    [1,0,0,0,0,2,0,0,0,0],
        //    [1,0,0,0,0,0,0,0,0,0],
        //    [1,0,0,0,4,4,0,0,0,0],
        //
        //]);

        //this.addChild(map)
        //map.x = (640 - 64*7)/2
        //map.y = (GameManager_wx4.uiHeight - 64*9)/2
        this.onLevelChange(false);

    }

    public onLoadServerData(){
        this.tempLevel = -1;
        this.renewLevel()
        this.renewLevel2()
    }

    public onLevelChange(newLevel){
        if(UM_wx4.level > 10)
            this.btnGroup.addChild(this.swapBtn)
        else
            MyTool.removeMC(this.swapBtn)

        if(newLevel)
        {
            this.currentLevel = UM_wx4.level;
            this.renewLevel()
            this.renewLevel2()
            this.renewBtn();
            UnlockUI.getInstance().show(UM_wx4.level)


        }
    }


    private onTimer(){
        if(!this.visible)
            return
        this.renewEnergy();
    }

    private renewEnergy(){
        var PKM = PKManager.getInstance()
        var energy = PKM.getEnergy();
        if(energy == 0)
        {
            this.energyText.text = DateUtil_wx4.getStringBySecond(PKM.getNextEnergyCD()).substr(-5)
            this.energyText.textColor = 0xFF0000
        }
        else
        {
            this.energyText.text = energy + '/' + PKM.maxEnergy
            this.energyText.textColor = 0xFCD766
        }
    }

    private showTips(){
        this.bg.source = UM_wx4.getBG()

        var adArr = MyADManager.getInstance().getListByNum(10);
        var ad = ArrayUtil_wx4.randomOne(adArr,true);
        if(ad)
        {
            this.ad1['adData'] = ad;
            this.ad1.source = ad.logo
            this.ad1.visible = true;
        }
        else
        {
            this.ad1.visible = false;
        }


        var ad = ArrayUtil_wx4.randomOne(adArr,true);
        if(ad)
        {
            this.ad2['adData'] = ad;
            this.ad2.source = ad.logo
            this.ad2.visible = true;
        }
        else
        {
            this.ad2.visible = false;
        }

    }

    private onE(){
        if(!this.visible)
            return


        //if(PKC.isStop)
        //    return;
        //var ui = PKCodeUI.getInstance();
        //var playerData = PKC.playerData;
        //var monster = PKC.monsterList[0]
        //playerData.hp = playerData.maxHp;
        //
        //if(monster && !monster.isDie)
        //{
        //    var len = MyTool.getDis(monster,playerData);
        //
        //    if(len > playerData.atkDis -10)
        //    {
        //        ui.playerItem.move({
        //            x1:playerData.x,
        //            y1:playerData.y,
        //            x2:monster.x,
        //            y2:monster.y,
        //        })
        //        this.moveState = 1
        //        if(playerData.skillsList.length && Math.random() < 0.01)//用技能
        //        {
        //            playerData.useSkill(ArrayUtil_wx4.randomOne(playerData.skillsList).sid)
        //        }
        //    }
        //    else if(this.moveState == -1 || len < 40 + (playerData.atkDis-40)/3)
        //    {
        //        ui.playerItem.move({
        //            x2:playerData.x,
        //            y2:playerData.y,
        //            x1:monster.x,
        //            y1:monster.y,
        //        })
        //
        //        if(len > 40 + (playerData.atkDis-40)/3*2)
        //            this.moveState = 0;
        //        else
        //            this.moveState = -1
        //    }
        //    else
        //    {
        //        this.moveState = 0
        //    }
        //
        //
        //}
        //
        //ui.onE();
        //ui.renewConY(true);
    }

    private onScroll(){
        this.renewLevel2();
        if(this.pkMap.horizontalCenter > 0)
            this.pkMap2.horizontalCenter = this.pkMap.horizontalCenter - 640
        else
            this.pkMap2.horizontalCenter = this.pkMap.horizontalCenter + 640
    }

    private onScrollEnd(){
        var level = this.currentLevel
        if(this.pkMap.horizontalCenter > 320)
        {
            level --;
            if(level <= 0)
                level = 1;
        }
        else if(this.pkMap.horizontalCenter < -320)
        {
            level ++;
            if(level > UM_wx4.level)
                level = UM_wx4.level;
        }
        if(level == this.currentLevel)
        {
            egret.Tween.removeTweens(this.pkMap)
            egret.Tween.get(this.pkMap,{onChange:this.onScroll,onChangeObj:this}).
                to({horizontalCenter:0},Math.abs(this.pkMap.horizontalCenter)*0.5)
        }
        else
        {
            this.currentLevel = level;
            this.tempLevel = -1;
            this.renewLevel();
            this.pkMap.horizontalCenter = 0;
            this.renewLevel2();
            this.renewBtn()
        }
    }

    private renewBtn(){
        this.leftBtn.visible = this.currentLevel > 1
        this.rightBtn.visible = this.currentLevel < UM_wx4.level
    }

    public renewLevel(){
        var level = this.currentLevel
        var vo = LevelVO.getObject(level);
        if(!vo)
            vo = TowerManager.getInstance().emptyLevelVO
        this.pkMap.width = 64*vo.width
        this.pkMap.height = 64*vo.height
        this.levelText.text = '第 '+level+' 关'
        this.pkMap.initMap(level)
        this.pkMap.draw(vo.getRoadData(),true);
        this.pkMap.sortY();

        this.pkMap.scaleX = this.pkMap.scaleY = 0.6*TowerManager.getInstance().getScale(vo.width,vo.height)
    }

    public renewLevel2(){
        if(Math.abs(this.pkMap.horizontalCenter) < 20)
        {
            this.pkMap2.visible = false
            return;
        }
        var level = this.pkMap.horizontalCenter > 0?this.currentLevel-1:this.currentLevel+1
        if(level > UM_wx4.level || level <= 0)
        {
            this.pkMap2.visible = false
            return;
        }
        this.pkMap2.visible = true
        if(this.tempLevel != level)
        {
            this.tempLevel = level
            var vo = LevelVO.getObject(level);
            if(!vo)
                vo = TowerManager.getInstance().emptyLevelVO
            this.pkMap2.width = 64*vo.width
            this.pkMap2.height = 64*vo.height
            this.pkMap2.initMap(level)
            this.pkMap2.draw(vo.getRoadData(),true);
            this.pkMap.sortY();
            this.pkMap2.scaleX = this.pkMap2.scaleY = 0.6*TowerManager.getInstance().getScale(vo.width,vo.height)
        }
    }


    public onVisibleChange(){
        if(this.visible)
        {
            this.showTips();
            this.renewEnergy();
            //if(this.currentLevel == UM_wx4.level - 1)
            //{
            //    this.currentLevel = UM_wx4.level;
            //    this.renewLevel();
            //    this.renewBtn();
            //}
            //this.renewNeedEnergy();
            //if(UM_wx4.pastDayCoin.coin)
            //{
            //    PassDayAwardUI.getInstance().show();
            //}
            //
            //this.addChildAt(PKCodeUI.getInstance(),0)
            //PKC.isAuto = true;
            //PKCodeUI.getInstance().onShow()
            //PKC.playerData.randomSKill();
        }
    }

    private renewCoin(){
        this.coinText.text = NumberUtil_wx4.addNumSeparator(UM_wx4.coin);
        this.renewRed();
    }


    private renewRed(){
        this.equipRedMC.visible = false;//GunManager.getInstance().myGun.length < GunManager.getInstance().getUnlockNum();
        this.levelRedMC.visible = UM_wx4.coin >= PKManager.getInstance().getUpCost()
    }
}