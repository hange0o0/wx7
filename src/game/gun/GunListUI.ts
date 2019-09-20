class GunListUI extends game.BaseWindow_wx4{

    private static _instance:GunListUI;
    public static getInstance() {
        if (!this._instance) this._instance = new GunListUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private atkText: eui.Label;
    private nameText: eui.Label;


    private atkSpeed = 0;
    private doubleRate = 0;
    private actionStep = 0;
    public get data(){
        return this.list.selectedItem;
    }
    public constructor() {
        super();
        this.skinName = "GunListUISkin";

    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('更换武器')
        this.scroller.viewport = this.list;
        this.list.itemRenderer = GunListItem

    }

    public show(){
        super.show()
    }

    public onShow(){
        this.actionStep = 100;
        this.renew();
        this.renewChoose();
        this.addPanelOpenEvent(GameEvent.client.GUN_CHANGE,this.renewList)
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
    }

    private onE(){

    }

    public renewList(){
        MyTool.renewList(this.list);
        this.renewChoose();
    }

    public renew(){
        var list = ObjectUtil_wx4.objToArray(GunVO.data)
        list.length = GunManager.getInstance().getUnlockNum();
        this.list.dataProvider = new eui.ArrayCollection(list)
    }

    private createText(title,des){
        return title + '：' + this.createHtml(des,0xFFFFFF);
    }

    public renewChoose(){
        var GM = GunManager.getInstance();
        var vo:GunVO = GunVO.getObject(GM.gunid);



        this.nameText.text = vo.name;
        var arr = [];
        arr.push(this.createText('攻击伤害',vo.atk + '%'))
        arr.push(this.createText('攻击间隔',MyTool.toFixed(vo.atkspeed/100,1) + '秒'))
        arr.push(this.createText('攻击距离',vo.atkdis + ''))
        //arr.push(this.createText('打退距离',vo.atkback + ''))
        //arr.push(this.createText('暴击率',vo.doublerate + '%'))
        //arr.push(this.createText('暴击倍数',MyTool.toFixed(vo.doublevalue,1) + '倍'))
        //arr.push(this.createText('闪避率',vo.missrate + '%'))
        this.setHtml(this.atkText,arr.join('\n'));

        this.atkSpeed = PKTool.getStepByTime(vo.atkspeed)
        //this.doubleRate = vo.doublerate/100
        this.actionStep = this.atkSpeed

    }

    public hide(){
        super.hide();
    }
}