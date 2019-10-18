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
    private txt1: eui.Label;
    private txt2: eui.Label;
    private nameText: eui.Label;
    private towerItem: TowerItem;
    private enemyList: eui.List;
    private tab: eui.TabBar;









    public dataIn;
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

        this.enemyList.itemRenderer = SkillEnemyItem

        this.tab.addEventListener(egret.Event.CHANGE,this.onTab,this)
        this.tab.selectedIndex = 0;

        this.list.addEventListener(eui.ItemTapEvent.CHANGE, this.renewChoose, this);

        this.heroItem = new PKMonsterMV_wx3()
        this.heroItem.x = 75
        this.heroItem.y = 170
        this.heroItem.scaleX = this.heroItem.scaleY = 1.5

        this.towerItem.x += 32
        this.towerItem.y += 32
        this.towerItem.scaleX = this.towerItem.scaleY = 1.2

        this.con.addChild(this.heroItem);
    }

    private onTab(){
        this.renew();
    }

    public show(dataIn?){
        this.dataIn = dataIn;

        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        if(this.dataIn)
        {
            this.renewShow(this.dataIn)
        }
        else
        {
            this.renew();
        }
        //this.inputText.text = ''
    }

    public renew(item?){

        if(this.tab.selectedIndex == 1)
        {
            var list = ObjectUtil_wx4.objToArray(MonsterVO.data)
            this.setTitle('怪物图鉴')
            ArrayUtil_wx4.sortByField(list,['level','id'],[0,0])
            this.currentState = 's2'
        }
        else
        {
            var list = ObjectUtil_wx4.objToArray(GunVO.data)
            ArrayUtil_wx4.sortByField(list,['level','id'],[0,0]);
            this.setTitle('装备图鉴')
            this.currentState = 's1'
        }

        var index = 0
        if(item)
            index = list.indexOf(item);
        this.list.selectedIndex = index;
        this.list.dataProvider = new eui.ArrayCollection(list)

        this.renewChoose()
    }

    public renewShow(vo){
        if(vo instanceof MonsterVO)
        {
            this.tab.selectedIndex = 1
        }
        else
        {
            this.tab.selectedIndex = 0
        }
        this.renew(vo);
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
            this.renewGunInfo(this.list.selectedItem)
        }
        MyTool.runListFun(this.list,'setSelect')
    }

    private renewGunInfo(gvo){
        this.nameText.text = gvo.name

        this.towerItem.visible = true
        this.towerItem.data = gvo.id;

        this.heroItem.visible = false
        this.heroItem.stop();

        var arr1 = [];
        var arr2 = [];
        arr1.push('攻击：' + this.createHtml(gvo.atk,0xFFFF00))
        arr1.push('射程：' + this.createHtml(gvo.atkdis,0xFFFF00))
        if(gvo.skilltype)
            arr1.push('技能：' + gvo.getDes())

        arr2.push('攻速：' + this.createHtml(MyTool.toFixed(30/gvo.atkspeed,1),0xFFFF00))
        arr2.push('数量：' + this.createHtml(gvo.shootnum,0xFFFF00))
        this.setHtml(this.txt1,arr1.join('\n'))
        this.setHtml(this.txt2,arr2.join('\n'))

        var enemy = gvo.getEnemys();
        this.enemyList.dataProvider = new eui.ArrayCollection(enemy);

    }

    private renewMonsterInfo(mvo){
        this.nameText.text = mvo.name

        this.towerItem.visible = false
        this.towerItem.stop();

        this.heroItem.visible = true
        this.heroItem.load(mvo.id)
        this.heroItem.stand();

        var arr1 = [];
        var arr2 = [];
        arr1.push('血量：' + this.createHtml(mvo.hp,0xFFFF00))
        arr2.push('速度：' + this.createHtml(mvo.speed,0xFFFF00))
        this.setHtml(this.txt1,arr1.join('\n'))
        this.setHtml(this.txt2,arr2.join('\n'))

        var enemy = mvo.getEnemys();
        this.enemyList.dataProvider = new eui.ArrayCollection(enemy);

    }

}