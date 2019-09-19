class SkillListUI extends game.BaseWindow_wx4 {

    private static _instance: SkillListUI;
    public static getInstance(): SkillListUI {
        if(!this._instance)
            this._instance = new SkillListUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    public list: eui.List;
    private con: eui.Group;
    private atkText: eui.Label;
    private nameText: eui.Label;
    private skillCDText: eui.Label;
    private img: eui.Image;
    private barGroup: eui.Group;
    private barMC: eui.Image;
    private rateText: eui.Label;
    private tab: eui.TabBar;







    public data;
    public heroItem
    public constructor() {
        super();
        this.skinName = "SkillListUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.list.itemRenderer = SkillListItem

        this.tab.addEventListener(egret.Event.CHANGE,this.onTab,this)
        this.tab.selectedIndex = 0;

        this.list.addEventListener(eui.ItemTapEvent.CHANGE, this.renewChoose, this);

        this.heroItem = new PKMonsterMV_wx3()
        this.heroItem.x = 70
        this.heroItem.y = 160

        this.con.addChild(this.heroItem);
    }

    private onTab(){
        this.renew();
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();

        //this.inputText.text = ''
    }

    public renew(){
        if(this.tab.selectedIndex == 1)
        {
            var list = ObjectUtil_wx4.objToArray(MonsterVO.data)
            for(var i=0;i<list.length;i++)
            {
                list[i].temp = list[i].isHero()?1:0
            }
            this.setTitle('怪物图鉴')
            ArrayUtil_wx4.sortByField(list,['temp','level','id'],[0,0,0])
        }
        else
        {
            var list = ObjectUtil_wx4.objToArray(SkillVO.data)
            for(var i=0;i<list.length;i++)
            {
                list[i].temp = SkillManager.getInstance().getSkillNum(list[i].id);
            }
            ArrayUtil_wx4.sortByField(list,['temp','level','id'],[1,1,1]);
            this.setTitle('技能图鉴')
        }


        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection(list)

        this.renewChoose()
    }


    public renewChoose(){
        if(!this.list.selectedItem)
            return;
        if(this.tab.selectedIndex == 1)
        {
            this.renewMonsterInfo(this.list.selectedItem)
        }
        else
        {
            this.renewSkillInfo(this.list.selectedItem)
        }
        MyTool.runListFun(this.list,'setSelect')
    }

    private renewSkillInfo(svo){
        this.nameText.text = svo.name
        var SM = SkillManager.getInstance();
        var cd = svo.getCD();
        this.skillCDText.textColor = 0xFCE7B0;
        if(cd)
            this.setHtml(this.skillCDText,'技能间隔:' + this.createHtml(MyTool.toFixed(cd/1000,1) + '秒',0xFFFF00))
        else
            this.setHtml(this.skillCDText,this.createHtml('被动技能',0xECAEF9))
        this.setHtml(this.atkText, svo.getDes())


        var lv = SM.getSkillLevel(svo.id);
        this.img.source = svo.getThumb();
        this.nameText.text = svo.name + ' (lv.'+lv+')'
        //this.levelText.text = 'lv.' + lv


        var currentNum = SM.getSkillNum(svo.id)
        var num1 = SM.getLevelNum(lv)
        var num2 = SM.getLevelNum(lv+1)

        var v1 = currentNum - num1
        var v2 = num2 - num1
        this.rateText.text = v1 + '/' + v2;
        this.barMC.width = 100 * v1 / v2;

        this.img.visible = true
        this.barGroup.visible = true
        this.heroItem.visible = false

    }

    private renewMonsterInfo(mvo){
        this.nameText.text = mvo.name
        this.atkText.text = mvo.des
        this.skillCDText.textColor = 0xFF0000;



        this.img.visible = false
        this.barGroup.visible = false
        this.heroItem.visible = true

        this.heroItem.load(mvo.id)
        this.heroItem.stand();

        if(mvo.isHero())
        {
            this.heroItem.scaleX = this.heroItem.scaleY = 0.7
            this.skillCDText.text = '【BOSS】'
        }
        else
        {
            this.heroItem.scaleX = this.heroItem.scaleY = 1.2
            this.skillCDText.text = ''
        }
    }

}