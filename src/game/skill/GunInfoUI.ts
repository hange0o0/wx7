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
    public tower:TowerItem;
    public constructor() {
        super();
        this.skinName = "GunInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('武器详情')
        this.addBtnEvent(this.closeBtn,()=>{
            PKTowerUI.getInstance().pkMap.showTowerLight(this.posX,this.posY);
            this.hide();
        })

        this.enemyList.itemRenderer = SkillEnemyItem
        this.enemyList.touchEnabled = this.enemyList.touchChildren = false;

        this.towerItem.x += 32
        this.towerItem.y += 32
        this.towerItem.scaleX = this.towerItem.scaleY = 1.2

    }

    public show(tower?){
        this.tower = tower
        this.gunid = this.tower.gvo.id;
        this.posX = this.tower.posX;
        this.posY = this.tower.posY;
        super.show()
    }

    public hide() {
        super.hide();

    }

    public onShow(){
        var gvo = GunVO.getObject(this.gunid)
        this.nameText.text = gvo.name
        this.towerItem.data = gvo.id;


        var arr1 = [];
        var arr2 = [];

        if(this.tower.atk > this.tower.baseAtk)
            arr1.push('攻击：' + this.createHtml(this.tower.baseAtk,0xFFFF00) + this.createHtml(' +' + (this.tower.atk - this.tower.baseAtk),0x00ff00))
        else
            arr1.push('攻击：' + this.createHtml(this.tower.baseAtk,0xFFFF00))

        if(this.tower.atkDis > gvo.atkdis)
            arr1.push('射程：' + this.createHtml(gvo.atkdis,0xFFFF00) + this.createHtml(' +' + (this.tower.atkDis - gvo.atkdis),0x00ff00))
        else
            arr1.push('射程：' + this.createHtml(gvo.atkdis,0xFFFF00))


        if(gvo.skilltype)
            arr1.push('技能：' + gvo.getDes())

        if(this.tower.atkSpeed < gvo.atkspeed)
            arr2.push('攻速：' + this.createHtml(MyTool.toFixed(30/gvo.atkspeed,1),0xFFFF00) + this.createHtml(' +' + MyTool.toFixed(30/this.tower.atkSpeed - 30/gvo.atkspeed,1),0x00ff00))
        else
            arr2.push('攻速：' + this.createHtml(MyTool.toFixed(30/gvo.atkspeed,1),0xFFFF00))



        arr2.push('数量：' + this.createHtml(gvo.shootnum,0xFFFF00))
        this.setHtml(this.txt1,arr1.join('\n'))
        this.setHtml(this.txt2,arr2.join('\n'))

        var enemy = gvo.getEnemys();
        this.enemyList.dataProvider = new eui.ArrayCollection(enemy);
    }

}