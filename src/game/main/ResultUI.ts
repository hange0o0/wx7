class ResultUI extends game.BaseUI_wx4{

    private static _instance:ResultUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ResultUI();
        return this._instance;
    }

    private bg: eui.Image;
    private ad1: eui.Image;
    private ad2: eui.Image;
    private ad4: eui.Image;
    private ad3: eui.Image;
    private coinText: eui.Label;
    private awardBtn: eui.Button;
    private shareBtn: eui.Button;
    private failGroup: eui.Group;
    private barMC: eui.Image;
    private rateText: eui.Label;
    private titleText: eui.Label;










    public isWin;
    public resultCoin;
    public rate = 3;
    public constructor() {
        super();
        this.skinName = "ResultUISkin";
        this.hideBehind = false;

        this.isShowAD = true;
        this.adBottom = 50;
    }

    public childrenCreated() {
        super.childrenCreated();


        this.addBtnEvent(this.ad1,()=>{
            MyADManager.getInstance().showAD(this.ad1['adData'])
        })
        this.addBtnEvent(this.ad2,()=>{
            MyADManager.getInstance().showAD(this.ad2['adData'])
        })
        this.addBtnEvent(this.ad3,()=>{
            MyADManager.getInstance().showAD(this.ad3['adData'])
        })
        this.addBtnEvent(this.ad4,()=>{
            MyADManager.getInstance().showAD(this.ad4['adData'])
        })

        this.addBtnEvent(this.awardBtn,()=>{
            UM_wx4.addCoin(this.resultCoin)
            MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.resultCoin,2),0xFFFF00),1000)
            this.close();
            SoundManager.getInstance().playEffect('coin')
        })

        this.addBtnEvent(this.shareBtn,()=>{
            ShareTool.openGDTV(()=>{
                UM_wx4.addCoin(this.resultCoin*this.rate)
                MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.resultCoin*this.rate,2),0xFFFF00),1000)
                this.close();
                SoundManager.getInstance().playEffect('coin')
            })
        })


    }

    public close(){
        this.hide();
        PKTowerUI.getInstance().hide();
        GameUI.getInstance().onLevelChange()
    }

    public onShow(){
        GunInfoUI.getInstance().hide();
        ShareUnlockUI.getInstance().hide();
        this.renew();
    }

    public show(isWin?){
        TC.isStop = true;
        this.isWin = isWin;
        if(!PKTowerUI.getInstance().isTest)
        {
            PKManager.getInstance().sendGameEnd(isWin)
            PKManager.getInstance().onGameEnd(this.isWin)
            if(this.isWin && TC.currentVO.id == UM_wx4.level)
            {
                UM_wx4.level ++;
                UM_wx4.upWXLevel();
                if(!LevelVO.getObject(UM_wx4.level + 1))
                    TowerManager.getInstance().getServerData();
            }
        }
        super.show()
    }


    public renew(){
        var rate = (TC.appearMonsterNum - PKTowerUI.getInstance().monsterArr.length)/TC.totalMonsterNum
        this.resultCoin = this.isWin?PKManager.getInstance().getWinCoin(TC.currentVO.id):PKManager.getInstance().getFailCoin(TC.currentVO.id,rate)
        if(this.isWin)
            SoundManager.getInstance().playEffect('win')
        else
            SoundManager.getInstance().playEffect('lose')

        //var list = [];
        //for(var s in this.result.skill)
        //{
        //    list.push({
        //        id:s,
        //        num:this.result.skill[s],
        //        lastLevel:SkillManager.getInstance().getSkillLevel(s),
        //    })
        //}
        //
        //PKManager.getInstance().endGame(this.result);
        //
        //for(var i=0;i<list.length;i++)
        //{
        //    list[i].currentLevel = SkillManager.getInstance().getSkillLevel(list[i].id)
        //}
        //this.skillList.dataProvider = new eui.ArrayCollection(list);
        this.coinText.text = '+' + NumberUtil_wx4.addNumSeparator(this.resultCoin);

        this.failGroup.visible = !this.isWin;
        if(this.failGroup.visible)
        {
            this.barMC.width = 360*rate;
            this.rateText.text = '完成进度：'+MyTool.toFixed(rate*100,1) + '%'

            this.titleText.text = '惜败'
            this.titleText.textColor = 0xFF0000
        }
        else
        {
            this.titleText.text = '大胜'
            this.titleText.textColor = 0xFFFF00
        }

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

        var ad = ArrayUtil_wx4.randomOne(adArr,true);
        if(ad)
        {
            this.ad3['adData'] = ad;
            this.ad3.source = ad.logo
            this.ad3.visible = true;
        }
        else
        {
            this.ad2.visible = false;
        }

        var ad = ArrayUtil_wx4.randomOne(adArr,true);
        if(ad)
        {
            this.ad4['adData'] = ad;
            this.ad4.source = ad.logo
            this.ad4.visible = true;
        }
        else
        {
            this.ad4.visible = false;
        }
    }

    public hide(){
        super.hide();
    }
}