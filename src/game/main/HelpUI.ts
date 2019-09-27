class HelpUI extends game.BaseWindow_wx4 {

    private static _instance: HelpUI;
    public static getInstance(): HelpUI {
        if(!this._instance)
            this._instance = new HelpUI();
        return this._instance;
    }

    private skillBtn: eui.Button;
    private page1: eui.Group;
    private skillItem: PKSkillItem;
    private page2: eui.Group;




    public monsterMV:HeroMVItem = new HeroMVItem();

    public pageIn;
    public page;
    public closeFun;
    public constructor() {
        super();
        this.skinName = "HelpUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('游戏说明')
        this.addBtnEvent(this.skillBtn,()=>{
            if(this.pageIn)
            {
                this.hide();
                return;
            }

            if(this.page == 1)
                this.page = 2;
            else
                this.page = 1;
            this.renewPage()


        })

        this.page1.addChild(this.monsterMV)
        this.monsterMV.x = 125;
        this.monsterMV.y = 170;
        this.monsterMV.scaleX = this.monsterMV.scaleY = 1.2
        this.monsterMV.load(101)
        this.skillItem.data = 1
    }

    public show(page?,closeFun?){
        TC.isStop = true
        this.pageIn = page;
        this.closeFun = closeFun;
        this.page = this.pageIn || 1
        super.show()
    }

    public hide() {
        TC.isStop = false
        super.hide();
        this.monsterMV.stop()
        this.closeFun && this.closeFun();
    }

    public onShow(){
        this.renewPage();
        if(this.pageIn == 1)
        {
            this.skillBtn.label = '知道了'
        }
        else if(this.pageIn == 2)
        {
            this.skillBtn.label = '开始游戏'
        }
    }

    private renewPage(){
        if(this.page == 1)
        {
            this.currentState = 's1'
            if(!this.pageIn)
                this.skillBtn.label = '下一页'
        }
        else if(this.page == 2)
        {
            this.currentState = 's2'
            this.monsterMV.stand()
            if(!this.pageIn)
                this.skillBtn.label = '上一页'
        }
    }



}