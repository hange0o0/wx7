class GunInfoUI extends game.BaseWindow_wx4 {

    private static _instance: GunInfoUI;
    public static getInstance(): GunInfoUI {
        if(!this._instance)
            this._instance = new GunInfoUI();
        return this._instance;
    }

    private closeBtn: eui.Button;
    private con: eui.Group;
    private txt1: eui.Label;
    private txt2: eui.Label;
    private nameText: eui.Label;
    private towerItem: TowerItem;
    private enemyList: eui.List;








    public gunid;
    public posX;
    public posY;
    public constructor() {
        super();
        this.skinName = "GunInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('塔器详情')
        this.addBtnEvent(this.closeBtn,this.hide)

        this.enemyList.itemRenderer = SkillEnemyItem

        this.towerItem.x += 32
        this.towerItem.y += 32
        this.towerItem.scaleX = this.towerItem.scaleY = 1.2

    }

    public show(gunid?,posX?,posY?){
        this.gunid = gunid;
        this.posX = posX;
        this.posY = posY;
        super.show()
    }

    public hide() {
        super.hide();
        PKTowerUI.getInstance().pkMap.showTowerLight(this.posX,this.posY);
    }

    public onShow(){
        var gvo = GunVO.getObject(this.gunid)
        this.nameText.text = gvo.name
        this.towerItem.data = gvo.id;


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

}