class UnlockUI extends game.BaseWindow_wx4 {

    private static _instance: UnlockUI;
    public static getInstance(): UnlockUI {
        if(!this._instance)
            this._instance = new UnlockUI();
        return this._instance;
    }

    private sendBtn: eui.Button;
    private monsterNameText: eui.Label;
    private towerNameText: eui.Label;


    public heroItem
    public towerItem



    public level;
    public gvo;
    public mvo;
    public constructor() {
        super();
        this.skinName = "UnlockUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.sendBtn,()=>{
            var vo = LevelVO.getObject(this.level);
            if(!vo)
            {
                MyWindow.Alert('新的关卡即将开启，请耐心等侯')
                return;
            }
            TC.isTest = 0
            DrawMapUI.getInstance().show(vo);
            this.hide();
        })


        this.heroItem = new PKMonsterMV_wx3()
        this.heroItem.x = 330
        this.heroItem.y = 310
        this.heroItem.scaleX = this.heroItem.scaleY = 1.5
        this.addChild(this.heroItem)

        this.towerItem = new TowerItem();
        this.towerItem.x = 140
        this.towerItem.y = 300
        this.addChild(this.towerItem)
        this.towerItem.scaleX = this.towerItem.scaleY = 1.2


        this.addBtnEvent(this.towerItem,()=>{
            SkillListUI.getInstance().show(this.gvo)
            this.hide()
        })

        this.addBtnEvent(this.heroItem,()=>{
            SkillListUI.getInstance().show(this.mvo)
            this.hide();
        })


    }

    public show(level?){
        this.level = level;
        this.gvo = null
        this.mvo = null

        for(var s in GunVO.data)
        {
            if(GunVO.data[s].level == level)
            {
                this.gvo = GunVO.data[s];
                break;
            }
        }
        for(var s in MonsterVO.data)
        {
            if(MonsterVO.data[s].level == level)
            {
                this.mvo = MonsterVO.data[s];
                break;
            }
        }
        if(!this.gvo || !this.mvo)
            return;

        super.show()
    }

    public hide() {
        super.hide();
        this.heroItem.stop()
        this.towerItem.stop()
    }

    public onShow(){
        this.setTitle('恭喜达到第 '+this.level+' 关')
        this.towerItem.data = this.gvo.id;
        this.towerNameText.text = this.gvo.name


        this.heroItem.load(this.mvo.id)
        this.heroItem.stand();
        this.monsterNameText.text = this.mvo.name

        //this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    //private onTimer(){
    //
    //}

}