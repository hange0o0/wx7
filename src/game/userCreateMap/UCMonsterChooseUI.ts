class UCMonsterChooseUI extends game.BaseWindow_wx4 {

    private static _instance: UCMonsterChooseUI;
    public static getInstance(): UCMonsterChooseUI {
        if(!this._instance)
            this._instance = new UCMonsterChooseUI();
        return this._instance;
    }

    private scrollerUp: eui.Scroller;
    private listUp: eui.List;
    private scrollerDown: eui.Scroller;
    private listDown: eui.List;
    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;



    private monsterList;
    private chooseList;
    public constructor() {
        super();
        this.skinName = "UCMonsterChooseUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('配置出战怪物')

        this.scrollerUp.viewport = this.listUp
        this.scrollerDown.viewport = this.listDown
        this.listUp.itemRenderer = UCMonsterChooseItem
        this.listDown.itemRenderer = UCMonsterChooseItemDown



        this.addBtnEvent(this.okBtn,()=>{
            this.monsterList.length = 0;
            for(var i=0;i<this.chooseList.length;i++)
            {
                this.monsterList.push(this.chooseList[i].id)
            }
        })

        this.addBtnEvent(this.cancelBtn,this.hide)
    }

    public show(monsterList?){
        this.monsterList = monsterList;
        this.chooseList = [];
        for(var i=0;i<monsterList.length;i++)
        {
            this.chooseList.push({
                id:monsterList[i]
            })
        }
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.renewChoose();
    }


    public renew(){
        var list = ObjectUtil_wx4.objToArray(MonsterVO.data)
        ArrayUtil_wx4.sortByField(list,['level','id'],[0,0])

        var arr = [];
        for(var i=0;i<list.length;i++)
        {
            if(list[i].level > UM_wx4.level)
                break;
            arr.push(list[i]);
        }
        this.listDown.dataProvider = new eui.ArrayCollection(arr)
    }

    private renewChoose(){
        this.listUp.dataProvider = new eui.ArrayCollection(this.chooseList)
    }

    public removeItem(item){
        var index = this.chooseList.indexOf(item);
        if(index != -1)
        {
            this.chooseList.splice(index,1)
            this.renewChoose();
        }
    }

    public addItem(item){
        if(this.chooseList.length >= 15)
        {
            MyWindow.ShowTips('最多只能上阵15个怪物')
            return;
        }
        this.chooseList.push(item)
        this.renewChoose();
    }

}