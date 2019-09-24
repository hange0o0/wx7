class ChangeGunUI extends game.BaseWindow_wx4 {

    private static _instance: ChangeGunUI;
    public static getInstance(): ChangeGunUI {
        if(!this._instance)
            this._instance = new ChangeGunUI();
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
    private btnGroup: eui.Group;
    private moreBtn: eui.Button;
    private okBtn: eui.Button;











    public towerPos;
    public xx;
    public yy;
    public key;
    public listObj;
    public lastSelectGun
    public constructor() {
        super();
        this.skinName = "ChangeGunUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();

        this.setTitle('配备塔器')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = ChangeGunItem

        this.enemyList.itemRenderer = SkillEnemyItem
        this.enemyList.touchChildren = this.enemyList.touchEnabled = false;


        this.list.addEventListener(eui.ItemTapEvent.CHANGE, this.renewChoose, this);



        this.towerItem.x += 32
        this.towerItem.y += 32
        this.towerItem.scaleX = this.towerItem.scaleY = 1.2

        this.addBtnEvent(this.moreBtn,()=>{
            var arr = PKManager.getInstance().addGunList();

            var listObj = this.listObj;
            for(var i=0;i<arr.length;i++)
            {
                var gid = arr[i];
                if(!listObj[gid])
                {
                    listObj[gid] = {id:gid,num:0}
                }
                listObj[gid].num ++;
            }
            var list = ObjectUtil_wx4.objToArray(listObj);
            ArrayUtil_wx4.sortByField(list,['id'],[0]);
            this.list.dataProvider = new eui.ArrayCollection(list)
        })

        this.addBtnEvent(this.okBtn,()=>{
            this.towerPos[this.key] = this.lastSelectGun
            DrawMapUI.getInstance().onChoosGun()
            this.hide()
        })
    }


    public show(towerPos?,xx?,yy?){
        this.towerPos = towerPos
        this.xx = xx
        this.yy = yy
        this.key = xx+'_' + yy
        super.show()
    }

    public hide() {
        super.hide();
        if(this.towerPos[this.key])
        {
            DrawMapUI.getInstance().pkMap.showTowerLight(this.xx,this.yy);
        }
    }

    public onShow(){
        if(UM_wx4.level < 8)
            MyTool.removeMC(this.moreBtn)
        else
            this.btnGroup.addChildAt(this.moreBtn,0)

        this.renew();
        this.renewChoose();

        //this.inputText.text = ''
    }

    public renew(){
        var arr = PKManager.getInstance().gunList;
        var listObj = this.listObj = {};
        var gid:any;
        for(var i=0;i<arr.length;i++)
        {
            gid = arr[i];
            if(!listObj[gid])
            {
                listObj[gid] = {id:gid,num:0}
            }
            listObj[gid].num ++;
        }
        for(var s in this.towerPos)
        {
            gid = this.towerPos[s]
            if(gid && listObj[gid])// && s != this.key
                listObj[gid].num --;

        }
        var list = ObjectUtil_wx4.objToArray(listObj);
        ArrayUtil_wx4.sortByField(list,['id'],[0]);
        this.list.dataProvider = new eui.ArrayCollection(list)

        this.lastSelectGun = this.towerPos[this.key];
        if(this.lastSelectGun)
        {
            this.setTitle('更换塔器')
            this.okBtn.label="更换塔器"
            this.currentState = 's2'

            var index = -1;
            for(var i=0;i<list.length;i++)
            {
                if(list[i].id == this.towerPos[this.key])
                {
                    index = i;
                    break;
                }
            }
            this.list.selectedIndex = index;
        }
        else
        {
            this.setTitle('装备塔器')
            this.okBtn.label="装备塔器"
            this.currentState = 's1'
            this.list.selectedIndex = -1;
        }

        MyTool.removeMC(this.okBtn);
    }



    public renewChoose(){
        if(!this.list.selectedItem)
            return;
        this.currentState = 's2'
        if(this.list.selectedItem.id != this.lastSelectGun)//换了武器
        {
            if(this.listObj[this.lastSelectGun])
                this.listObj[this.lastSelectGun].num ++;
            this.lastSelectGun = this.list.selectedItem.id
            this.listObj[this.lastSelectGun].num --;
            MyTool.runListFun(this.list,'renewNum')

            if(this.lastSelectGun == this.towerPos[this.key])
                MyTool.removeMC(this.okBtn);
            else
                this.btnGroup.addChild(this.okBtn);
        }

        this.renewGunInfo(this.list.selectedItem)
        MyTool.runListFun(this.list,'setSelect')
    }

    private renewGunInfo(data){
        var gvo = GunVO.getObject(data.id)
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

