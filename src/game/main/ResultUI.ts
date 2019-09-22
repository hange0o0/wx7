class ResultUI extends game.BaseUI_wx4{

    private static _instance:ResultUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ResultUI();
        return this._instance;
    }

    private bg: eui.Image;
    private coinText: eui.Label;
    private awardBtn: eui.Button;
    private shareBtn: eui.Button;
    private failGroup: eui.Group;
    private barMC: eui.Image;
    private rateText: eui.Label;
    private titleText: eui.Label;
    private ad1: eui.Image;
    private ad2: eui.Image;









    public isWin;
    public result;
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

        this.addBtnEvent(this.awardBtn,()=>{
            MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.result.coin,2),0xFFFF00),1000)
            MyWindow.ShowTips('获得技能碎片：'+MyTool.createHtml('+' + this.result.skillNum,0xFFFF00),1000)
            this.close();
            SoundManager.getInstance().playEffect('coin')
        })

        this.addBtnEvent(this.shareBtn,()=>{
            ShareTool.openGDTV(()=>{
                MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(this.result.coin*this.rate,2),0xFFFF00),1000)
                MyWindow.ShowTips('获得技能碎片：'+MyTool.createHtml('+' + this.result.skillNum*this.rate,0xFFFF00),1000)
                this.close();
                SoundManager.getInstance().playEffect('coin')
                this.rate --
                while(this.rate > 0)
                {
                    //PKManager.getInstance().endGame(this.result);
                    this.rate --
                }

            })
        })


    }

    public close(){
        this.hide();
    }

    public onShow(){
        this.renew();
    }

    public show(isWin?){
        this.isWin = isWin;
        PKManager.getInstance().sendGameEnd(isWin)
        if(this.isWin)
        {
            UM_wx4.level ++;
            UM_wx4.upWXLevel();
        }
        super.show()
    }


    public renew(){
        //var rate = PKC.monsterList.length/PKC.roundMonsterNum
        //this.result = this.isWin?PKManager.getInstance().getWinResult():PKManager.getInstance().getFailResult(1-rate)
        //if(this.isWin)
        //    SoundManager.getInstance().playEffect('win')
        //else
        //    SoundManager.getInstance().playEffect('lose')
        //
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
        //this.coinText.text = '金币 +' + NumberUtil_wx4.addNumSeparator(this.result.coin);
        //
        //this.failGroup.visible = !this.isWin;
        //if(this.failGroup.visible)
        //{
        //
        //    var mLen = PKC.monsterList.length;
        //    var mNum = mLen + PKC.autoMonster.length;
        //    var rate = mNum/PKC.roundMonsterNum
        //    this.barMC.width = 360*rate;
        //    this.rateText.text = '剩余怪物：'+(mNum)
        //
        //    this.titleText.text = '惜败！'
        //    this.titleText.textColor = 0xFF0000
        //}
        //else
        //{
        //    this.titleText.text = '大胜！'
        //    this.titleText.textColor = 0xFFFF00
        //}
        //
        //
        //var adArr = MyADManager.getInstance().getListByNum(10);
        //var ad = ArrayUtil_wx4.randomOne(adArr,true);
        //if(ad)
        //{
        //    this.ad1['adData'] = ad;
        //    this.ad1.source = ad.logo
        //    this.ad1.visible = true;
        //}
        //else
        //{
        //    this.ad1.visible = false;
        //}
        //
        //
        //var ad = ArrayUtil_wx4.randomOne(adArr,true);
        //if(ad)
        //{
        //    this.ad2['adData'] = ad;
        //    this.ad2.source = ad.logo
        //    this.ad2.visible = true;
        //}
        //else
        //{
        //    this.ad2.visible = false;
        //}
    }

    public hide(){
        super.hide();
    }
}