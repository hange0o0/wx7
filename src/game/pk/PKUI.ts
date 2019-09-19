class PKUI extends game.BaseUI_wx4{
    private static _instance:PKUI;
    public static getInstance():PKUI {
        if (!this._instance)
            this._instance = new PKUI();
        return this._instance;
    }


    private s1: PKSkillItem;
    private s2: PKSkillItem;
    private s3: PKSkillItem;
    private s4: PKSkillItem;
    private s5: PKSkillItem;
    private s6: PKSkillItem;
    private ctrlGroup: eui.Group;
    private ctrlBG: eui.Image;
    private ctrlMC: eui.Image;
    private skillInfoGroup: eui.Group;
    private skillInfoItem: PKSkillItem;
    private desText: eui.Label;
    private skillNameText: eui.Label;
    private skillCDText: eui.Label;
    private hpBar: eui.Image;
    private hpText: eui.BitmapLabel;
    private monsterText: eui.Label;
    private rateBar: eui.Image;
    private stopBtn: eui.Image;








    public touchID
    public skillArr = [];
    public middleR = 180

    public redArr = [];
    public showSkillTouchID;
    public showSkillItem;
    public lastShowTips = 0;

    public chooseSkill;//玩家先择要释放的技能

    public constructor() {
        super();
        this.skinName = "PKUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        for(var i=0;i<10;i++)
        {
            var mc = new eui.Image('common_redpoint_01_png')
            mc.anchorOffsetX = mc.anchorOffsetY = 32/2
            mc.width = mc.height = 32
            this.redArr.push(mc)
            this.addChildAt(mc,0)
        }


        for(var i=1;i<=6;i++)
        {
            this.skillArr.push(this['s' + i])
        }
        this.addBtnEvent(this.skillInfoGroup,this.hideSkillInfo)


        this.ctrlGroup.touchEnabled = true
        this.ctrlGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);

        //this.addBtnEvent(this.monsterText,()=>{
        //    PKCodeUI.getInstance().onShow();
        //    this.renewSkill()
        //    this.renewHp()
        //    this.onTimer()
        //})

        this.addBtnEvent(this.stopBtn,()=>{
            StopUI.getInstance().show();
        })

        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onSkillMove,this)
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onSkillEnd,this)
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onSkillEnd,this)
    }

    private onSkillMove(e){
        if(e.touchPointID != this.showSkillTouchID)
            return;
        if(this.showSkillItem && this.skillInfoGroup.visible && !this.showSkillItem.hitTestPoint(e.stageX,e.stageY))
        {
            this.hideSkillInfo()
        }
    }

    private onSkillEnd(e){
        if(e.touchPointID != this.showSkillTouchID)
            return;
        this.showSkillItem = null;
        this.hideSkillInfo()
    }


    private onTouchBegin(e: egret.TouchEvent) {
        if (!this.touchID) {
            var p = this.ctrlGroup.localToGlobal(this.middleR,this.middleR)
            this.touchID = {
                id: e.touchPointID,
                x1: p.x,
                y1: p.y,
                x2: e.stageX,
                y2: e.stageY,
            }
            this.resetTouchingShow();
        }
    }

    private onTouchMove(e) {
        if (this.touchID && e.touchPointID == this.touchID.id) {
            this.touchID.x2 = e.stageX
            this.touchID.y2 = e.stageY
            this.resetTouchingShow();
        }
    }

    private resetTouchingShow(){
        var touchR = this.middleR;
        var r = MyTool.getDistance(this.touchID.x1, this.touchID.y1 ,this.touchID.x2, this.touchID.y2)
        if (r > 75)
            r = 75;
        var angle = Math.atan2(this.touchID.y2 - this.touchID.y1, this.touchID.x2 - this.touchID.x1)
        this.ctrlMC.x = Math.cos(angle) * r + touchR
        this.ctrlMC.y = Math.sin(angle) * r + touchR
        this.ctrlBG.rotation = angle/Math.PI*180+90
    }

    public onTouchEnd(e?) {
        if (!e || (this.touchID && e.touchPointID == this.touchID.id)) {
            this.touchID = null;
            this.resetTouchGroup();
        }
    }

    private resetTouchGroup() {
        var touchR = this.middleR
        this.ctrlMC.x = touchR
        this.ctrlMC.y = touchR
    }

    public hide(){
        super.hide();
        PKC.isPKing = false;
    }


    public onShow(){
        this.chooseSkill = null;
        PKC.isPKing = true;
        this.resetTouchGroup()
        this.height = GameManager_wx4.uiHeight
        this.addChildAt(PKCodeUI.getInstance(),0)
        PKC.isAuto = false;
        PKCodeUI.getInstance().onShow();


        this.renewSkill()
        this.renewHp()
        this.renewCtrl()
        this.onTimer()
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.HP_CHANGE,this.renewHp)
        this.addPanelOpenEvent(GameEvent.client.SKILL_USE,this.renewSkillCD)

        if(UM_wx4.level == 1)
            HelpUI.getInstance().show();
    }

    private renewSkill(){
        for(var i=0;i<this.skillArr.length;i++)
        {
            this.skillArr[i].data = PKC.playerData.skillsList[i]
        }
        this.hideSkillInfo();
    }

    public showSkillInfo(item,showSkillTouchID){
        var data = item.data;
        this.showSkillTouchID = showSkillTouchID
        this.showSkillItem = item


        if(data.isActive)
            this.chooseSkill = data;
        else
            this.chooseSkill = null;

        this.renewChooseSkill();
        this.renewSkillInfo(data);
        //for(var i=0;i<this.skillArr.length;i++)
        //{
        //    this.skillArr[i].setSelect(data)
        //}
    }

    private renewSkillInfo(data){
        this.skillInfoGroup.visible = true;
        this.skillInfoItem.data = data;
        var svo = data.getVO();

        this.skillNameText.text = svo.name
        var cd = svo.getCD();
        if(cd)
            this.setHtml(this.skillCDText,'技能间隔:' + this.createHtml(MyTool.toFixed(cd/1000,1) + '秒',0xFFFF00))
        else
            this.setHtml(this.skillCDText,this.createHtml('被动技能',0xECAEF9))
        this.setHtml(this.desText, svo.getDes())

    }

    public hideSkillInfo(){
        this.skillInfoGroup.visible = false;
        if(this.chooseSkill)
        {
            this.renewSkillInfo(this.chooseSkill);
        }
    }

    public renewChooseSkill(){
        for(var i=0;i<this.skillArr.length;i++)
        {
            this.skillArr[i].setSelect(this.chooseSkill)
        }
        if(this.chooseSkill)
            this.renewSkillInfo(this.chooseSkill);
    }

    public onE(){
        if(!this.visible)
            return
        if(PKC.isStop)
            return;
        var ui = PKCodeUI.getInstance();
        var playerData = PKC.playerData;
        if (this.touchID) {
            ui.playerItem.move(this.touchID)
        }
        ui.onE();
        if(this.touchID || playerData.isSkilling)
        {
            ui.renewConY(true);
        }


        if(!playerData.isDie)
        {
            //自动选技能
            if(this.touchID && !this.chooseSkill)
            {
                for(var i=0;i<playerData.skillsList.length;i++)
                {
                    var skillData = playerData.skillsList[i];
                    if(skillData.isActive && !playerData.getSkillCD(skillData.sid))
                    {
                        this.chooseSkill = skillData;
                        this.renewChooseSkill();
                        break;
                    }
                }
            }

            //停下来出招
            if(this.chooseSkill && !this.touchID)
            {
                if(PKC.playerData.useSkill(this.chooseSkill.sid))
                {
                    this.chooseSkill = null;
                    this.hideSkillInfo();
                    this.renewChooseSkill();
                }
                else if(egret.getTimer() - this.lastShowTips > 1000){
                    this.lastShowTips = egret.getTimer()
                    switch(this.chooseSkill.sid + '')
                    {
                        case '12':
                            MyWindow.ShowTips('生命已达上限')
                            break;
                        case '3':
                        case '5':
                        case '6':
                        case '7':
                        case '13':
                        case '22':
                        case '29':
                            MyWindow.ShowTips('没有合适的目标')
                            break;
                    }
                }
            }

        }


        if(playerData.isDie == 2)
        {
            playerData.isDie = 3;
            RebornUI.getInstance().show();
            this.touchID = null;
            this.resetTouchGroup();

            this.chooseSkill = null;
            this.hideSkillInfo();
            this.renewChooseSkill();
        }

        var len = PKC.monsterList.length;
        var redIndex = 0;
        var hh = this.height + 30 - 365
        for(var i=0;i<len;i++)
        {
            var monster = PKC.monsterList[i];
            if(monster.isDie)
                continue;
            var x = monster.x + ui.con.x
            var y = monster.y + ui.con.y
            if(x > -30 && x < 670 && y > -30 && y<hh)
                continue;
            this.setMonsterRed(x,y,this.redArr[redIndex],monster)
            redIndex ++;
            if(redIndex >=10)
                break

        }

        for(var i= redIndex;i<10;i++)
        {
            this.redArr[i].visible = false;
        }

        this.renewSkillCD();

        if(PKC.maxStep <= PKC.actionStep && !playerData.isDie)
        {
            PKC.isStop = true;
            if(PKC.haveReborn)
            {
                ResultUI.getInstance().show(false)
            }
            else
            {
                this.showAddTimePanel();
            }
            return;
        }
        this.rateBar.width = 640*(PKC.maxStep - PKC.actionStep)/PKC.maxStep


        if(PKC.monsterList.length + PKC.autoMonster.length == 0)
            ResultUI.getInstance().show(true)




    }

    private showAddTimePanel(){
        PKC.isPKing = false;
        var panel = MyWindow.Confirm('时间到，当前剩余 '+(PKC.monsterList.length + PKC.autoMonster.length)+' 个怪物，观看广告可额外获得 30秒 的战斗时间',(b)=>{
            if(b == 1)
            {
                ShareTool.openGDTV(()=>{
                    PKManager.getInstance().sendGameReborn('timeOver')
                    PKC.haveReborn = true;
                    PKC.isStop = false;
                    PKC.maxStep += 30*PKC.frameRate
                    PKC.isPKing = true;
                    panel.hide();
                })
            }
            else
            {
                ResultUI.getInstance().show(false)
            }
        },['结束游戏', '观看广告'],{stopClose1:true})
    }

    private setMonsterRed(x,y,mc,mData){
        mc.visible = true
        mc.source = mData.getVO().getThumb()

        var r = 16;
        var wr = 320-r

        var h = 365
        if(this.skillInfoGroup.visible)
            h += 120

        var playerY = (this.height-320)/2
        var angle = Math.atan2(y-playerY,x-320)
        if(angle >= 0)
            var hr = this.height - playerY - r - h;
        else
            var hr = (playerY - r);

        var hh = Math.abs(Math.tan(angle)*wr);

        if(hh > hr)//x在0-640内
        {
            var ww = Math.abs(hr/Math.tan(angle));
            if(Math.abs(angle) < Math.PI/2)
                mc.x = (320 + ww);
            else
                mc.x = (320 - ww);
            mc.y = y > playerY?this.height-r-h:r;
        }
        else
        {
            mc.x = x > 320?640-r:r;
            if(angle >= 0)
                mc.y = playerY + hh
            else
                mc.y = playerY - hh
        }

    }

    private onTimer(){
        var mLen = PKC.monsterList.length;
        var mNum = mLen + PKC.autoMonster.length;
        var callNum = 0;
        for(var i=0;i<mLen;i++)
        {
            if(PKC.monsterList[i].isCall)
            {
                mNum --;
                callNum ++;
            }
        }
        if(callNum)
            this.monsterText.text = '当前剩余怪物数量：' + mNum + ' + ' + callNum;
        else
            this.monsterText.text = '当前剩余怪物数量：' + mNum;
        //var rate = mNum/PKC.maxMonster
        //if(rate < 0.3)
        //    this.monsterText.textColor = 0x00FF00
        //else if(rate > 0.7)
        //    this.monsterText.textColor = 0xFF0000
        //else
        //    this.monsterText.textColor = 0xFFFF00
        //
        //if(mNum >= PKC.maxMonster)
        //{
        //    console.log('fail')
        //}
    }

    private renewSkillCD(){
        var len = this.skillArr.length;
        for(var i=0;i<len;i++)
        {
            this.skillArr[i].onE()
        }
    }

    public renewHp(){
        var w =  354 - 14*2;
        var playerData = PKC.playerData;
        var hp = Math.max(0,playerData.hp);
        var rate = hp/playerData.maxHp
        this.hpText.text = hp + ''
        this.hpBar.width = Math.max(14,14 + w*rate);
        //PKC.playerData.relateItem.renewHp();
    }

    public renewCtrl(){
        var chooseType = SharedObjectManager_wx4.getInstance().getMyValue('ctrlType') || 1;
        this.currentState = 's' + chooseType
    }

}