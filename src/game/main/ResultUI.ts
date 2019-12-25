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
    private failCoinText: eui.Label;
    private awardBtn: eui.Button;
    private shareBtn: eui.Button;
    private failGroup: eui.Group;
    private barMC: eui.Image;
    private rateText: eui.Label;
    private titleText: eui.Label;
    private failTipsGroup: eui.Group;
    private failText: eui.Label;











    public isWin;
    public resultCoin;
    public rate = 3;
    public newLevel = false

    public zjVideo = false
    public zjVideoTimes = 0;

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
            if(this.currentState == 'fail')
            {
                UM_wx4.addCoin(this.resultCoin)
                MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.resultCoin,2),0xFFFF00),1000)
                this.close();
                DrawMapUI.getInstance().show(TC.currentVO);
                return;
            }
            if(this.zjVideo)
            {
                ZijieScreenBtn.e.awardPublish(this.resultCoin*this.rate,()=>{
                    this.zjVideoTimes ++;
                    this.close();
                    SoundManager.getInstance().playEffect('coin')
                })
                return;
            }
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
        GameUI.getInstance().onLevelChange(this.newLevel)
    }

    public onShow(){
        if(GunInfoUI.getInstance().stage)
            GunInfoUI.getInstance().hide();
        if(ShareUnlockUI.getInstance().stage)
            ShareUnlockUI.getInstance().hide();
        TC.isStop = true;
        this.renew();
        ZijieScreenBtn.e && ZijieScreenBtn.e.stop();
        ADIconManager.getInstance().showIcon('result')
    }

    public show(isWin?){
        var isTest = TC.isTest;
        this.isWin = isWin;
        this.newLevel = false

        if(isTest)
        {
            if(isTest == 1)
            {
                if(!TC.findTower)
                    MyWindow.Alert(isWin?'win':'fail')

                if(isWin)
                {
                    //DrawMapUI.getInstance().hide();
                    if(TC.findTower)
                    {
                        CreateMapManager.getInstance().save();
                        var addStep = Math.min(Math.ceil(TC.currentVO.id/20),5)
                        if(TC.findType == 2)
                            addStep = 1;
                        else if(TC.currentVO.hard < 0)
                            addStep = 1;
                        TC.currentVO.hard += addStep;//向上5个难度找
                        TC.findTowerTimes = 0;
                        console.log('find finish!,hard to ' + TC.currentVO.hard)


                        egret.callLater(DrawMapUI.getInstance().startGame,DrawMapUI.getInstance())
                    }
                }
                else if(TC.findTower)
                {
                    egret.callLater(DrawMapUI.getInstance().findTower,DrawMapUI.getInstance())
                }
            }
            else if(isTest == 2)
            {
                if(isWin)
                {
                    UCMapResultUI.getInstance().show()
                }
                else
                {
                    MyWindow.Alert('挑战失败，无法发布！');
                }
                DrawMapUI.getInstance().hide();
                PKTowerUI.getInstance().hide();
            }
            else if(isTest == 3)
            {
                if(isWin)
                {
                    super.show();
                    var coin = Math.floor(TC.currentVO.coin/2)
                    var mData = UCMapManager.getInstance().getMapByID(TC.currentVO._id);
                    if(mData)
                        coin = Math.floor(mData.coin/2)
                    UCMapManager.getInstance().pkMap(TC.currentVO._id,-coin)
                }
                else
                {
                    MyWindow.Alert('挑战失败！');
                    PKTowerUI.getInstance().hide();
                }
                DrawMapUI.getInstance().hide();

            }
            else if(isTest == 4)
            {
                if(isWin)
                {
                    MyWindow.Alert('挑战成功，快告诉你的好友吧！',()=>{
                        ShareTool.share('你的地图我已挑战成功了！！！',Config.getShare(1),{},()=>{

                        },true)
                    });
                    DrawMapUI.getInstance().hide();
                }
                else
                {
                    MyWindow.Alert('挑战失败！');
                }
                PKTowerUI.getInstance().hide();
            }

            return;
        }




        PKManager.getInstance().sendGameEnd(isWin)
        PKManager.getInstance().onGameEnd(this.isWin)
        if(this.isWin && TC.currentVO.id == UM_wx4.level)
        {
            this.newLevel = true;
            UM_wx4.level ++;
            UM_wx4.upWXLevel();
            if(!LevelVO.getObject(UM_wx4.level + 1))
                TowerManager.getInstance().getServerData();
        }


        super.show()
    }


    public renew(){
        var rate = (TC.appearMonsterNum - PKTowerUI.getInstance().monsterArr.length)/TC.totalMonsterNum
        if(TC.isTest == 3)
        {
            this.resultCoin = Math.floor(TC.currentVO.coin/2*PKManager.getInstance().getCoinRate());
            this.shareBtn.visible = false
        }
        else
        {
            this.resultCoin = this.isWin?PKManager.getInstance().getWinCoin(TC.currentVO.id):PKManager.getInstance().getFailCoin(TC.currentVO.id,rate)
            this.shareBtn.visible = true
        }
        if(this.isWin)
        {
            SoundManager.getInstance().playEffect('win')
            this.currentState = 'win'
            this.coinText.text = '+' + NumberUtil_wx4.addNumSeparator(this.resultCoin);
            if(ZijieScreenBtn.e && !TC.rebornTime)
            {
                this.zjVideo = true;
            }

            if(this.zjVideo)
                this.shareBtn.icon = 'zj_video_icon_png'
            else
                this.shareBtn.icon = 'video_icon_png'
        }
        else
        {
            this.shareBtn.icon = ''
            SoundManager.getInstance().playEffect('lose')
            this.currentState = 'fail'
            this.failCoinText.text = '金币 +' + NumberUtil_wx4.addNumSeparator(this.resultCoin);

            var arr = [ '* 升级武器提升攻击力']
            arr.push( '* 调整怪物路径以延长输出时间')
            arr.push( '* 上阵能克制对应怪物的武器')
            arr.push( '* 合理移动英雄，适时使用技能')
            if(UM_wx4.level >= 10)
            {
                arr.push( '* 观看广告，临时大幅提升攻击力')
            }


            this.failText.text = arr.join('\n')
        }

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
        ADIconManager.getInstance().hideAll()
    }
}