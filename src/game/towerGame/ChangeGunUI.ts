class ChangeGunUI extends game.BaseWindow_wx4 {

    private static _instance: ChangeGunUI;
    public static getInstance(): ChangeGunUI {
        if(!this._instance)
            this._instance = new ChangeGunUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private con: eui.Group;
    private txt1: eui.Label;
    private txt2: eui.Label;
    private nameText: eui.Label;
    private towerItem: TowerItem;
    private enemyList: eui.List;
    private btnGroup: eui.Group;
    private dropBtn: eui.Button;
    private okBtn: eui.Button;










    public data;
    public constructor() {
        super();
        this.skinName = "ChangeGunUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();

        this.setTitle('配备武器')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = ChangeGunItem

        this.enemyList.itemRenderer = SkillEnemyItem
        this.enemyList.touchChildren = this.enemyList.touchEnabled = false;


        this.list.addEventListener(eui.ItemTapEvent.CHANGE, this.renewChoose, this);



        this.towerItem.x += 32
        this.towerItem.y += 32
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

        var list = ObjectUtil_wx4.objToArray(GunVO.data)
        ArrayUtil_wx4.sortByField(list,['level','id'],[0,0]);
        this.setTitle('装备图鉴')
        this.currentState = 's1'
        this.list.dataProvider = new eui.ArrayCollection(list)
    }



    public renewChoose(){
        if(!this.list.selectedItem)
            return;
        this.renewGunInfo(this.list.selectedItem)
        MyTool.runListFun(this.list,'setSelect')
    }

    private renewGunInfo(gvo){
        this.nameText.text = gvo.name

        var arr1 = [];
        var arr2 = [];
        arr1.push('攻击：' + this.createHtml(gvo.atk,0xFFFF00))
        arr1.push('射程：' + this.createHtml(gvo.atkdis,0xFFFF00))
        if(gvo.skilltype)
            arr1.push('技能：' + gvo.getDes())

        arr2.push('攻速：' + this.createHtml(MyTool.toFixed(1000/gvo.atkspeed,1),0xFFFF00))
        arr2.push('数量：' + this.createHtml(gvo.shootnum,0xFFFF00))
        this.setHtml(this.txt1,arr1.join('\n'))
        this.setHtml(this.txt2,arr2.join('\n'))

        var enemy = gvo.getEnemys();
        this.enemyList.dataProvider = new eui.ArrayCollection(enemy);

    }
}

class ChangeGunItem extends SkillListItem{

    public constructor() {
        super();
    }

    public setSelect(){
        this['selectMC'].visible = this.data == SkillListUI.getInstance().list.selectedItem;
    }
}

