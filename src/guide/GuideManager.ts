/**
 *
 * @author 
 *
 */
class GuideManager {
    //work*2->def*2->mlv,cnum->clv->tec->fight
    private static _instance: GuideManager;
    public currentStepId: Number;
    public isGuiding:boolean = false;

    public temp;


    public guideKey;
    public guideKey2;
    public guideStep = 0;

    public guideRandom = 0;
    public guidePK = 0;


    private guideArr = [];
    public constructor() {

    }

    public static getInstance(): GuideManager {
        if(!this._instance)
            this._instance = new GuideManager();
        return this._instance;
    }

    public testShowGuide(){
        if(this.isGuiding)
        {
           this.showGuide()
        }
    }

    public enableScrollV(scroller){
        scroller.scrollPolicyV = this.isGuiding? eui.ScrollPolicy.OFF:eui.ScrollPolicy.AUTO
    }

    public showGuide(){
        if(!this.isGuiding)
            return;
        //this.guideKey = ''
        MyTool.stopClick(300);
        egret.setTimeout(this.guideFun,this,200);
    }

    //public reInit(){
    //    this.guideRandom = 0;
    //    this.guidePK = 0;
    //    this.guideArr[0].text = '(代号)['+UM.nick+']您好，欢迎来到[【冲破防线】]！我是你的引路人[铁牛]。'
    //}

    public init(){
        var self = this;
        //            hideHand:false,
        this.addGuideObj({
            fun:function(){
                self.showGuide();
            },
            text:'[' + UM_wx4.nick+']你好，欢迎来到怪物争霸的世界。',
        })



        this.addGuideObj({
            fun:function(){
                self.endGuide();
            },
            text:'恭喜你取得了来到怪物世界的首利。下面就请跟着[主线任务]继续前进吧！',
        })





        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().loadingGroup},
        //    text:'这里是参战双方的队伍，他们会按箭头所指方向顺序加入战场',
        //    fun:function(){
        //        self.showGuide()
        //        GameUI.getInstance().hideGuideArrow();
        //        self.guideKey2 = 'info';
        //    },
        //    showFun:()=>{
        //        GameUI.getInstance().showGuideArrow();
        //        var tipsGroup = GuideUI.getInstance().tipsGroup;
        //        tipsGroup.validateNow();
        //        tipsGroup.y = (GameManager.uiHeight-tipsGroup.height)/2 - 10;
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().team1.guideCon},
        //    text:'可选中其中一个单位查看详细数据',
        //
        //    //fun:()=>{
        //    //    CardInfoUI.getInstance().show(GameUI.getInstance().team1.getMiddleMoster().id)
        //    //}
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return CardInfoUI.getInstance().con},
        //    text:'要注意单位间的属性相克关系',
        //    toBottom:true,
        //    fun:function(){
        //        CardInfoUI.getInstance().hide();
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().team1.bottomBG},
        //    text:'了解队伍情况后，可选择你感兴趣的队伍进行打赏',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().team1.forceGroup},
        //    text:'越多人打赏的队伍实力会越强，但回报率也会相应降低，而少人打赏的队伍回报率就会比较高',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().cdText},
        //    text:'你只能在备战阶段进行打赏，备战会有时间限制，备战结束后就会进入对战阶段',
        //    fun:function(){
        //        self.guideKey = 'pk';
        //        self.temp = TM.now();
        //        GameUI.getInstance().onTimer();
        //        self.showGuide()
        //    },
        //})
        //
        //this.addGuideObj({
        //    text:'进入对战阶段后，双方按顺序进入战场进行对决，直到消灭所有敌人或其中一方冲破对方出生点',
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //this.addGuideObj({
        //    mc:function(){return MainPKUI.instance.cdGroup},
        //    text:'对战会时间限制，如果在'+Math.round(PKConfig.drawTime/1000)+'秒内未能决出胜负，则算双方平手，庄家通杀^_^',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return MainPKUI.instance.list1.getChildAt(0)},
        //    text:'你可以点击下方头像查看单位的详细信息',
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().settingBtn},
        //    text:'如果在等待下一环节时，可尝试挑战一下里面的关卡，胜利后可获得金币哦',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //
        //this.addGuideObj({
        //    text:'介绍到此结束，下面正式进入游戏',
        //    fun:function(){
        //        self.endGuide()
        //        GameUI.getInstance().endGuide();
        //    }
        //})
    }

    private endGuide(){
        this.isGuiding = false;
        GuideUI.getInstance().hide()
        PopUpManager.hideAll();
    }

    private addGuideObj(obj){
        this.guideArr.push(obj);
    }

    private guideFun(ui){
        var self = this;
        var data = this.guideArr[this.guideStep];
        var guideData:any = {};
        guideData.mc = data.mc;
        //if(guideData.mc && typeof guideData.mc == 'string')
        //    guideData.mc = eval(guideData.mc);
        if(guideData.mc && typeof guideData.mc == 'function')
            guideData.mc = guideData.mc();
        guideData.fun = data.fun;
        guideData.text = data.text;
        guideData.toBottom = data.toBottom;
        guideData.nearMC = data.nearMC;
        guideData.hideHand = data.hideHand || false;
        guideData.showFun = data.showFun//data.hideHand || false;

        if(data.guideKey)
            this.guideKey = data.guideKey

        this.guideStep ++;

        data.beforeFun &&  data.beforeFun();

        GuideUI.getInstance().show(guideData)
    }

    private getMainRect(){
        var h = GameManager_wx4.stage.stageHeight - 140 -260//Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = 140//(GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }



}
