class UnlockUI extends game.BaseWindow_wx4 {

    private static _instance: UnlockUI;
    public static getInstance(): UnlockUI {
        if(!this._instance)
            this._instance = new UnlockUI();
        return this._instance;
    }

    private sendBtn: eui.Button;
    private s0: SkillListItem;
    private s1: SkillListItem;




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
            DrawMapUI.getInstance().isTest = false
            DrawMapUI.getInstance().show(vo);
            this.hide();
        })


        this.addBtnEvent(this.s1,()=>{
            SkillListUI.getInstance().show(this.gvo)
            this.hide()
        })

        this.addBtnEvent(this.s0,()=>{
            SkillListUI.getInstance().show(this.mvo)
            this.hide();
        })
    }

    public show(level?){
        this.level = level;

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
    }

    public onShow(){
        this.setTitle('恭喜达到第 '+this.level+' 关')
        this.s0.data = this.mvo
        this.s1.data = this.gvo
    }

}