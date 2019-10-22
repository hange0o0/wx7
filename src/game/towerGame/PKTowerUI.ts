class PKTowerUI extends game.BaseUI_wx4 {

    public static _instance: PKTowerUI;
    public static getInstance(): PKTowerUI {
        if(!this._instance)
            this._instance = new PKTowerUI();
        return this._instance;
    }

    private bg: eui.Image;
    public list: eui.List;
    private barMC: eui.Image;
    private levetText: eui.Label;
    private closeBtn: eui.Image;
    private skillInfoGroup: eui.Group;
    private skillInfoItem: PKSkillItem;
    private desText: eui.Label;
    private skillNameText: eui.Label;
    private skillCDText: eui.Label;
    private addSpeedBtn: eui.Image;










    public heroItem = new HeroItem();



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


    public chooseSkill = null;
    public constructor() {
        super();
        this.skinName = "PKTowerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();



        this.addChildAt(this.pkMap,1);
        this.pkMap.horizontalCenter = 0
        this.pkMap.verticalCenter = -80

        this.pkMap.roleCon.addChild(this.heroItem);


        this.list.itemRenderer = PKSkillItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([1,2,3,4,5])//1,
        this.skillInfoGroup.touchChildren = this.skillInfoGroup.touchEnabled = false;

        this.addBtnEvent(this.closeBtn,()=>{
            if(TC.isTest == 1)
                this.hide();
            else
            {
                StopUI.getInstance().show();
            }
        })

        this.addBtnEvent(this,(e)=>{
            if(e.stageY < GameManager_wx4.uiHeight - 260)
            {
                if(this.chooseSkill)
                    this.hideSkillInfo();
            }
        })

        this.addBtnEvent(this.pkMap,this.onMap)
        this.addBtnEvent(this.addSpeedBtn,()=>{
            if(!UM_wx4.shareUser[0] && !DEBUG && !TC.isTest)
            {
                ShareUnlockUI.getInstance().show(0,'解锁加速功能','只需邀请一个好友新加入游戏，即可'+this.createHtml('永久解锁',0xFFFF00)+'加速功能！','addSpeed');
                return;
            }

            TC.isSpeed = !TC.isSpeed
            this.renewSpeedBtn();
        })
    }

    private renewSpeedBtn(){
        this.addSpeedBtn.source = TC.isSpeed?'add_speed_btn2_png':'add_speed_btn_png'
        this.heroItem.setSpeed(TC.isSpeed?2:1)
    }

    private onMap(e){
        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;

        if(this.mapData[y][x] == 2 && this.towerPos[x+'_'+y])
        {
            var tower = this.pkMap.getTowerByPos(x,y);
            if(tower.isLighting)
            {
                GunInfoUI.getInstance().show(tower)
            }
            else
            {
                tower.showLight(this.pkMap)
                if(UM_wx4.level < 10)
                    MyWindow.ShowTips('再次点击底座可查看详情')
            }
            return;1
        }

        if(this.mapData[y][x] == 1 || this.mapData[y][x] == 4  || this.mapData[y][x] == 7)
        {
            var x2 = Math.floor(this.heroItem.x/64)
            var y2 = Math.floor(this.heroItem.y/64)
            var path = TC.astar.find(x2, y2, x, y)
            if(path)
            {
                path.shift();
                this.heroItem.setPath(path);
            }
        }
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
        SoundManager.getInstance().playSound('main_bg')
    }

    private renewMap(){
        this.pkMap.draw(this.mapData);
        this.pkMap.renewTower(this.towerPos);
    }

    public onShow(){

        if(!UM_wx4.shareUser[0] && TC.isSpeed && TC.isTest != 1)
        {
            TC.isSpeed = false
        }

        this.bg.source = UM_wx4.getBG()
        SoundManager.getInstance().playSound('pk_bg')
        this.renewSpeedBtn();

        while(this.monsterArr.length)
        {
            PKMonsterItem.freeItem(this.monsterArr.pop())
        }
        while(this.bulletArr.length)
        {
            PKBulletItem.freeItem(this.bulletArr.pop())
        }

        this.levetText.text = this.data.title || '第 '+this.data.id+' 关'
        this.chooseSkill = null;
        this.pkMap.width = 64*this.ww
        this.pkMap.height = 64*this.hh

        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh)
        this.pkMap.scaleX = this.pkMap.scaleY = this.scale;

        this.renewMap();

        this.heroItem.data = _get['hero'] || PKManager.getInstance().heroid
        this.heroItem.x = this.data.heroPos.x*64+32
        this.heroItem.y = this.data.heroPos.y*64+32  + 20
        this.heroItem.standMV()


        this.hideSkillInfo();
        MyTool.renewList(this.list);

        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.barMC.width = 640-2

        if(this.data.id == 1 && UM_wx4.level == 1)
        {
            HelpUI.getInstance().show(2)
        }


    }

    public onFail(){
        if(TC.isStop)
            return;
        if(UM_wx4.level == 1)
            return;
        if(TC.wudiEnd > TC.actionStep)
            return;
        TC.isStop = true;
        if(TC.rebornTime || TC.isTest)//复活过
        {
            ResultUI.getInstance().show(false);
        }
        else
        {
            RebornUI.getInstance().show();
        }

    }

    public onReborn(){
        TC.isStop = false;
        //显示无敌
        this.pkMap.showWUDI();
        SoundManager.getInstance().playEffect('reborn')
    }

    private onE(){

        if(ZijieScreenBtn.e && !TC.isTest && !TC.isStop && TC.maxStep - TC.actionStep < 900)
        {
            ZijieScreenBtn.e.start();
        }
        var runTime = TC.isSpeed?TC.speedNum:1
        while(runTime >0)
        {
            if(TC.isStop)
                return;
            this.onStep();
            runTime --;
        }

        MyTool.runListFun(this.list,'onE');
        this.pkMap.sortY();
        if(TC.wudiEnd &&  TC.wudiEnd < TC.actionStep)//移除无敌显示
        {
            TC.wudiEnd = 0;
            this.pkMap.hideWUDI();
        }
        if(this.monsterArr.length == 0 && TC.roundAutoMonster.length == 0 && TC.totalAutoMonster.length == 0)//过关了
        {
            ResultUI.getInstance().show(true);
        }
        this.barMC.width = (640-2)*(TC.actionStep/TC.maxStep);
    }

    private onStep(){

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


        this.heroItem.onE()

    }

    public addMonster(mid,roadIndex = 0){
        var path = this.movePaths[roadIndex].concat();
        if(!path && !DEBUG)
        {
            path = this.movePaths[0].concat();
            if(!path)
                return;
        }
        var newItem = PKMonsterItem.createItem();
        this.monsterArr.push(newItem);
        this.pkMap.roleCon.addChild(newItem);
        newItem.data = mid;
        newItem.setPath(path);

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


    public showSkillInfo(sid){
        if(sid == this.chooseSkill)
        {
            if(TC.getSkillCD(sid))
            {
                MyWindow.ShowTips('技能冷却中')
                return;
            }
            switch(sid)
            {
                case 1:
                    this.skill1();
                    break;
                case 2:
                    this.skill2();
                    break;
                case 3:
                    this.skill3();
                    break;
                case 4:
                    this.skill4();
                    break;
                case 5:
                    this.skill5();
                    break;
            }
            TC.onSkillUse(sid)
            this.hideSkillInfo()
            return;
        }

        this.chooseSkill = sid
        this.skillInfoGroup.visible = true;
        this.skillInfoItem.data = sid;
        var svo = TC.skillBase[sid];

        this.skillNameText.text = svo.name
        this.setHtml(this.skillCDText,'技能CD: ' + this.createHtml(svo.cd + '秒',0xFFFF00))


        var v2 = this.createHtml(svo.value2,0xFFFF00)
        if(sid == 5)
            var v1 = this.createHtml(Math.ceil(svo.value1*TC.forceRate),0xFFFF00)
        else
            var v1 = this.createHtml(svo.value1,0xFFFF00)
        this.setHtml(this.desText, svo.des.replace('#1',v1).replace('#2',v2))
        this.renewSelectSkill();
    }

    public hideSkillInfo(){
        this.chooseSkill = null
        this.skillInfoGroup.visible = false;
        this.renewSelectSkill();
    }

    private renewSelectSkill(){
        for(var i=0;i<this.list.numChildren;i++)
        {
            var item:any = this.list.getChildAt(i)
            item.setSelect(this.chooseSkill)
        }
    }

    private skill1(){
        var svo = TC.skillBase[1];
        var gunArr = this.pkMap.gunArr;
        var len = gunArr.length;
        for(var i=0;i<len;i++)
        {
            var gItem = gunArr[i];
            gItem.addAtk(PKTool.getStepByTime(svo.value2*1000),svo.value1)
        }
    }

    private skill2(){
        var svo = TC.skillBase[2];
        var gunArr = this.pkMap.gunArr;
        var len = gunArr.length;
        for(var i=0;i<len;i++)
        {
            var gItem = gunArr[i];
            gItem.addSpeed(PKTool.getStepByTime(svo.value2*1000),svo.value1)
        }
    }

    private skill3(){
        var svo = TC.skillBase[3];
        var monsterArr = this.monsterArr;
        var len = monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem = monsterArr[i];
            if(mItem.isDie)
                continue;
            mItem.setYun(PKTool.getStepByTime(svo.value1*1000))
        }
    }

    private skill4(){
        var svo = TC.skillBase[4];
        var monsterArr = this.monsterArr;
        var len = monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem = monsterArr[i];
            if(mItem.isDie)
                continue;
            mItem.setIce(PKTool.getStepByTime(svo.value2*1000),1-svo.value1/100)
        }
    }

    private skill5(){
        var svo = TC.skillBase[5];
        var monsterArr = this.monsterArr;
        var len = monsterArr.length;
        var hurt = -Math.ceil(svo.value1*TC.forceRate)
        var b = false
        for(var i=0;i<len;i++)
        {
            var mItem = monsterArr[i];
            if(mItem.isDie)
                continue;
            b = true;
            mItem.addHp(hurt);
            var mv = PKTool.playMV({
                mvType:1,
                num:3,
                key:'monster1_mv',
                type:'in',
                anX:91/2,
                anY:208*0.8,
                item:mItem,
                once:true,
                xy:{x:50-10,y:300}
            })
        }

        if(b)
            SoundManager.getInstance().playEffect('thurder')
    }

}