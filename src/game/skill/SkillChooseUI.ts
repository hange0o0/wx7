class SkillChooseUI extends game.BaseWindow_wx4 {

    private static _instance: SkillChooseUI;
    public static getInstance(): SkillChooseUI {
        if(!this._instance)
            this._instance = new SkillChooseUI();
        return this._instance;
    }

    private list2: eui.List;
    private list1: eui.List;
    private refreshBtn: eui.Button;
    private startBtn: eui.Button;

    public data;
    public chooseSkill = [];
    public max = 0
    public constructor() {
        super();
        this.skinName = "SkillChooseUISkin";
        //this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();

        this.list1.itemRenderer = SkillChooseItem1
        this.list2.itemRenderer = SkillChooseItem2

        this.setTitle('选择出战技能')


        this.addBtnEvent(this.refreshBtn,()=>{
            ShareTool.openGDTV(()=>{
                var PKM = PKManager.getInstance();
                PKM.initChooseSkill();
                this.data = PKM.lastChooseData;
                this.initChooseSkill();
                this.renew();
            })
        })

        this.addBtnEvent(this.startBtn,()=>{
            PKC.chooseSkill = [];
            for(var i=0;i<this.chooseSkill.length;i++)
            {
                if(this.chooseSkill[i] > 0)
                    PKC.chooseSkill.push(this.chooseSkill[i])
            }
            if(PKC.chooseSkill.length < this.max)
            {
                MyWindow.Confirm('还没选满技能，确定直接开始闯关吗？',(b)=>{
                    if(b == 1)
                    {
                        this.startGame();
                    }
                })
                return;
            }
            this.startGame();
        })
    }

    private startGame(){
        this.hide();
        PKManager.getInstance().lastChooseData = [];
        PKUI.getInstance().show();
        PKManager.getInstance().sendGameStart(UM_wx4.level);
    }

    public show(){
        this.data = [];
        var arr = PKManager.getInstance().lastChooseData;
        for(var i=0;i<arr.length;i++)
        {
            this.data.push({
                id:arr[i],
                level:SkillManager.getInstance().getSkillLevel(arr[i])
            })
        }

        ArrayUtil_wx4.sortByField(this.data,['level'],[1]);
        for(var i=0;i<this.data.length;i++)
        {
            this.data[i] = this.data[i].id;
        }

        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
       this.initChooseSkill();
        this.renew();
    }

    private initChooseSkill(){
        this.max = 4;
        this.chooseSkill = [0,0,0,0];
        if(UM_wx4.shareUser[1])
        {
            this.chooseSkill.push(0);
            this.max ++;
        }
        else
            this.chooseSkill.push(-1);

        if(UM_wx4.shareUser[2])
        {
            this.chooseSkill.push(0);
            this.max ++;
        }
        else
            this.chooseSkill.push(-2);
    }

    public addChoose(id){
        var index = this.chooseSkill.indexOf(id);
        if(index != -1)
        {
            this.chooseSkill[index] = 0;
            this.renew();
            return;
        }
        for(var i=0;i<this.chooseSkill.length;i++)
        {
            if(this.chooseSkill[i] == 0)
            {
                this.chooseSkill[i] = id;
                this.renew();
                return;
            }
        }

        if(UM_wx4.shareUser[1] && UM_wx4.shareUser[2])
            return;
        MyWindow.ShowTips('解锁技能位可上阵更多技能')
    }

    public renew(){
        this.list1.dataProvider = new eui.ArrayCollection(this.chooseSkill);
        this.list2.dataProvider = new eui.ArrayCollection(this.data);

    }

}